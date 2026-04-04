import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import { TEST_BUCKET } from "@/app/lib/constant"
import type { GetResult, StorageClient, UploadParams } from "./index"

function createS3Client(): S3Client {
  const region = process.env.S3_REGION ?? process.env.AWS_REGION
  if (!region) {
    throw new Error(
      "S3 region is not configured. Please set S3_REGION or AWS_REGION in the environment.",
    )
  }

  const accessKeyId = process.env.S3_ACCESS_KEY_ID
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY
  if (!accessKeyId || !secretAccessKey) {
    throw new Error(
      "S3 credentials are not configured. Please set S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY in the environment.",
    )
  }

  return new S3Client({
    credentials: { accessKeyId, secretAccessKey },
    region,
  })
}

export let client: S3Client

export function getClient(): S3Client {
  if (!client) {
    client = createS3Client()
  }
  return client
}

export class S3Backend implements StorageClient {
  private bucket = process.env.S3_BUCKET || TEST_BUCKET

  async upload(params: UploadParams): Promise<{ url: string }> {
    await getClient().send(
      new PutObjectCommand({
        ACL: "private",
        Bucket: this.bucket,
        Key: params.key,
        Body: params.body,
        ContentType: params.contentType,
      }),
    )
    return { url: params.key }
  }

  async get(key: string): Promise<GetResult> {
    const response = await getClient().send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    )
    return {
      body: response.Body as ReadableStream,
      contentType: response.ContentType as string,
    }
  }

  async delete(key: string): Promise<void> {
    await getClient().send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    )
  }
}
