import path from "node:path"
import { expect, type Page, test } from "@playwright/test"

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

test.describe("Registration form submission", () => {
  test("submits all form fields to POST /api/users", async ({ page }) => {
    const capturedFields = new Set<string>()
    let requestCaptured: () => void
    const requestCapturedPromise = new Promise<void>((resolve) => {
      requestCaptured = resolve
    })

    await page.route("**/api/users", async (route) => {
      const request = route.request()
      if (request.method() !== "POST") {
        await route.continue()
        return
      }

      const body = request.postData()
      if (body) {
        const fieldMatches = body.matchAll(
          /Content-Disposition: form-data; name="([^"]+)"/g,
        )
        for (const match of fieldMatches) {
          capturedFields.add(match[1])
        }
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ insertUser: [{ id: 1 }] }),
      })
      requestCaptured()
    })

    await gotoWithRetry(page, "/register")

    // Disable CSS animations to prevent Playwright stability issues
    await page.addStyleTag({
      content:
        "*, *::before, *::after { animation: none !important; transition: none !important; }",
    })

    // Fill all form fields
    await page.getByRole("textbox", { name: "氏名" }).fill("テスト太郎")
    await page.getByRole("combobox").selectOption("オープンアップグループ")
    await page.getByRole("spinbutton", { name: "社員番号" }).fill("999999")
    await page.getByRole("textbox", { name: "電話番号" }).fill("09099999999")
    await page
      .getByRole("textbox", { name: "Eメール" })
      .fill("test@example.com")
    await page.getByRole("checkbox", { name: "同意する" }).check()

    // Upload an image file
    const testImagePath = path.join(
      import.meta.dirname,
      "fixtures",
      "test-image.png",
    )
    await page.locator('input[type="file"]').setInputFiles(testImagePath)

    // Open the confirm dialog
    const confirmButton = page.getByRole("button", { name: "確認画面へ" })
    await expect(confirmButton).toBeEnabled({ timeout: 5000 })
    await confirmButton.click()

    // Submit the form from the confirm dialog
    const dialog = page.locator("dialog[open]")
    await expect(dialog).toBeVisible()

    // Verify the confirm dialog shows the uploaded image preview
    // The uploader creates a preview with alt="Uploaded File" using URL.createObjectURL.
    // The confirm dialog also renders an Image with alt="Uploaded File" sourced from the DOM.
    // Check that at least one image with alt="Uploaded File" is visible in the dialog.
    const previewImage = dialog.locator('img[alt="Uploaded File"]')
    await expect(previewImage).toBeVisible()

    // Verify the uploader's preview image (outside the dialog) has a blob: URL
    const uploaderImage = page
      .locator('form > img[alt="Uploaded File"]')
      .first()
    const uploaderSrc = await uploaderImage.evaluate(
      (img: HTMLImageElement) => img.currentSrc || img.src,
    )
    expect(uploaderSrc, "Uploader preview should use a blob: URL").toMatch(
      /^blob:/,
    )

    await dialog.getByRole("button", { name: "送信" }).click()

    // Wait for the intercepted request to be processed
    await requestCapturedPromise

    // Verify all required fields were included in the FormData
    const requiredFields = [
      "name",
      "company",
      "employeeId",
      "telephone",
      "email",
      "agreement",
      "image",
    ]
    for (const field of requiredFields) {
      expect(
        capturedFields.has(field),
        `FormData should contain field "${field}"`,
      ).toBe(true)
    }
  })
})
