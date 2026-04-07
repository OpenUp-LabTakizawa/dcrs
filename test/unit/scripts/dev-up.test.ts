import { describe, expect, it, mock, spyOn } from "bun:test"
import type { CreateBucketCommand, S3Client } from "@aws-sdk/client-s3"
import fc from "fast-check"
import { createBucketIfNotExists } from "@/scripts/dev-up"

function createMockS3Client(sendMock: ReturnType<typeof mock>): S3Client {
  return { send: sendMock } as unknown as S3Client
}

describe("Feature: local-dev-environment, Property 3: Idempotent bucket creation", () => {
  it("calling createBucketIfNotExists N times produces the same result as calling it once", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 10 }),
        fc.stringMatching(/^[a-z][a-z0-9-]{2,15}$/),
        async (n, bucket) => {
          const sendMock = mock(() => Promise.resolve({}))
          // First call succeeds, subsequent calls throw BucketAlreadyOwnedByYou
          sendMock.mockResolvedValueOnce({})
          for (let i = 1; i < n; i++) {
            const err = new Error("Bucket already owned")
            err.name = "BucketAlreadyOwnedByYou"
            sendMock.mockRejectedValueOnce(err)
          }

          const client = createMockS3Client(sendMock)
          const consoleSpy = spyOn(console, "log").mockImplementation(() => {})

          for (let i = 0; i < n; i++) {
            await createBucketIfNotExists(client, bucket)
          }

          expect(sendMock).toHaveBeenCalledTimes(n)
          consoleSpy.mockRestore()
        },
      ),
      { numRuns: 100 },
    )
  })
})

describe("createBucketIfNotExists", () => {
  it("creates bucket when it does not exist", async () => {
    const sendMock = mock(() => Promise.resolve({}))
    const client = createMockS3Client(sendMock)
    const consoleSpy = spyOn(console, "log").mockImplementation(() => {})

    await createBucketIfNotExists(client, "test-bucket")

    expect(sendMock).toHaveBeenCalledTimes(1)
    const command = sendMock.mock.calls[0]?.[0] as CreateBucketCommand
    expect(command.input).toEqual({ Bucket: "test-bucket" })
    consoleSpy.mockRestore()
  })

  it("skips creation when bucket already exists", async () => {
    const err = new Error("Bucket already owned")
    err.name = "BucketAlreadyOwnedByYou"
    const sendMock = mock(() => Promise.reject(err))
    const client = createMockS3Client(sendMock)
    const consoleSpy = spyOn(console, "log").mockImplementation(() => {})

    await createBucketIfNotExists(client, "existing-bucket")

    expect(sendMock).toHaveBeenCalledTimes(1)
    consoleSpy.mockRestore()
  })

  it("throws on unexpected errors", async () => {
    const sendMock = mock(() => Promise.reject(new Error("Connection refused")))
    const client = createMockS3Client(sendMock)

    await expect(createBucketIfNotExists(client, "bucket")).rejects.toThrow(
      "Connection refused",
    )
  })
})
