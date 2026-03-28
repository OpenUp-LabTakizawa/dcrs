import { del, get, put } from "@vercel/blob"
import type { GetResult, StorageClient, UploadParams } from "./index"

export class VercelBlobBackend implements StorageClient {
  async upload(params: UploadParams): Promise<{ url: string }> {
    const blob = await put(params.key, params.body, {
      access: "private",
      contentType: params.contentType,
      addRandomSuffix: false,
    })
    return { url: blob.url }
  }

  async get(key: string): Promise<GetResult> {
    const result = await get(key, { access: "private" })
    if (!result || result.statusCode !== 200 || !result.stream) {
      throw new Error(`Failed to fetch blob: ${key}`)
    }
    return {
      body: result.stream,
      contentType: result.blob.contentType ?? "application/octet-stream",
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
