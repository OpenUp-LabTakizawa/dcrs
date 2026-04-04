import { expect, test } from "@playwright/test"
import { TEST_HANDICAP_USERS } from "./fixtures/auth-constants"
import { gotoWithRetry } from "./utils/helpers"

const [user1, user2] = TEST_HANDICAP_USERS

test.describe("Users list page", () => {
  test("displays the page heading and breadcrumb", async ({ page }) => {
    await gotoWithRetry(page, "/users")

    // Heading
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "登録データ一覧",
    )

    // Breadcrumb
    await expect(
      page.getByRole("link", { name: "ホーム", exact: true }),
    ).toBeVisible()
  })

  test("displays table with correct column headers", async ({ page }) => {
    await gotoWithRetry(page, "/users")

    const thead = page.locator("thead")
    const expectedHeaders = [
      "ID",
      "登録日時",
      "氏名",
      "所属会社",
      "社員番号",
      "電話番号",
      "Eメール",
      "障がい者手帳の画像",
    ]
    for (const header of expectedHeaders) {
      await expect(thead.getByText(header)).toBeVisible()
    }
  })

  test("renders user data rows from database", async ({ page }) => {
    await gotoWithRetry(page, "/users")

    // Wait for data to load (Suspense boundary resolves)
    await expect(page.getByText(user1.name)).toBeVisible({ timeout: 10000 })
    await expect(page.getByText(user2.name)).toBeVisible()

    // Verify first user's data
    await expect(page.getByText(user1.company).first()).toBeVisible()
    await expect(page.getByText(user1.employeeId).first()).toBeVisible()
    await expect(
      page.getByRole("link", { name: user1.telephone }),
    ).toBeVisible()
    await expect(page.getByRole("link", { name: user1.email })).toBeVisible()
    await expect(
      page.getByRole("link", {
        name: new RegExp(user1.image.replace(".", "\\.")),
      }),
    ).toBeVisible()

    // Verify second user's data
    await expect(page.getByText(user2.company).first()).toBeVisible()
    await expect(page.getByText(user2.employeeId).first()).toBeVisible()
    await expect(page.getByRole("link", { name: user2.email })).toBeVisible()
  })

  test("telephone links use tel: protocol", async ({ page }) => {
    await gotoWithRetry(page, "/users")

    await expect(page.getByText(user1.name)).toBeVisible({ timeout: 10000 })

    const telLink = page.getByRole("link", { name: user1.telephone })
    await expect(telLink).toHaveAttribute("href", `tel:${user1.telephone}`)
  })

  test("email links use mailto: protocol", async ({ page }) => {
    await gotoWithRetry(page, "/users")

    await expect(page.getByText(user1.name)).toBeVisible({ timeout: 10000 })

    const emailLink = page.getByRole("link", { name: user1.email })
    await expect(emailLink).toHaveAttribute("href", `mailto:${user1.email}`)
  })

  test("image links point to /users/{image}", async ({ page }) => {
    await gotoWithRetry(page, "/users")

    await expect(page.getByText(user1.name)).toBeVisible({ timeout: 10000 })

    const imageLink = page.getByRole("link", {
      name: new RegExp(user1.image.replace(".", "\\.")),
    })
    await expect(imageLink).toHaveAttribute("href", `/users/${user1.image}`)
  })

  test("table has both thead and tfoot with same headers", async ({ page }) => {
    await gotoWithRetry(page, "/users")

    const thead = page.locator("thead")
    const tfoot = page.locator("tfoot")

    // Both should contain the ID header
    await expect(thead.getByText("ID")).toBeVisible()
    await expect(tfoot.getByText("ID")).toBeVisible()
  })
})
