import { baseUrl } from "./baseUrl"

export async function getImage(path: Readonly<string>): Promise<Response> {
  const res = await fetch(`${baseUrl}/api/image/${encodeURIComponent(path)}`)
  if (!res.ok) {
    throw new Error(`Failed to fetch image: ${res.status} ${res.statusText}`)
  }
  return res
}
