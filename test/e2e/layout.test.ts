import { expect, test } from "@playwright/test"
import { gotoWithRetry } from "./utils/helpers"

test.describe("Header and Footer layout", () => {
  test.beforeEach(async ({ page }) => {
    await gotoWithRetry(page, "/")
  })

  test("header displays site title linking to home", async ({ page }) => {
    const titleLink = page
      .getByRole("banner")
      .getByRole("link", { name: /障がい者手帳/ })
    await expect(titleLink).toBeVisible()
    await expect(titleLink).toHaveAttribute("href", "/")
  })

  test("header displays theme toggle", async ({ page }) => {
    await expect(page.getByText("ライト")).toBeVisible()
    await expect(page.getByText("ダーク")).toBeVisible()
  })

  test("footer displays copyright text", async ({ page }) => {
    const footer = page.getByRole("contentinfo")
    await expect(footer).toBeVisible()
    await expect(
      footer.getByText(/Copyright © \d{4} Open Up Group Inc/),
    ).toBeVisible()
  })

  test("footer contains GitHub link", async ({ page }) => {
    const footer = page.getByRole("contentinfo")
    const githubLink = footer.getByRole("link", { name: "GitHub" })
    await expect(githubLink).toBeVisible()
    await expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/OpenUp-LabTakizawa/dcrs",
    )
  })

  test("header and footer are present on register page", async ({ page }) => {
    await gotoWithRetry(page, "/register")
    await expect(page.getByRole("banner")).toBeVisible()
    await expect(page.getByRole("contentinfo")).toBeVisible()
  })
})
