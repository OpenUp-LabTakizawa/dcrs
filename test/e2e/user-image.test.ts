import { expect, type Page, test } from "@playwright/test"
import { TEST_HANDICAP_USERS } from "./fixtures/auth-constants"
import { gotoWithRetry } from "./utils/helpers"

const testUser = TEST_HANDICAP_USERS[0]

/** Wait for the Suspense boundary in /users/[path] to resolve */
async function waitForImagePage(page: Page) {
  await expect(
    page.getByRole("heading", { level: 1, name: testUser.image }),
  ).toBeVisible({ timeout: 30000 })
}

test.describe("User image detail page (/users/[path])", () => {
  test("displays breadcrumb with home and users links", async ({ page }) => {
    await gotoWithRetry(page, `/users/${testUser.image}`)
    await waitForImagePage(page)

    await expect(
      page.getByRole("link", { name: "ホーム", exact: true }),
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: "登録データ一覧" }),
    ).toBeVisible()
    await expect(page.getByText(testUser.image).first()).toBeVisible()
  })

  test("displays image preview with correct filename heading", async ({
    page,
  }) => {
    await gotoWithRetry(page, `/users/${testUser.image}`)
    await waitForImagePage(page)

    await expect(page.getByRole("img", { name: testUser.image })).toBeVisible()
  })

  test("displays download button", async ({ page }) => {
    await gotoWithRetry(page, `/users/${testUser.image}`)
    await waitForImagePage(page)

    await expect(
      page.getByRole("button", { name: "ダウンロード" }),
    ).toBeVisible()
  })

  test("displays back to table link", async ({ page }) => {
    await gotoWithRetry(page, `/users/${testUser.image}`)
    await waitForImagePage(page)

    const backLink = page.getByRole("link", { name: "表に戻る" })
    await expect(backLink).toBeVisible()
    await expect(backLink).toHaveAttribute("href", "/users")
  })

  test("displays home button", async ({ page }) => {
    await gotoWithRetry(page, `/users/${testUser.image}`)
    await waitForImagePage(page)

    await expect(page.getByRole("link", { name: "ホームに戻る" })).toBeVisible()
  })
})

test.describe("Image modal via intercepting route", () => {
  test("opens modal when clicking image link from users list", async ({
    page,
  }) => {
    await gotoWithRetry(page, "/users")
    await expect(page.getByText(testUser.name)).toBeVisible({ timeout: 15000 })

    await page
      .getByRole("link", {
        name: new RegExp(testUser.image.replace(".", "\\.")),
      })
      .click()

    const dialog = page.locator("dialog[open]")
    await expect(dialog).toBeVisible({ timeout: 15000 })
  })

  test("modal displays image preview", async ({ page }) => {
    await gotoWithRetry(page, "/users")
    await expect(page.getByText(testUser.name)).toBeVisible({ timeout: 15000 })

    await page
      .getByRole("link", {
        name: new RegExp(testUser.image.replace(".", "\\.")),
      })
      .click()

    const dialog = page.locator("dialog[open]")
    await expect(dialog).toBeVisible({ timeout: 15000 })

    await expect(
      dialog.getByRole("heading", { name: testUser.image }),
    ).toBeVisible({ timeout: 15000 })
    await expect(
      dialog.getByRole("img", { name: testUser.image }),
    ).toBeVisible()
  })

  test("modal has download and close buttons", async ({ page }) => {
    await gotoWithRetry(page, "/users")
    await expect(page.getByText(testUser.name)).toBeVisible({ timeout: 15000 })

    await page
      .getByRole("link", {
        name: new RegExp(testUser.image.replace(".", "\\.")),
      })
      .click()

    const dialog = page.locator("dialog[open]")
    await expect(dialog).toBeVisible({ timeout: 15000 })

    await expect(
      dialog.getByRole("button", { name: "ダウンロード" }),
    ).toBeVisible()
    await expect(dialog.getByRole("button", { name: "閉じる" })).toBeVisible()
  })

  test("closing modal returns to users list", async ({ page }) => {
    await gotoWithRetry(page, "/users")
    await expect(page.getByText(testUser.name)).toBeVisible({ timeout: 15000 })

    await page
      .getByRole("link", {
        name: new RegExp(testUser.image.replace(".", "\\.")),
      })
      .click()

    const dialog = page.locator("dialog[open]")
    await expect(dialog).toBeVisible({ timeout: 15000 })

    await dialog.getByRole("button", { name: "閉じる" }).click()

    await expect(page.locator("dialog[open]")).toHaveCount(0, {
      timeout: 15000,
    })
    await expect(page.getByText(testUser.name)).toBeVisible()
  })
})
