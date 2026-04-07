import { test as teardown } from "@playwright/test"
import { storageClient } from "@/app/lib/storage"
import { TEST_HANDICAP_USERS, TEST_UNIQUE_ID } from "./fixtures/auth-constants"
import { createSqlClient } from "./fixtures/sql-client"

teardown("clean up test data", async () => {
  const sql = await createSqlClient()

  // Clean up auth data
  await sql`DELETE FROM "session" WHERE "userId" = ${TEST_UNIQUE_ID}`
  await sql`DELETE FROM "account" WHERE "userId" = ${TEST_UNIQUE_ID}`
  await sql`DELETE FROM "user" WHERE id = ${TEST_UNIQUE_ID}`

  // Clean up handicap test data
  const employeeIds = TEST_HANDICAP_USERS.map((u) => u.employeeId)
  await sql`DELETE FROM "handicap" WHERE "employeeId" = ANY(${employeeIds})`

  // Clean up test images from storage
  for (const user of TEST_HANDICAP_USERS) {
    await storageClient.delete(user.image)
  }
})
