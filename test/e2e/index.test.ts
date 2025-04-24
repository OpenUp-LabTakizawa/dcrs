import { type Page, expect, test } from "@playwright/test"

const title: RegExp = /DCRS/

test("has title", async ({ page }) => {
  // await page.goto("/")
  await gotoWithRetry(page, "/")

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(title)
})

async function gotoWithRetry(page: Page, url: string, options = {}) {
  const maxRetries = 3
  const defaultOptions = { timeout: 20000, waitUntil: "load" as const }
  const mergedOptions = { ...defaultOptions, ...options }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await page.goto(url, mergedOptions)
      return
    } catch (error) {
      if (attempt === maxRetries) {
        throw error
      }
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }
}
