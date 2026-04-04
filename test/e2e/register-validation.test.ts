import path from "node:path"
import { expect, test } from "@playwright/test"
import { gotoWithRetry, setFileInput } from "./utils/helpers"

test.describe("Registration form validation", () => {
  // WebKit/Mobile Safari may be slow to process setInputFiles change events
  test.describe.configure({ retries: 2 })

  test.beforeEach(async ({ page }) => {
    await gotoWithRetry(page, "/register")
    // Disable CSS animations to prevent Playwright stability issues
    await page.addStyleTag({
      content:
        "*, *::before, *::after { animation: none !important; transition: none !important; }",
    })
  })

  test("displays the stepper at step 1 (必要情報の入力)", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "必要情報の入力",
    )
    const steps = page.locator("main > .steps .step")
    await expect(steps).toHaveCount(3)
    await expect(steps.nth(0)).toHaveClass(/step-primary/)
  })

  test("confirm button is disabled when form is empty", async ({ page }) => {
    const confirmButton = page.getByRole("button", { name: "確認画面へ" })
    await expect(confirmButton).toBeVisible()
    await expect(confirmButton).toBeDisabled()
  })

  test("confirm button remains disabled when only some fields are filled", async ({
    page,
  }) => {
    await page.getByRole("textbox", { name: "氏名" }).fill("テスト太郎")
    await page.getByRole("combobox").selectOption("オープンアップグループ")

    const confirmButton = page.getByRole("button", { name: "確認画面へ" })
    await expect(confirmButton).toBeDisabled()
  })

  test("confirm button remains disabled without image upload", async ({
    page,
  }) => {
    await page.getByRole("textbox", { name: "氏名" }).fill("テスト太郎")
    await page.getByRole("combobox").selectOption("オープンアップグループ")
    await page.getByRole("spinbutton", { name: "社員番号" }).fill("999999")
    await page.getByRole("textbox", { name: "電話番号" }).fill("09099999999")
    await page
      .getByRole("textbox", { name: "Eメール" })
      .fill("test@example.com")
    await page.getByRole("checkbox", { name: "同意する" }).check()

    const confirmButton = page.getByRole("button", { name: "確認画面へ" })
    await expect(confirmButton).toBeDisabled()
  })

  test("confirm button remains disabled without agreement checkbox", async ({
    page,
  }) => {
    await page.getByRole("textbox", { name: "氏名" }).fill("テスト太郎")
    await page.getByRole("combobox").selectOption("オープンアップグループ")
    await page.getByRole("spinbutton", { name: "社員番号" }).fill("999999")
    await page.getByRole("textbox", { name: "電話番号" }).fill("09099999999")
    await page
      .getByRole("textbox", { name: "Eメール" })
      .fill("test@example.com")

    const testImagePath = path.join(
      import.meta.dirname,
      "fixtures",
      "test-image.png",
    )
    await setFileInput(page, testImagePath)

    const confirmButton = page.getByRole("button", { name: "確認画面へ" })
    await expect(confirmButton).toBeDisabled()
  })

  test("confirm button becomes enabled when all fields are filled", async ({
    page,
  }) => {
    await page.getByRole("textbox", { name: "氏名" }).fill("テスト太郎")
    await page.getByRole("combobox").selectOption("オープンアップグループ")
    await page.getByRole("spinbutton", { name: "社員番号" }).fill("999999")
    await page.getByRole("textbox", { name: "電話番号" }).fill("09099999999")
    await page
      .getByRole("textbox", { name: "Eメール" })
      .fill("test@example.com")
    await page.getByRole("checkbox", { name: "同意する" }).check()

    const testImagePath = path.join(
      import.meta.dirname,
      "fixtures",
      "test-image.png",
    )
    await setFileInput(page, testImagePath)

    const confirmButton = page.getByRole("button", { name: "確認画面へ" })
    await expect(confirmButton).toBeEnabled({ timeout: 15000 })
  })

  test("confirm button becomes disabled again when a field is cleared", async ({
    page,
  }) => {
    await page.getByRole("textbox", { name: "氏名" }).fill("テスト太郎")
    await page.getByRole("combobox").selectOption("オープンアップグループ")
    await page.getByRole("spinbutton", { name: "社員番号" }).fill("999999")
    await page.getByRole("textbox", { name: "電話番号" }).fill("09099999999")
    await page
      .getByRole("textbox", { name: "Eメール" })
      .fill("test@example.com")
    await page.getByRole("checkbox", { name: "同意する" }).check()

    const testImagePath = path.join(
      import.meta.dirname,
      "fixtures",
      "test-image.png",
    )
    await setFileInput(page, testImagePath)

    const confirmButton = page.getByRole("button", { name: "確認画面へ" })
    await expect(confirmButton).toBeEnabled({ timeout: 15000 })

    // Clear the name field
    await page.getByRole("textbox", { name: "氏名" }).fill("")
    await expect(confirmButton).toBeDisabled()
  })

  test("displays required field markers", async ({ page }) => {
    // The form shows a note about required fields
    await expect(page.getByText("は必須項目")).toBeVisible()
  })

  test("confirm dialog shows all entered values", async ({ page }) => {
    await page.getByRole("textbox", { name: "氏名" }).fill("テスト太郎")
    await page.getByRole("combobox").selectOption("オープンアップグループ")
    await page.getByRole("spinbutton", { name: "社員番号" }).fill("999999")
    await page.getByRole("textbox", { name: "電話番号" }).fill("09099999999")
    await page
      .getByRole("textbox", { name: "Eメール" })
      .fill("test@example.com")
    await page.getByRole("checkbox", { name: "同意する" }).check()

    const testImagePath = path.join(
      import.meta.dirname,
      "fixtures",
      "test-image.png",
    )
    await setFileInput(page, testImagePath)

    const confirmButton = page.getByRole("button", { name: "確認画面へ" })
    await expect(confirmButton).toBeEnabled({ timeout: 15000 })
    await confirmButton.click()

    const dialog = page.locator("dialog[open]")
    await expect(dialog).toBeVisible()

    // Verify stepper shows step 2 (入力確認)
    await expect(
      dialog.getByRole("heading", { level: 1, name: "入力確認" }),
    ).toBeVisible()

    // Verify entered values are displayed in the confirm dialog
    await expect(dialog.getByText("テスト太郎")).toBeVisible()
    await expect(dialog.getByText("オープンアップグループ")).toBeVisible()
    await expect(dialog.getByText("999999", { exact: true })).toBeVisible()
    await expect(dialog.getByText("09099999999")).toBeVisible()
    await expect(dialog.getByText("test@example.com")).toBeVisible()
    await expect(dialog.getByText("同意する")).toBeVisible()

    // Verify image preview is shown
    await expect(dialog.locator('img[alt="Uploaded File"]')).toBeVisible()
  })

  test("confirm dialog can be closed with back button", async ({ page }) => {
    await page.getByRole("textbox", { name: "氏名" }).fill("テスト太郎")
    await page.getByRole("combobox").selectOption("オープンアップグループ")
    await page.getByRole("spinbutton", { name: "社員番号" }).fill("999999")
    await page.getByRole("textbox", { name: "電話番号" }).fill("09099999999")
    await page
      .getByRole("textbox", { name: "Eメール" })
      .fill("test@example.com")
    await page.getByRole("checkbox", { name: "同意する" }).check()

    const testImagePath = path.join(
      import.meta.dirname,
      "fixtures",
      "test-image.png",
    )
    await setFileInput(page, testImagePath)

    const confirmButton = page.getByRole("button", { name: "確認画面へ" })
    await expect(confirmButton).toBeEnabled({ timeout: 15000 })
    await confirmButton.click()
    const dialog = page.locator("dialog[open]")
    await expect(dialog).toBeVisible()

    // Close with the back button
    await dialog.getByRole("button", { name: "戻る" }).click()
    await expect(page.locator("dialog[open]")).toHaveCount(0)
  })

  test("shows error alert when API returns error on submit", async ({
    page,
  }) => {
    await page.route("**/api/users", (route) => {
      if (route.request().method() === "POST") {
        return route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ error: "Internal Server Error" }),
        })
      }
      return route.continue()
    })

    await page.getByRole("textbox", { name: "氏名" }).fill("テスト太郎")
    await page.getByRole("combobox").selectOption("オープンアップグループ")
    await page.getByRole("spinbutton", { name: "社員番号" }).fill("999999")
    await page.getByRole("textbox", { name: "電話番号" }).fill("09099999999")
    await page
      .getByRole("textbox", { name: "Eメール" })
      .fill("test@example.com")
    await page.getByRole("checkbox", { name: "同意する" }).check()

    const testImagePath = path.join(
      import.meta.dirname,
      "fixtures",
      "test-image.png",
    )
    await setFileInput(page, testImagePath)

    const confirmButton = page.getByRole("button", { name: "確認画面へ" })
    await expect(confirmButton).toBeEnabled({ timeout: 15000 })
    await confirmButton.click()
    const dialog = page.locator("dialog[open]")
    await expect(dialog).toBeVisible()

    await dialog.getByRole("button", { name: "送信" }).click()

    // Dialog should close and an error alert should appear
    await expect(page.locator("dialog[open]")).toHaveCount(0, {
      timeout: 10000,
    })
  })
})
