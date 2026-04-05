import type { NeonQueryFunction } from "@neondatabase/serverless"
import type pg from "pg"

type SqlTagFn = NeonQueryFunction<false, false>

export async function createSqlClient(): Promise<SqlTagFn> {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set")
  }

  const dbType = process.env.DB_TYPE ?? "neon"

  if (dbType === "postgres") {
    const { Pool } = await import("pg")
    const pool = new Pool({ connectionString: databaseUrl })

    // Return a tagged template function compatible with neon's sql`` interface
    const sql = ((strings: TemplateStringsArray, ...values: unknown[]) => {
      const text = strings.reduce(
        (acc, str, i) => acc + str + (i < values.length ? `$${i + 1}` : ""),
        "",
      )
      return pool.query(text, values as pg.QueryResultRow[]).then((r) => r.rows)
    }) as SqlTagFn

    return sql
  }

  const { neon } = await import("@neondatabase/serverless")
  return neon(databaseUrl)
}
