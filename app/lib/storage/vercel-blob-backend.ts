import { del, head, put } from "@vercel/blob"
import type { GetResult, StorageClient, UploadParams } from "./index"

export class VercelBlobBackend implements StorageClient {
  async upload(params: UploadParams): Promise<{ url: string }> {
    const blob = await put(params.key, params.body, {
      access: "public",
      contentType: params.contentType,
      addRandomSuffix: false,
    })
    return { url: blob.url }
  }

  async get(key: string): Promise<GetResult> {
    const blobInfo = await head(key)
    const response = await fetch(blobInfo.url)
    if (!response.ok || !response.body) {
      throw new Error(`Failed to fetch blob: ${key}`)
    }
    return {
      body: response.body,
      contentType: blobInfo.contentType,
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await del(key)
    } catch {
      // Ignore errors when the blob does not exist
    }
  }
}
