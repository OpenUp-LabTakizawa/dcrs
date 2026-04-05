import { afterEach, describe, expect, it } from "bun:test"

const entityKind = Symbol.for("drizzle:entityKind")

// Save original env values
const originalDbType = process.env.DB_TYPE
const originalDatabaseUrl = process.env.DATABASE_URL

// Ensure DATABASE_URL is set for module-level createDb() call in db.ts
process.env.DATABASE_URL =
  process.env.DATABASE_URL ?? "postgresql://user:pass@localhost:5432/testdb"

const { createDb } = await import("@/app/lib/db")

describe("createDb driver selection", () => {
  afterEach(() => {
    if (originalDatabaseUrl !== undefined) {
      process.env.DATABASE_URL = originalDatabaseUrl
    } else {
      delete process.env.DATABASE_URL
    }
    if (originalDbType !== undefined) {
      process.env.DB_TYPE = originalDbType
    } else {
      delete process.env.DB_TYPE
    }
  })

  it("selects node-postgres driver when DB_TYPE=postgres", async () => {
    process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/testdb"
    process.env.DB_TYPE = "postgres"

    const db = await createDb()
    const kind = (db.constructor as Record<symbol, string>)[entityKind]

    expect(kind).toBe("NodePgDatabase")
  })

  it("selects Neon driver when DB_TYPE=neon", async () => {
    process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/testdb"
    process.env.DB_TYPE = "neon"

    const db = await createDb()
    const kind = (db.constructor as Record<symbol, string>)[entityKind]

    expect(kind).toBe("NeonHttpDatabase")
  })

  it("defaults to Neon driver when DB_TYPE is unset", async () => {
    process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/testdb"
    delete process.env.DB_TYPE

    const db = await createDb()
    const kind = (db.constructor as Record<symbol, string>)[entityKind]

    expect(kind).toBe("NeonHttpDatabase")
  })

  it("throws error when DATABASE_URL is unset", async () => {
    delete process.env.DATABASE_URL

    expect(createDb()).rejects.toThrow("DATABASE_URL is not set")
  })
})
