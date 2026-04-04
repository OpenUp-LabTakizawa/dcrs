import { expect, test } from "@playwright/test"
import { gotoWithRetry } from "./utils/helpers"

test.describe("Top page", () => {
  test.beforeEach(async ({ page }) => {
    await gotoWithRetry(page, "/")
  })

  test("displays the page heading", async ({ page }) => {
    const heading = page.getByRole("heading", { level: 1 })
    await expect(heading).toBeVisible()
    await expect(heading).toContainText("登録手順")
  })

  test("displays the registration steps timeline", async ({ page }) => {
    // Verify all 3 steps are shown
    await expect(page.getByText("必要情報の入力")).toBeVisible()
    await expect(page.getByText("入力確認")).toBeVisible()
    await expect(page.getByText("完了")).toBeVisible()
  })

  test("displays the submit image link pointing to /register", async ({
    page,
  }) => {
    const registerLink = page.getByRole("link", {
      name: /障がい者手帳画像を提出/,
    })
    await expect(registerLink).toBeVisible()
    await expect(registerLink).toHaveAttribute("href", "/register")
  })

  test("hides the registered data link when not authenticated", async ({
    page,
  }) => {
    const dataLink = page.getByRole("link", { name: /登録データ一覧/ })
    await expect(dataLink).toBeHidden()
  })

  test("navigates to /register when clicking the submit image link", async ({
    page,
  }) => {
    await page.getByRole("link", { name: /障がい者手帳画像を提出/ }).click()
    await page.waitForURL("/register", { timeout: 10000 })
    expect(page.url()).toContain("/register")
  })
})
