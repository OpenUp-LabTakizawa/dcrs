import "dotenv/config"
import { defineConfig, devices } from "@playwright/test"

/** Test files that require an authenticated session */
const AUTH_TESTS = [
  "test/e2e/users.test.ts",
  "test/e2e/user-image.test.ts",
  "test/e2e/logout.test.ts",
]
const AUTH_TEST_MATCH = AUTH_TESTS.map((f) => f.replace("test/e2e/", ""))
const AUTH_SETUP_PROJECT = "auth-setup"

const BROWSERS = [
  { name: "chromium", use: devices["Desktop Chrome"] },
  { name: "firefox", use: devices["Desktop Firefox"] },
  { name: "webkit", use: devices["Desktop Safari"] },
  { name: "Mobile Chrome", use: devices["Pixel 7"] },
  { name: "Mobile Safari", use: devices["iPhone 15 Pro"] },
]

const browserProjects = BROWSERS.flatMap(({ name, use }) => [
  {
    name,
    use,
    testIgnore: AUTH_TESTS,
  },
  {
    name: `${name}-auth`,
    use: { ...use, storageState: ".auth/auth.json" },
    testMatch: AUTH_TEST_MATCH,
    dependencies: [AUTH_SETUP_PROJECT],
  },
])

export default defineConfig({
  testDir: "./test/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: AUTH_SETUP_PROJECT,
      testMatch: /auth\.setup\.ts/,
      teardown: "auth-teardown",
    },
    {
      name: "auth-teardown",
      testMatch: /auth\.teardown\.ts/,
    },
    ...browserProjects,
  ],

  webServer: {
    command: process.env.CI
      ? "cp -r .next/static .next/standalone/.next/static && bun .next/standalone/server.js"
      : "bun dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
})
