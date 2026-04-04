import { expect, test } from "@playwright/test"
import { gotoWithRetry } from "./utils/helpers"

test.describe("Navigation blocker on register form", () => {
  // beforeunload dialog behavior varies across browsers (especially WebKit/Mobile Safari)
  test.describe.configure({ retries: 2 })

  test.beforeEach(async ({ page }) => {
    await gotoWithRetry(page, "/register")
    await page.addStyleTag({
      content:
        "*, *::before, *::after { animation: none !important; transition: none !important; }",
    })
  })

  test("shows confirm dialog when navigating away after form input", async ({
    page,
  }) => {
    // Fill a field to trigger the blocker
    await page.getByRole("textbox", { name: "氏名" }).fill("テスト太郎")

    // Set up dialog handler to accept the confirm dialog
    let dialogShown = false
    let dialogMessage = ""
    page.on("dialog", async (dialog) => {
      dialogShown = true
      dialogMessage = dialog.message()
      await dialog.accept()
    })

    // Click the home button to navigate away
    await page.getByRole("link", { name: "ホームに戻る" }).click()

    // Verify the confirm dialog was shown
    expect(dialogShown).toBe(true)
    // WebKit may return an empty message for beforeunload dialogs (browser spec)
    if (dialogMessage) {
      expect(dialogMessage).toContain("移動すると入力したデータは削除されます")
    }
  })

  test("stays on page when confirm dialog is dismissed", async ({ page }) => {
    await page.getByRole("textbox", { name: "氏名" }).fill("テスト太郎")

    // Dismiss the confirm dialog
    page.on("dialog", async (dialog) => {
      await dialog.dismiss()
    })

    await page.getByRole("link", { name: "ホームに戻る" }).click()

    // Should still be on the register page
    expect(page.url()).toContain("/register")
    await expect(page.getByRole("textbox", { name: "氏名" })).toHaveValue(
      "テスト太郎",
    )
  })

  test("navigates away when confirm dialog is accepted", async ({ page }) => {
    await page.getByRole("textbox", { name: "氏名" }).fill("テスト太郎")

    page.on("dialog", async (dialog) => {
      await dialog.accept()
    })

    await page.getByRole("link", { name: "ホームに戻る" }).click()
    await page.waitForURL("/", { timeout: 10000 })
    expect(page.url()).toMatch(/\/$/)
  })

  test("no confirm dialog when form is untouched", async ({ page }) => {
    let dialogShown = false
    page.on("dialog", async (dialog) => {
      dialogShown = true
      await dialog.accept()
    })

    await page.getByRole("link", { name: "ホームに戻る" }).click()
    await page.waitForURL("/", { timeout: 10000 })

    expect(dialogShown).toBe(false)
  })

  test("header site title link also triggers blocker", async ({ page }) => {
    await page.getByRole("textbox", { name: "氏名" }).fill("テスト太郎")

    let dialogShown = false
    let dialogMessage = ""
    page.on("dialog", async (dialog) => {
      dialogShown = true
      dialogMessage = dialog.message()
      await dialog.accept()
    })

    await page
      .getByRole("banner")
      .getByRole("link", { name: /障がい者手帳/ })
      .click()

    expect(dialogShown).toBe(true)
    if (dialogMessage) {
      expect(dialogMessage).toContain("移動すると入力したデータは削除されます")
    }
  })
})
