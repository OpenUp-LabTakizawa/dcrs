/**
 * Feature: tanstack-form-migration
 *
 * Property 1: Form validation state determines submit-ability
 * Property 2: ProfileForm retains all 7 fields
 *
 * Validates: Requirements 2.4, 3.5, 6.1, 6.2, 6.3
 */
import { describe, expect, test } from "bun:test"
import fc from "fast-check"
import type { ProfileForm } from "@/app/lib/types/form"

/**
 * Pure validation function extracted from page.tsx useStore selector.
 * Returns true iff ALL required fields are truthy.
 */
function isFormValid(values: ProfileForm): boolean {
  return (
    Boolean(values.name) &&
    Boolean(values.company) &&
    Boolean(values.employeeId) &&
    Boolean(values.telephone) &&
    Boolean(values.email) &&
    Boolean(values.agreement) &&
    Boolean(values.image)
  )
}

const EXPECTED_KEYS: ReadonlySet<keyof ProfileForm> = new Set([
  "agreement",
  "company",
  "email",
  "employeeId",
  "image",
  "name",
  "telephone",
] as const)

/** Arbitrary: non-empty string (always truthy) */
const nonEmptyStringArb: fc.Arbitrary<string> = fc
  .string({ minLength: 1 })
  .filter((s) => s.length > 0)

/** Arbitrary: string that may be empty (mix of truthy and falsy) */
const maybeEmptyStringArb: fc.Arbitrary<string> = fc.oneof(
  fc.constant(""),
  nonEmptyStringArb,
)

/** Sentinel truthy FileList value (non-null object is truthy via Boolean()) */
const truthyFileList = { length: 1 } as unknown as FileList

/** Arbitrary: image field that may be truthy or falsy */
const maybeImageArb: fc.Arbitrary<FileList | undefined> = fc.oneof(
  fc.constant(undefined),
  fc.constant(truthyFileList),
)

/**
 * Arbitrary that generates ProfileForm with a mix of truthy/falsy values
 * to exercise both valid and invalid states.
 */
const mixedProfileFormArb: fc.Arbitrary<ProfileForm> = fc.record({
  agreement: fc.boolean(),
  company: maybeEmptyStringArb,
  email: maybeEmptyStringArb,
  employeeId: maybeEmptyStringArb,
  image: maybeImageArb,
  name: maybeEmptyStringArb,
  telephone: maybeEmptyStringArb,
})

/**
 * Arbitrary that generates a fully valid ProfileForm (all fields truthy).
 */
const allValidProfileFormArb: fc.Arbitrary<ProfileForm> = fc.record({
  agreement: fc.constant(true),
  company: nonEmptyStringArb,
  email: nonEmptyStringArb,
  employeeId: nonEmptyStringArb,
  image: fc.constant(truthyFileList),
  name: nonEmptyStringArb,
  telephone: nonEmptyStringArb,
})

/**
 * Arbitrary that generates a valid ProfileForm object with random values
 * (used by Property 2).
 */
const profileFormArb: fc.Arbitrary<ProfileForm> = fc.record({
  agreement: fc.boolean(),
  company: fc.string(),
  email: fc.string(),
  employeeId: fc.string(),
  image: fc.constant(undefined),
  name: fc.string(),
  telephone: fc.string(),
})

/**
 * Feature: tanstack-form-migration, Property 1: Form validation state determines submit-ability
 *
 * Validates: Requirements 3.5, 6.1, 6.2, 6.3
 */
describe("Form validation state determines submit-ability", () => {
  test("isValid is true if and only if ALL required fields are truthy", () => {
    fc.assert(
      fc.property(mixedProfileFormArb, (form) => {
        const allTruthy =
          Boolean(form.name) &&
          Boolean(form.company) &&
          Boolean(form.employeeId) &&
          Boolean(form.telephone) &&
          Boolean(form.email) &&
          Boolean(form.agreement) &&
          Boolean(form.image)

        expect(isFormValid(form)).toBe(allTruthy)
      }),
      { numRuns: 100 },
    )
  })

  test("when all required fields are filled, the form is valid (button enabled)", () => {
    fc.assert(
      fc.property(allValidProfileFormArb, (form) => {
        expect(isFormValid(form)).toBe(true)
      }),
      { numRuns: 100 },
    )
  })

  test("when any single required field is falsy, the form is invalid (button disabled)", () => {
    const fieldKeys: (keyof ProfileForm)[] = [
      "name",
      "company",
      "employeeId",
      "telephone",
      "email",
      "agreement",
      "image",
    ]

    fc.assert(
      fc.property(
        allValidProfileFormArb,
        fc.integer({ min: 0, max: fieldKeys.length - 1 }),
        (form, fieldIndex) => {
          const key = fieldKeys[fieldIndex]
          const invalidForm: ProfileForm = {
            ...form,
            [key]:
              key === "agreement" ? false : key === "image" ? undefined : "",
          }
          expect(isFormValid(invalidForm)).toBe(false)
        },
      ),
      { numRuns: 100 },
    )
  })
})

describe("ProfileForm retains all 7 fields", () => {
  /**
   * Feature: tanstack-form-migration, Property 2: ProfileForm retains all 7 fields
   *
   * Validates: Requirements 2.4
   */
  test("ProfileForm keys are exactly {agreement, company, email, employeeId, image, name, telephone}", () => {
    fc.assert(
      fc.property(profileFormArb, (form) => {
        const keys = new Set(Object.keys(form))
        expect(keys.size).toBe(EXPECTED_KEYS.size)
        for (const key of EXPECTED_KEYS) {
          expect(keys.has(key)).toBe(true)
        }
        for (const key of keys) {
          expect(EXPECTED_KEYS.has(key as keyof ProfileForm)).toBe(true)
        }
      }),
      { numRuns: 100 },
    )
  })
})
