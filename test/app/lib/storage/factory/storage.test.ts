import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test"
import fc from "fast-check"

// Mock the backend modules before importing the factory function
mock.module("@/app/lib/storage/s3-backend", () => ({
  S3Backend: class S3Backend {
    _type = "S3Backend" as const
  },
}))

mock.module("@/app/lib/storage/vercel-blob-backend", () => ({
  VercelBlobBackend: class VercelBlobBackend {
    _type = "VercelBlobBackend" as const
  },
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
          // Re-import to get fresh factory function call
          const { createStorageClient } = require("@/app/lib/storage/index")
          const client = createStorageClient()
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
    const { createStorageClient: create1 } = require("@/app/lib/storage/index")
    expect(create1()._type).toBe("S3Backend")

    // Test empty string
    process.env.BLOB_READ_WRITE_TOKEN = ""
    const { createStorageClient: create2 } = require("@/app/lib/storage/index")
    expect(create2()._type).toBe("S3Backend")

    // Property: whitespace-only strings should also yield S3Backend
    fc.assert(
      fc.property(
        fc
          .array(fc.constantFrom(" ", "\t", "\n", "\r"))
          .map((arr) => arr.join("")),
        (whitespace) => {
          process.env.BLOB_READ_WRITE_TOKEN = whitespace
          const { createStorageClient: create } = require("@/app/lib/storage/index")
          const client = create()
          expect(client._type).toBe("S3Backend")
        },
      ),
      { numRuns: 100 },
    )
  })
})
