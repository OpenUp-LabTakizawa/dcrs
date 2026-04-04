import { neon } from "@neondatabase/serverless"
import { test as teardown } from "@playwright/test"
import { TEST_HANDICAP_USERS, TEST_UNIQUE_ID } from "./fixtures/auth-constants"

teardown("clean up test data", async () => {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set")
  }
  const sql = neon(databaseUrl)

  // Clean up auth data
  await sql`DELETE FROM "session" WHERE "userId" = ${TEST_UNIQUE_ID}`
  await sql`DELETE FROM "account" WHERE "userId" = ${TEST_UNIQUE_ID}`
  await sql`DELETE FROM "user" WHERE id = ${TEST_UNIQUE_ID}`

  // Clean up handicap test data
  const employeeIds = TEST_HANDICAP_USERS.map((u) => u.employeeId)
  await sql`DELETE FROM "handicap" WHERE "employeeId" = ANY(${employeeIds})`

  // Note: Test images in Vercel Blob are intentionally NOT deleted here.
  // Vercel Blob has a CDN cache (up to 1 minute) that can cause get() to
  // return null immediately after delete + re-upload with the same key.
  // The images are overwritten on each setup run with allowOverwrite: true.
})
