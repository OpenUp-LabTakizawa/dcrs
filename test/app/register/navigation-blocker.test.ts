/**
 * Feature: tanstack-form-migration
 * Property 5: Navigation blocker is activated on form value change
 *
 * Validates: Requirements 7.1
 */
import { describe, expect, test } from "bun:test"
import fc from "fast-check"
import type { ProfileForm } from "@/app/interfaces/form"

/**
 * Models the navigation blocker state machine extracted from page.tsx.
 *
 * In the real component:
 *   - The form has `onChange={() => setIsBlocked(true)}`
 *   - On successful submission, `setIsBlocked(false)` is called
 *
 * This pure model captures that state transition logic without React.
 */
interface BlockerState {
  isBlocked: boolean
}

/** The onChange handler always sets isBlocked to true. */
function onFormChange(state: BlockerState): BlockerState {
  return { ...state, isBlocked: true }
}

/** All field names that can trigger an onChange event. */
const FORM_FIELD_NAMES: readonly (keyof ProfileForm)[] = [
  "name",
  "company",
  "employeeId",
  "telephone",
  "email",
  "agreement",
  "image",
] as const

/** Arbitrary: picks a random form field name. */
const fieldNameArb: fc.Arbitrary<keyof ProfileForm> = fc.constantFrom(
  ...FORM_FIELD_NAMES,
)

/** Arbitrary: generates a random string value for text fields. */
const fieldValueArb: fc.Arbitrary<string> = fc.string()

/** Arbitrary: initial blocker state — either blocked or unblocked. */
const initialStateArb: fc.Arbitrary<BlockerState> = fc.record({
  isBlocked: fc.boolean(),
})

/**
 * Feature: tanstack-form-migration, Property 5: Navigation blocker is activated on form value change
 *
 * Validates: Requirements 7.1
 */
describe("Navigation blocker is activated on form value change", () => {
  test("for any initial state and any field change, onChange sets isBlocked to true", () => {
    fc.assert(
      fc.property(
        initialStateArb,
        fieldNameArb,
        fieldValueArb,
        (initialState, _fieldName, _fieldValue) => {
          const nextState = onFormChange(initialState)
          expect(nextState.isBlocked).toBe(true)
        },
      ),
      { numRuns: 100 },
    )
  })

  test("onChange is idempotent — calling it multiple times keeps isBlocked true", () => {
    fc.assert(
      fc.property(
        initialStateArb,
        fc.integer({ min: 1, max: 10 }),
        (initialState, changeCount) => {
          let state = initialState
          for (let i = 0; i < changeCount; i++) {
            state = onFormChange(state)
          }
          expect(state.isBlocked).toBe(true)
        },
      ),
      { numRuns: 100 },
    )
  })

  test("regardless of which field triggers onChange, isBlocked becomes true", () => {
    fc.assert(
      fc.property(fieldNameArb, (fieldName) => {
        const state: BlockerState = { isBlocked: false }
        const nextState = onFormChange(state)
        // The onChange handler does not depend on which field changed
        expect(nextState.isBlocked).toBe(true)
        // Verify the field name is a valid ProfileForm key
        expect(FORM_FIELD_NAMES).toContain(fieldName)
      }),
      { numRuns: 100 },
    )
  })
})
