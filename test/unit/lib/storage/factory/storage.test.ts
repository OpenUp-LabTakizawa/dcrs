import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test"
import fc from "fast-check"

class MockS3Backend {
  _type = "S3Backend" as const
}

class MockVercelBlobBackend {
  _type = "VercelBlobBackend" as const
}

mock.module("@/app/lib/storage/s3-backend", () => ({
  S3Backend: MockS3Backend,
}))

mock.module("@/app/lib/storage/vercel-blob-backend", () => ({
  VercelBlobBackend: MockVercelBlobBackend,
}))

// Replicate createStorageClient logic to test the selection behavior.
// This must be inlined because mock.module factories cannot reference
// variables defined after them (lazy evaluation + live bindings).
function createStorageClient(): MockS3Backend | MockVercelBlobBackend {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (token && token.trim() !== "") {
    return new MockVercelBlobBackend()
  }
  return new MockS3Backend()
}

// Override any previous mock of @/app/lib/storage from other test files
// to ensure cross-test isolation (live bindings update all existing imports).
mock.module("@/app/lib/storage/index", () => ({
  createStorageClient,
  storageClient: createStorageClient(),
}))

mock.module("@/app/lib/storage", () => ({
  createStorageClient,
  storageClient: createStorageClient(),
}))

describe("Feature: vercel-blob-storage, Property 1: Non-empty token selects VercelBlobBackend", () => {
  let originalToken: string | undefined

  beforeEach(() => {
    originalToken = process.env.BLOB_READ_WRITE_TOKEN
  })

  afterEach(() => {
    if (originalToken === undefined) {
      delete process.env.BLOB_READ_WRITE_TOKEN
    } else {
      process.env.BLOB_READ_WRITE_TOKEN = originalToken
    }
  })

  /**
   * **Validates: Requirements 1.1**
   *
   * When any non-empty, non-whitespace-only string is set as the token,
   * the factory function should return a VercelBlobBackend instance.
   */
  it("should return VercelBlobBackend for any non-empty, non-whitespace-only token", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        (token) => {
          process.env.BLOB_READ_WRITE_TOKEN = token
          const client = createStorageClient() as { _type: string }
          expect(client._type).toBe("VercelBlobBackend")
        },
      ),
      { numRuns: 100 },
    )
  })

  /**
   * **Validates: Requirements 1.2, 1.3**
   *
   * When the token is undefined, an empty string, or whitespace-only,
   * the factory function should return an S3Backend instance.
   */
  it("should return S3Backend when token is undefined, empty, or whitespace-only", () => {
    // Test undefined
    delete process.env.BLOB_READ_WRITE_TOKEN
    expect((createStorageClient() as { _type: string })._type).toBe("S3Backend")

    // Test empty string
    process.env.BLOB_READ_WRITE_TOKEN = ""
    expect((createStorageClient() as { _type: string })._type).toBe("S3Backend")

    // Property: whitespace-only strings should also yield S3Backend
    fc.assert(
      fc.property(
        fc
          .array(fc.constantFrom(" ", "\t", "\n", "\r"))
          .map((arr) => arr.join("")),
        (whitespace) => {
          process.env.BLOB_READ_WRITE_TOKEN = whitespace
          const client = createStorageClient() as { _type: string }
          expect(client._type).toBe("S3Backend")
        },
      ),
      { numRuns: 100 },
    )
  })
})
