import path from "node:path"
import { expect, test } from "@playwright/test"
import { gotoWithRetry, setFileInput } from "./utils/helpers"

test.describe("Registration success page", () => {
  // WebKit/Mobile Safari may be slow to process setInputFiles change events
  test.describe.configure({ retries: 2 })
  test("navigates to success page after successful form submission", async ({
    page,
  }) => {
    await page.route("**/api/users", (route) => {
      if (route.request().method() === "POST") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ insertUser: [{ id: 1 }] }),
        })
      }
      return route.continue()
    })

    await gotoWithRetry(page, "/register")

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

    const testImagePath = path.join(
      import.meta.dirname,
      "fixtures",
      "test-image.png",
    )
    await setFileInput(page, testImagePath)

    // Open confirm dialog and submit
    const confirmButton = page.getByRole("button", { name: "確認画面へ" })
    await expect(confirmButton).toBeEnabled({ timeout: 15000 })
    await confirmButton.click()

    const dialog = page.locator("dialog[open]")
    await expect(dialog).toBeVisible()
    await dialog.getByRole("button", { name: "送信" }).click()

    // Wait for navigation to success page
    await page.waitForURL("**/register/success", { timeout: 15000 })
    expect(page.url()).toContain("/register/success")
  })

  test("success page displays stepper at step 3 (完了)", async ({ page }) => {
    await gotoWithRetry(page, "/register/success")

    // Stepper should show all 3 steps with the last one active
    const steps = page.locator(".steps .step")
    await expect(steps).toHaveCount(3)

    // All steps should have step-primary class (completed)
    await expect(steps.nth(0)).toHaveClass(/step-primary/)
    await expect(steps.nth(1)).toHaveClass(/step-primary/)
    await expect(steps.nth(2)).toHaveClass(/step-primary/)

    // Heading should show "完了"
    await expect(page.getByRole("heading", { level: 1 })).toContainText("完了")
  })

  test("success page displays step labels correctly", async ({ page }) => {
    await gotoWithRetry(page, "/register/success")

    await expect(page.getByText("必要情報の入力")).toBeVisible()
    await expect(page.getByText("入力確認")).toBeVisible()
    await expect(
      page.getByRole("heading", { level: 1, name: "完了" }),
    ).toBeVisible()
  })
})
