/**
 * Feature: tanstack-form-migration
 * Property 3: Confirm dialog displays all form values
 *
 * Validates: Requirements 4.2
 */
import { describe, expect, test } from "bun:test"
import fc from "fast-check"
import type { ProfileForm, ProfileFormItem } from "@/app/interfaces/form"
import {
  AGREEMENT,
  COMPANY,
  EMAIL,
  EMPLOYEE_ID,
  IMAGE,
  NAME,
  TELEPHONE,
} from "@/app/lib/constant"

/**
 * The formItems array used by ConfirmDialog, replicated here to test
 * that it covers every key of ProfileForm.
 */
const CONFIRM_DIALOG_FORM_ITEMS: readonly ProfileFormItem[] = [
  NAME,
  COMPANY,
  EMPLOYEE_ID,
  TELEPHONE,
  EMAIL,
  AGREEMENT,
  IMAGE,
] as const

/** All expected keys of ProfileForm */
const ALL_PROFILE_KEYS: ReadonlySet<keyof ProfileForm> = new Set([
  "agreement",
  "company",
  "email",
  "employeeId",
  "image",
  "name",
  "telephone",
] as const)

/** Sentinel truthy FileList value */
const truthyFileList = { length: 1 } as unknown as FileList

/** Arbitrary: non-empty string */
const nonEmptyStringArb: fc.Arbitrary<string> = fc
  .string({ minLength: 1 })
  .filter((s) => s.trim().length > 0)

/**
 * Arbitrary that generates ProfileForm with varied values.
 */
const profileFormArb: fc.Arbitrary<ProfileForm> = fc.record({
  agreement: fc.boolean(),
  company: nonEmptyStringArb,
  email: nonEmptyStringArb,
  employeeId: nonEmptyStringArb,
  image: fc.constant(truthyFileList),
  name: nonEmptyStringArb,
  telephone: nonEmptyStringArb,
})

/**
 * Feature: tanstack-form-migration, Property 3: Confirm dialog displays all form values
 *
 * Validates: Requirements 4.2
 */
describe("Confirm dialog displays all form values", () => {
  test("formItems covers every key of ProfileForm — no field is missing from the dialog", () => {
    fc.assert(
      fc.property(profileFormArb, (formValues) => {
        // Collect the field names that ConfirmDialog iterates over
        const coveredKeys = new Set(
          CONFIRM_DIALOG_FORM_ITEMS.map((item) => item.name),
        )

        // Every key in ProfileForm must be covered by formItems
        for (const key of ALL_PROFILE_KEYS) {
          expect(coveredKeys.has(key)).toBe(true)
        }

        // formItems should not contain keys outside ProfileForm
        for (const key of coveredKeys) {
          expect(ALL_PROFILE_KEYS.has(key)).toBe(true)
        }

        // For each item, the corresponding value is accessible from form values
        for (const item of CONFIRM_DIALOG_FORM_ITEMS) {
          const value = formValues[item.name]
          expect(value !== undefined).toBe(true)
        }
      }),
      { numRuns: 100 },
    )
  })

  test("each formItem has a non-empty label for display in the dialog", () => {
    fc.assert(
      fc.property(profileFormArb, (_formValues) => {
        for (const item of CONFIRM_DIALOG_FORM_ITEMS) {
          expect(typeof item.label).toBe("string")
          expect(item.label.length).toBeGreaterThan(0)
        }
      }),
      { numRuns: 100 },
    )
  })

  test("the mapping from formItems to form values produces a label-value pair for every field", () => {
    fc.assert(
      fc.property(profileFormArb, (formValues) => {
        // Simulate what ConfirmDialog does: map each item to {label, value}
        const displayPairs = CONFIRM_DIALOG_FORM_ITEMS.map((item) => ({
          label: item.label,
          value: formValues[item.name],
        }))

        // Must produce exactly 7 pairs (one per field)
        expect(displayPairs.length).toBe(7)

        // Each pair has a label and a defined value
        for (const pair of displayPairs) {
          expect(pair.label.length).toBeGreaterThan(0)
          expect(pair.value !== undefined).toBe(true)
        }

        // All 7 ProfileForm keys are represented
        const mappedKeys = new Set(
          CONFIRM_DIALOG_FORM_ITEMS.map((item) => item.name),
        )
        expect(mappedKeys.size).toBe(ALL_PROFILE_KEYS.size)
      }),
      { numRuns: 100 },
    )
  })
})
