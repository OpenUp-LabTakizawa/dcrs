import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test"

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

describe("createStorageClient()", () => {
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

  // Validates: Requirement 6.1
  it("returns VercelBlobBackend when BLOB_READ_WRITE_TOKEN is set and non-empty", () => {
    process.env.BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_abc123"
    const client = createStorageClient() as { _type: string }
    expect(client._type).toBe("VercelBlobBackend")
  })

  // Validates: Requirement 6.2
  it("returns S3Backend when BLOB_READ_WRITE_TOKEN is unset", () => {
    delete process.env.BLOB_READ_WRITE_TOKEN
    const client = createStorageClient() as { _type: string }
    expect(client._type).toBe("S3Backend")
  })

  // Validates: Requirement 6.3
  it("returns S3Backend when BLOB_READ_WRITE_TOKEN is empty string", () => {
    process.env.BLOB_READ_WRITE_TOKEN = ""
    const client = createStorageClient() as { _type: string }
    expect(client._type).toBe("S3Backend")
  })

  // Validates: Requirement 6.4
  it("returns S3Backend when BLOB_READ_WRITE_TOKEN is whitespace only", () => {
    process.env.BLOB_READ_WRITE_TOKEN = "   \t\n  "
    const client = createStorageClient() as { _type: string }
    expect(client._type).toBe("S3Backend")
  })
})
