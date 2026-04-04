import { expect, test } from "@playwright/test"
import { gotoWithRetry } from "./utils/helpers"

const title: RegExp = /DCRS/

test("has title", async ({ page }) => {
  // await page.goto("/")
  await gotoWithRetry(page, "/")

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(title)
})
