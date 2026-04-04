import type { Page } from "@playwright/test"

export async function gotoWithRetry(page: Page, url: string, options = {}) {
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

export async function setFileInput(page: Page, testImagePath: string) {
  await page.locator('input[type="file"]').setInputFiles(testImagePath)
}
