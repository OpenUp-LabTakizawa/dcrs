import { expect, test } from "@playwright/test"
import { gotoWithRetry } from "./utils/helpers"

test.describe("Logout flow", () => {
  test("shows logout button in header when session is authenticated", async ({
    page,
  }) => {
    await gotoWithRetry(page, "/register")

    await expect(page.getByRole("button", { name: "ログアウト" })).toBeVisible({
      timeout: 15000,
    })
  })

  test("hides login button in header when session is authenticated", async ({
    page,
  }) => {
    await gotoWithRetry(page, "/register")

    await expect(page.getByRole("button", { name: "ログアウト" })).toBeVisible({
      timeout: 15000,
    })

    const loginButton = page
      .getByRole("banner")
      .getByRole("button", { name: "ログイン" })
    await expect(loginButton).toBeHidden()
  })

  test("logout button triggers sign-out and redirects to home", async ({
    page,
  }) => {
    // Mock sign-out API to prevent actually destroying the shared test session
    let signOutCalled = false
    await page.route("**/api/auth/**", (route) => {
      const reqUrl = route.request().url()
      if (reqUrl.includes("sign-out")) {
        signOutCalled = true
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ status: true }),
        })
      }
      return route.continue()
    })

    await gotoWithRetry(page, "/register")

    await expect(page.getByRole("button", { name: "ログアウト" })).toBeVisible({
      timeout: 15000,
    })

    await page.getByRole("button", { name: "ログアウト" }).click()

    await page.waitForURL("/", { timeout: 15000 })
    expect(signOutCalled).toBe(true)
  })
})
