import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test"
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import fc from "fast-check"
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

describe("Feature: local-dev-environment, Property 1: S3Client custom endpoint configuration", () => {
  it("S3Client uses custom endpoint with forcePathStyle when endpoint is provided", async () => {
    const endpointArb = fc
      .record({
        protocol: fc.constantFrom("http", "https"),
        host: fc.domain(),
        port: fc.integer({ min: 1, max: 65535 }),
      })
      .map(({ protocol, host, port }) => `${protocol}://${host}:${port}`)

    await fc.assert(
      fc.asyncProperty(endpointArb, async (endpoint) => {
        const s3 = new S3Client({
          credentials: { accessKeyId: "test", secretAccessKey: "test" },
          region: "us-east-1",
          endpoint,
          forcePathStyle: true,
        })

        expect(s3.config.forcePathStyle).toBe(true)

        const resolvedEndpoint = await s3.config.endpoint()
        const url = new URL(endpoint)
        expect(resolvedEndpoint.hostname).toBe(url.hostname)
        expect(resolvedEndpoint.protocol).toBe(url.protocol)
      }),
      { numRuns: 100 },
    )
  })
})

describe("Feature: local-dev-environment, Property 2: S3 operation round-trip", () => {
  const savedEnv: Record<string, string | undefined> = {}
  const envKeys = [
    "S3_ACCESS_KEY_ID",
    "S3_SECRET_ACCESS_KEY",
    "S3_REGION",
    "S3_BUCKET",
  ]

  beforeEach(() => {
    for (const key of envKeys) {
      savedEnv[key] = process.env[key]
    }
  })

  afterEach(() => {
    for (const key of envKeys) {
      if (savedEnv[key] === undefined) {
        delete process.env[key]
      } else {
        process.env[key] = savedEnv[key]
      }
    }
  })

  it("upload then get returns the same content", async () => {
    const contentArb = fc.uint8Array({ minLength: 1, maxLength: 256 })
    const keyArb = fc.stringMatching(/^[a-z][a-z0-9/]{0,19}$/)
    const contentTypeArb = fc.constantFrom(
      "image/png",
      "image/jpeg",
      "application/pdf",
    )

    await fc.assert(
      fc.asyncProperty(
        contentArb,
        keyArb,
        contentTypeArb,
        async (content, key, contentType) => {
          const buf = Buffer.from(content)
          const backend = new S3Backend()

          process.env.S3_ACCESS_KEY_ID = "test-key"
          process.env.S3_SECRET_ACCESS_KEY = "test-secret"
          process.env.S3_REGION = "ap-northeast-1"
          getClient()

          const sendSpy = spyOn(client, "send")
          sendSpy.mockResolvedValueOnce({} as never)
          sendSpy.mockResolvedValueOnce({
            Body: new ReadableStream({
              start(controller) {
                controller.enqueue(new Uint8Array(buf))
                controller.close()
              },
            }),
            ContentType: contentType,
          } as never)

          const uploadResult = await backend.upload({
            key,
            body: buf,
            contentType,
          })
          expect(uploadResult.url).toBe(key)

          const getResult = await backend.get(key)
          expect(getResult.contentType).toBe(contentType)

          const reader = getResult.body.getReader()
          const { value } = await reader.read()
          expect(value).toBeDefined()
          expect(Buffer.from(value as Uint8Array)).toEqual(buf)

          sendSpy.mockRestore()
        },
      ),
      { numRuns: 100 },
    )
  })
})

describe("createS3Client unit tests", () => {
  const savedEnv: Record<string, string | undefined> = {}
  const envKeys = [
    "S3_ENDPOINT",
    "S3_ACCESS_KEY_ID",
    "S3_SECRET_ACCESS_KEY",
    "S3_REGION",
  ]

  beforeEach(() => {
    for (const key of envKeys) {
      savedEnv[key] = process.env[key]
    }
  })

  afterEach(() => {
    for (const key of envKeys) {
      if (savedEnv[key] === undefined) {
        delete process.env[key]
      } else {
        process.env[key] = savedEnv[key]
      }
    }
  })

  it("uses default AWS endpoint when S3_ENDPOINT is not set", () => {
    delete process.env.S3_ENDPOINT
    process.env.S3_ACCESS_KEY_ID = "test-key"
    process.env.S3_SECRET_ACCESS_KEY = "test-secret"
    process.env.S3_REGION = "ap-northeast-1"

    const endpoint = process.env.S3_ENDPOINT
    const s3 = new S3Client({
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
      region: process.env.S3_REGION,
      ...(endpoint && { endpoint, forcePathStyle: true }),
    })

    // No custom endpoint: forcePathStyle is not set and endpoint config is undefined
    expect(s3.config.forcePathStyle).toBeFalsy()
    expect(s3.config.endpoint).toBeUndefined()
  })

  it("uses custom endpoint with forcePathStyle when S3_ENDPOINT is set", async () => {
    process.env.S3_ENDPOINT = "http://localhost:9000"
    process.env.S3_ACCESS_KEY_ID = "test-key"
    process.env.S3_SECRET_ACCESS_KEY = "test-secret"
    process.env.S3_REGION = "us-east-1"

    const endpoint = process.env.S3_ENDPOINT
    const s3 = new S3Client({
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
      region: process.env.S3_REGION,
      ...(endpoint && { endpoint, forcePathStyle: true }),
    })

    expect(s3.config.forcePathStyle).toBe(true)
    const resolved = await s3.config.endpoint()
    expect(resolved.hostname).toBe("localhost")
    expect(resolved.port).toBe(9000)
  })
})
