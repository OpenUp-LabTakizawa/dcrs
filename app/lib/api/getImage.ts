import { storageClient } from "@/app/lib/storage"

export async function getImage(
  path: Readonly<string>,
): Promise<{ body: ReadableStream; contentType: string }> {
  const result = await storageClient.get(path)
  if (!result.body) {
    throw new Error(`Image not found or empty: ${path}`)
  }
  return result
}
