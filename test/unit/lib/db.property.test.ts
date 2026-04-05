import { afterEach, describe, expect, it } from "bun:test"
import fc from "fast-check"

const entityKind = Symbol.for("drizzle:entityKind")

// Save original env values
const originalDbType = process.env.DB_TYPE
const originalDatabaseUrl = process.env.DATABASE_URL

// Ensure DATABASE_URL is set for module-level createDb() call in db.ts
process.env.DATABASE_URL =
  process.env.DATABASE_URL ?? "postgresql://user:pass@localhost:5432/testdb"

const { createDb } = await import("@/app/lib/db")

describe("Feature: dual-database-support, Property 1: Driver selection is determined solely by DB_TYPE value", () => {
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

  /**
   * **Validates: Requirements 1.1, 1.2, 1.3**
   *
   * For any string value of DB_TYPE, the driver selection function SHALL return
   * the postgres driver if and only if DB_TYPE === "postgres", and the Neon
   * driver for all other values (including undefined, empty string, arbitrary strings).
   */
  it("selects postgres driver iff DB_TYPE === 'postgres', else Neon", async () => {
    const dbTypeArbitrary = fc.oneof(fc.constant(undefined), fc.string())

    await fc.assert(
      fc.asyncProperty(dbTypeArbitrary, async (dbType) => {
        process.env.DATABASE_URL =
          "postgresql://user:pass@localhost:5432/testdb"

        if (dbType === undefined) {
          delete process.env.DB_TYPE
        } else {
          process.env.DB_TYPE = dbType
        }

        const db = await createDb()
        const kind = (db.constructor as Record<symbol, string>)[entityKind]

        if (dbType === "postgres") {
          expect(kind).toBe("NodePgDatabase")
        } else {
          expect(kind).toBe("NeonHttpDatabase")
        }
      }),
      { numRuns: 100 },
    )
  })
})

describe("Feature: dual-database-support, Property 2: Missing DATABASE_URL always throws regardless of DB_TYPE", () => {
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

  /**
   * **Validates: Requirements 1.4**
   *
   * For any string value of DB_TYPE (including undefined), if DATABASE_URL is
   * not set, the database module initialization SHALL throw an error with the
   * message "DATABASE_URL is not set".
   */
  it("throws 'DATABASE_URL is not set' for any DB_TYPE when DATABASE_URL is missing", async () => {
    const dbTypeArbitrary = fc.oneof(fc.constant(undefined), fc.string())

    await fc.assert(
      fc.asyncProperty(dbTypeArbitrary, async (dbType) => {
        delete process.env.DATABASE_URL

        if (dbType === undefined) {
          delete process.env.DB_TYPE
        } else {
          process.env.DB_TYPE = dbType
        }

        expect(createDb()).rejects.toThrow("DATABASE_URL is not set")
      }),
      { numRuns: 100 },
    )
  })
})
