import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js"

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  name: text("name").notNull(),
  company: text("company").notNull(),
  employeeId: text("employeeId").notNull().unique(),
  telephone: text("telephone").notNull(),
  email: text("email").notNull(),
  image: text("image").notNull(),
})
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export const db: PostgresJsDatabase<Record<string, never>> = drizzle(
  process.env.POSTGRES_URL || "",
)
