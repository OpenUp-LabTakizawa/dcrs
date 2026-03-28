import { afterAll, beforeEach, describe, expect, it, mock } from "bun:test"
import fc from "fast-check"

// In-memory blob store to simulate Vercel Blob
const blobStore = new Map<
  string,
  { url: string; contentType: string; data: Buffer }
>()

mock.module("@vercel/blob", () => ({
  put: async (key: string, body: Buffer, opts: { contentType: string }) => {
    const url = `https://blob.vercel-storage.com/${key}`
    blobStore.set(key, {
      url,
      contentType: opts.contentType,
      data: Buffer.from(body),
    })
    return { url }
  },
  get: async (key: string) => {
    const entry = blobStore.get(key)
    if (!entry) {
      return null
    }
    return {
      statusCode: 200,
      stream: new ReadableStream({
        start(controller) {
          controller.enqueue(new Uint8Array(entry.data))
          controller.close()
        },
      }),
      blob: {
        url: entry.url,
        contentType: entry.contentType,
      },
    }
  },
  head: async (key: string) => {
    const entry = blobStore.get(key)
    if (!entry) {
      throw new Error("BlobNotFoundError")
    }
    return { url: entry.url, contentType: entry.contentType }
  },
  del: async (key: string) => {
    blobStore.delete(key)
  },
}))

// Mock global fetch to return data from blobStore
const originalFetch = globalThis.fetch
globalThis.fetch = (async (input: string | URL | Request) => {
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url
  for (const entry of blobStore.values()) {
    if (entry.url === url) {
      return new Response(new Uint8Array(entry.data), {
        headers: { "Content-Type": entry.contentType },
      })
    }
  }
  throw new Error(`Not found: ${url}`)
}) as typeof globalThis.fetch

const { VercelBlobBackend } = await import(
  "@/app/lib/storage/vercel-blob-backend"
)

afterAll(() => {
  globalThis.fetch = originalFetch
})

describe("Feature: vercel-blob-storage, Property 2: Upload then get round-trip", () => {
  let backend: InstanceType<typeof VercelBlobBackend>

  beforeEach(() => {
    blobStore.clear()
    backend = new VercelBlobBackend()
  })

  /**
   * **Validates: Requirements 3.1, 3.2, 3.4, 4.1, 4.2**
   *
   * For any combination of binary data, content type, and key name,
   * uploading and then getting with the same key returns the original content type.
   */
  it("should round-trip: upload then get returns same contentType", () => {
    fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        fc.uint8Array({ minLength: 1 }),
        fc.constantFrom("image/png", "image/jpeg", "image/webp"),
        async (key, data, contentType) => {
          blobStore.clear()
          const buffer = Buffer.from(data)
          await backend.upload({ key, body: buffer, contentType })
          const result = await backend.get(key)
          expect(result.contentType).toBe(contentType)
        },
      ),
      { numRuns: 100 },
    )
  })
})

describe("Feature: vercel-blob-storage, Property 3: Upload then delete makes get fail", () => {
  let backend: InstanceType<typeof VercelBlobBackend>

  beforeEach(() => {
    blobStore.clear()
    backend = new VercelBlobBackend()
  })

  /**
   * **Validates: Requirements 5.1**
   *
   * For any binary data and key name, after uploading and then deleting,
   * attempting to get the same key should throw an error.
   */
  it("should fail to get after upload then delete", () => {
    fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        fc.uint8Array({ minLength: 1 }),
        async (key, data) => {
          blobStore.clear()
          const buffer = Buffer.from(data)
          await backend.upload({
            key,
            body: buffer,
            contentType: "image/png",
          })
          await backend.delete(key)
          await expect(backend.get(key)).rejects.toThrow()
        },
      ),
      { numRuns: 100 },
    )
  })
})
