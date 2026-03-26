export interface UploadParams {
  key: string
  body: Buffer
  contentType: string
}

export interface GetResult {
  body: ReadableStream
  contentType: string
}

export interface StorageClient {
  upload(params: UploadParams): Promise<{ url: string }>
  get(key: string): Promise<GetResult>
  delete(key: string): Promise<void>
}

import { S3Backend } from "./s3-backend"
import { VercelBlobBackend } from "./vercel-blob-backend"

export function createStorageClient(): StorageClient {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (token && token.trim() !== "") {
    return new VercelBlobBackend()
  }
  return new S3Backend()
}

export const storageClient: StorageClient = createStorageClient()
