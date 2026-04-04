import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test"
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3"
import { TEST_BUCKET } from "@/app/lib/constant"
import { client, getClient, S3Backend } from "@/app/lib/storage/s3-backend"

describe("S3Backend", () => {
  let backend: S3Backend
  let mockSend: ReturnType<typeof spyOn>

  beforeEach(() => {
    process.env.S3_ACCESS_KEY_ID = "test-key"
    process.env.S3_SECRET_ACCESS_KEY = "test-secret"
    process.env.S3_REGION = "ap-northeast-1"
    getClient()
    mockSend = spyOn(client, "send").mockResolvedValue({} as never)
    delete process.env.S3_BUCKET
    backend = new S3Backend()
  })

  afterEach(() => {
    mockSend.mockRestore()
  })

  describe("upload()", () => {
    it("should send PutObjectCommand with correct params and return { url: key }", async () => {
      mockSend.mockResolvedValueOnce({} as never)

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
      } as never)

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
      mockSend.mockResolvedValueOnce({} as never)

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
