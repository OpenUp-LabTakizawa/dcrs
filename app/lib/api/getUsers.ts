import { db } from "@/app/lib/db"
import { handicap, type User } from "@/app/lib/schema"

export async function getUsers(): Promise<{ getUsers: User[] }> {
  const getUsers: User[] = await db.select().from(handicap)
  return { getUsers }
}
