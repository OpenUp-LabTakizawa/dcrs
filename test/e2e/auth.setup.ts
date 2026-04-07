import crypto from "node:crypto"
import fs from "node:fs/promises"
import path from "node:path"
import { test as setup } from "@playwright/test"
import { storageClient } from "@/app/lib/storage"
import {
  TEST_HANDICAP_USERS,
  TEST_UNIQUE_ID,
  TEST_USER,
} from "./fixtures/auth-constants"
import { createSqlClient } from "./fixtures/sql-client"

setup("create authenticated session and seed test data", async () => {
  const authSecret = process.env.BETTER_AUTH_SECRET
  if (!authSecret) {
    throw new Error("BETTER_AUTH_SECRET is not set")
  }

  const sql = await createSqlClient()
  const now = new Date()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  // Create HMAC signature for session token
  const signature = crypto
    .createHmac("sha256", authSecret)
    .update(TEST_USER.sessionToken)
    .digest("base64")
  const signedValue = `${TEST_USER.sessionToken}.${signature}`

  // Upsert test auth user
  await sql`
    INSERT INTO "user" (id, name, email, "emailVerified", "createdAt", "updatedAt")
    VALUES (${TEST_UNIQUE_ID}, ${TEST_USER.name}, ${TEST_USER.email}, true, ${now.toISOString()}, ${now.toISOString()})
    ON CONFLICT (id) DO UPDATE SET "updatedAt" = ${now.toISOString()}
  `

  // Upsert test session
  await sql`
    INSERT INTO "session" (id, token, "userId", "expiresAt", "createdAt", "updatedAt")
    VALUES (${TEST_UNIQUE_ID}, ${TEST_USER.sessionToken}, ${TEST_UNIQUE_ID}, ${expiresAt.toISOString()}, ${now.toISOString()}, ${now.toISOString()})
    ON CONFLICT (token) DO UPDATE SET
      "expiresAt" = ${expiresAt.toISOString()},
      "updatedAt" = ${now.toISOString()}
  `

  // Clean up any leftover handicap test data first
  const employeeIds = TEST_HANDICAP_USERS.map((u) => u.employeeId)
  await sql`DELETE FROM "handicap" WHERE "employeeId" = ANY(${employeeIds})`

  // Seed handicap test data and upload test images
  const testImagePath = path.join(
    import.meta.dirname,
    "fixtures",
    "test-image.png",
  )
  const testImageBuffer = await fs.readFile(testImagePath)

  for (const user of TEST_HANDICAP_USERS) {
    await sql`
      INSERT INTO "handicap" (name, company, "employeeId", telephone, email, image)
      VALUES (${user.name}, ${user.company}, ${user.employeeId}, ${user.telephone}, ${user.email}, ${user.image})
    `

    // Upload test image to storage
    await storageClient.upload({
      key: user.image,
      body: testImageBuffer,
      contentType: "image/png",
    })
  }

  // Write storageState with session cookie
  const cookieObject = {
    name: "better-auth.session_token",
    value: encodeURIComponent(signedValue),
    domain: "localhost",
    path: "/",
    httpOnly: true,
    secure: false,
    sameSite: "Lax" as const,
    expires: Math.round(expiresAt.getTime() / 1000),
  }

  await fs.mkdir(".auth", { recursive: true })
  await fs.writeFile(
    ".auth/auth.json",
    JSON.stringify({ cookies: [cookieObject], origins: [] }, null, 2),
  )
})
