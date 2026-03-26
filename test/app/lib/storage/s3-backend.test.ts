import { beforeEach, describe, expect, it, mock } from "bun:test"
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3"

// Mock the S3 client
const mockSend = mock((_cmd: unknown) => Promise.resolve({}))

mock.module("@/app/lib/s3client", () => ({
  client: { send: mockSend },
}))

const { TEST_BUCKET } = await import("@/app/lib/constant")
const { S3Backend } = await import("@/app/lib/storage/s3-backend")

describe("S3Backend", () => {
  let backend: InstanceType<typeof S3Backend>

  beforeEach(() => {
    mockSend.mockClear()
    delete process.env.S3_BUCKET
    backend = new S3Backend()
  })

  describe("upload()", () => {
    it("should send PutObjectCommand with correct params and return { url: key }", async () => {
      mockSend.mockResolvedValueOnce({})

      const params = {
        key: "images/test.png",
        body: Buffer.from("fake-image-data"),
        contentType: "image/png",
      }

      const result = await backend.upload(params)

      expect(result).toEqual({ url: "images/test.png" })
      expect(mockSend).toHaveBeenCalledTimes(1)

      const command = mockSend.mock.calls.at(0)?.[0] as InstanceType<
        typeof PutObjectCommand
      >
      expect(command).toBeInstanceOf(PutObjectCommand)
      expect(command.input).toEqual({
        ACL: "private",
        Bucket: TEST_BUCKET,
        Key: "images/test.png",
        Body: Buffer.from("fake-image-data"),
        ContentType: "image/png",
      })
    })
  })

  describe("get()", () => {
    it("should send GetObjectCommand with correct params and return body + contentType", async () => {
      const fakeBody = new ReadableStream()
      mockSend.mockResolvedValueOnce({
        Body: fakeBody,
        ContentType: "image/jpeg",
      })

      const result = await backend.get("images/photo.jpg")

      expect(result).toEqual({
        body: fakeBody,
        contentType: "image/jpeg",
      })
      expect(mockSend).toHaveBeenCalledTimes(1)

      const command = mockSend.mock.calls.at(0)?.[0] as InstanceType<
        typeof GetObjectCommand
      >
      expect(command).toBeInstanceOf(GetObjectCommand)
      expect(command.input).toEqual({
        Bucket: TEST_BUCKET,
        Key: "images/photo.jpg",
      })
    })
  })

  describe("delete()", () => {
    it("should send DeleteObjectCommand with correct params", async () => {
      mockSend.mockResolvedValueOnce({})

      await backend.delete("images/old.png")

      expect(mockSend).toHaveBeenCalledTimes(1)

      const command = mockSend.mock.calls.at(0)?.[0] as InstanceType<
        typeof DeleteObjectCommand
      >
      expect(command).toBeInstanceOf(DeleteObjectCommand)
      expect(command.input).toEqual({
        Bucket: TEST_BUCKET,
        Key: "images/old.png",
      })
    })
  })
})
