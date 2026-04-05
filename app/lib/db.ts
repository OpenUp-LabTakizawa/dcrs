import type { NeonHttpDatabase } from "drizzle-orm/neon-http"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"

export type DbClient = NeonHttpDatabase | NodePgDatabase

export async function createDb(): Promise<DbClient> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set")
  }

  const connectionString = process.env.DATABASE_URL
  const dbType = process.env.DB_TYPE ?? "neon"

  if (dbType === "postgres") {
    const { drizzle } = await import("drizzle-orm/node-postgres")
    const { Pool } = await import("pg")
    return drizzle(new Pool({ connectionString }))
  }

  const { neon } = await import("@neondatabase/serverless")
  const { drizzle } = await import("drizzle-orm/neon-http")
  return drizzle(neon(connectionString))
}

export const db: DbClient = await createDb()
