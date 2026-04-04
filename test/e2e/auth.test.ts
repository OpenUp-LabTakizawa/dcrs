import { expect, type Page, test } from "@playwright/test"
import { gotoWithRetry } from "./utils/helpers"

async function openSignInModal(page: Page) {
  await page
    .getByRole("banner")
    .getByRole("button", { name: "ログイン" })
    .click()
  await page.locator("dialog.modal[open]").waitFor({ state: "attached" })
}

test.describe("Authentication flow", () => {
  test("shows login button when not authenticated", async ({ page }) => {
    await gotoWithRetry(page, "/")
    const loginButton = page
      .getByRole("banner")
      .getByRole("button", { name: "ログイン" })
    await expect(loginButton).toBeVisible()
  })

  test("hides logout button when not authenticated", async ({ page }) => {
    await gotoWithRetry(page, "/")
    const logoutButton = page.getByRole("button", { name: "ログアウト" })
    await expect(logoutButton).toBeHidden()
  })

  test("opens sign-in modal and submits email", async ({ page }) => {
    await gotoWithRetry(page, "/")
    await openSignInModal(page)

    const modalBox = page.locator(".modal-box")
    const emailInput = modalBox.getByPlaceholder("example@bnt.benextgroup.jp")
    await emailInput.fill("test@example.com")

    const submitButton = modalBox.getByRole("button", { name: "ログイン" })
    await expect(submitButton).toBeEnabled()
  })

  test("disables submit button with invalid email", async ({ page }) => {
    await gotoWithRetry(page, "/")
    await openSignInModal(page)

    const modalBox = page.locator(".modal-box")
    await modalBox
      .getByPlaceholder("example@bnt.benextgroup.jp")
      .fill("invalid-email")

    const submitButton = modalBox.getByRole("button", { name: "ログイン" })
    await expect(submitButton).toBeDisabled()
  })

  test("closes sign-in modal with close button", async ({ page }) => {
    await gotoWithRetry(page, "/")
    await openSignInModal(page)

    const modalBox = page.locator(".modal-box")
    await modalBox.getByRole("button", { name: "閉じる" }).click()

    // Dialog should no longer have the open attribute
    await expect(page.locator("dialog.modal[open]")).toHaveCount(0)
  })

  test("shows error message when magic link submission fails", async ({
    page,
  }) => {
    await gotoWithRetry(page, "/")

    await page.route("**/api/auth/**", (route) => {
      if (route.request().url().includes("magic-link")) {
        return route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ status: false, message: "Internal error" }),
        })
      }
      return route.continue()
    })

    await openSignInModal(page)

    const modalBox = page.locator(".modal-box")
    await modalBox
      .getByPlaceholder("example@bnt.benextgroup.jp")
      .fill("test@example.com")
    await modalBox.getByRole("button", { name: "ログイン" }).click()

    // Error message is shown
    await expect(modalBox.locator(".text-error")).toBeVisible({
      timeout: 10000,
    })

    // Success panel is NOT rendered
    await expect(modalBox.getByText("メールを送信しました")).not.toBeVisible()

    // Close and reopen clears error
    await modalBox.getByRole("button", { name: "閉じる" }).click()
    await expect(page.locator("dialog.modal[open]")).toHaveCount(0)

    await openSignInModal(page)
    await expect(modalBox.locator(".text-error")).not.toBeVisible()
  })

  test("shows success message after magic link submission", async ({
    page,
  }) => {
    await gotoWithRetry(page, "/")

    await page.route("**/api/auth/**", (route) => {
      if (route.request().url().includes("magic-link")) {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ status: true }),
        })
      }
      return route.continue()
    })

    await openSignInModal(page)

    const modalBox = page.locator(".modal-box")
    await modalBox
      .getByPlaceholder("example@bnt.benextgroup.jp")
      .fill("test@example.com")
    await modalBox.getByRole("button", { name: "ログイン" }).click()

    await expect(modalBox.getByText("メールを送信しました")).toBeVisible({
      timeout: 10000,
    })
    await expect(modalBox.getByText("test@example.com")).toBeVisible()
    await expect(
      modalBox.getByText("メールを確認してリンクをクリックしてください。"),
    ).toBeVisible()
  })

  test("resets modal state when closed after success", async ({ page }) => {
    await gotoWithRetry(page, "/")

    await page.route("**/api/auth/**", (route) => {
      if (route.request().url().includes("magic-link")) {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ status: true }),
        })
      }
      return route.continue()
    })

    await openSignInModal(page)

    const modalBox = page.locator(".modal-box")
    await modalBox
      .getByPlaceholder("example@bnt.benextgroup.jp")
      .fill("test@example.com")
    await modalBox.getByRole("button", { name: "ログイン" }).click()
    await expect(modalBox.getByText("メールを送信しました")).toBeVisible({
      timeout: 10000,
    })

    // Close the modal
    await modalBox.getByRole("button", { name: "閉じる" }).click()
    await expect(page.locator("dialog.modal[open]")).toHaveCount(0)

    // Reopen - should show the form again
    await openSignInModal(page)
    await expect(
      modalBox.getByPlaceholder("example@bnt.benextgroup.jp"),
    ).toBeVisible()
    await expect(modalBox.getByText("メールを送信しました")).not.toBeVisible()
  })

  test("redirects unauthenticated users from /users to /", async ({ page }) => {
    await gotoWithRetry(page, "/users")
    await page.waitForURL("/", { timeout: 10000 })
    expect(page.url()).toMatch(/\/$/)
  })

  test("hides registered data link when not authenticated", async ({
    page,
  }) => {
    await gotoWithRetry(page, "/")
    const dataLink = page.getByRole("link", { name: /登録データ一覧/ })
    await expect(dataLink).toBeHidden()
  })
})
