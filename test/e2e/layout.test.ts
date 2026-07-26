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
    await expect(
      page.getByRole("checkbox", { name: "ダークモード" }),
    ).toBeAttached()
    await expect(page.getByText("ライト")).toBeVisible()
    await expect(page.getByText("ダーク")).toBeHidden()
  })

  test("theme toggle stays synchronized after repeated changes", async ({
    page,
  }) => {
    const toggle = page.getByRole("checkbox", { name: "ダークモード" })

    for (let count = 0; count < 20; count += 1) {
      const expectedTheme = count % 2 === 0 ? "dark" : "light"
      await page
        .getByText(expectedTheme === "dark" ? "ライト" : "ダーク")
        .click()
      await expect(page.locator("html")).toHaveAttribute(
        "data-theme",
        expectedTheme,
      )
      await expect(toggle).toBeChecked({ checked: expectedTheme === "dark" })
      await expect
        .poll(() => page.evaluate(() => localStorage.getItem("theme")))
        .toBe(expectedTheme)
    }
  })

  test("uses the OS theme when no theme has been saved", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" })
    await page.evaluate(() => localStorage.removeItem("theme"))
    await page.reload()

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")
    await expect(
      page.getByRole("checkbox", { name: "ダークモード" }),
    ).toBeChecked()
  })

  test("a saved theme takes precedence over the OS theme", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" })
    await page.evaluate(() => localStorage.setItem("theme", "light"))
    await page.reload()

    await expect(page.locator("html")).toHaveAttribute("data-theme", "light")
    await expect(
      page.getByRole("checkbox", { name: "ダークモード" }),
    ).not.toBeChecked()
  })

  test("theme persists through navigation and toggles after scrolling", async ({
    page,
  }) => {
    const toggle = page.getByRole("checkbox", { name: "ダークモード" })
    await page.getByText("ライト").click()
    await page.getByRole("link", { name: /障がい者手帳画像を提出/ }).click()
    await page.waitForURL("/register")

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")
    await expect(toggle).toBeChecked()

    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
      window.dispatchEvent(new Event("scroll"))
    })
    await page.getByText("ダーク").click()

    await expect(page.locator("html")).toHaveAttribute("data-theme", "light")
    await expect(toggle).not.toBeChecked()
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("theme")))
      .toBe("light")
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
