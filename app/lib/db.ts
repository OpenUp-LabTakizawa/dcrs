import { createDb, type DbClient } from "@/app/lib/create-db"

export type { DbClient }

// `db` is deliberately the only runtime export: test files mock
// "@/app/lib/db" to swap it out, and `mock.module` replaces the whole module
// namespace. Keeping `createDb` in its own module means those mocks cannot
// hide it from the tests that exercise it for real.
export const db: DbClient = await createDb()
