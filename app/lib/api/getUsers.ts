import type { User } from "@/app/lib/schema"
import { baseUrl } from "./baseUrl"

export async function getUsers(): Promise<{ getUsers: User[] }> {
  const res = await fetch(`${baseUrl}/api/users`)
  if (!res.ok) {
    throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`)
  }
  return res.json()
}
