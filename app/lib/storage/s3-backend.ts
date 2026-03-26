import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3"
import { TEST_BUCKET } from "@/app/lib/constant"
import { client } from "@/app/lib/s3client"
import type { GetResult, StorageClient, UploadParams } from "./index"

export class S3Backend implements StorageClient {
  private bucket = process.env.S3_BUCKET || TEST_BUCKET

  async upload(params: UploadParams): Promise<{ url: string }> {
    await client.send(
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
    const response = await client.send(
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
    await client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    )
  }
}
