import { describe, expect, it } from "bun:test"
import fc from "fast-check"
import { emailRegex, isValidEmail } from "@/app/lib/email"

describe("Email Validator", () => {
  describe("isValidEmail", () => {
    it("should return true for a valid email address", () => {
      expect(isValidEmail("user@example.com")).toBe(true)
    })

    it("should return false for a string without @", () => {
      expect(isValidEmail("userexample.com")).toBe(false)
    })

    it("should return false for a string with no local part before @", () => {
      expect(isValidEmail("@example.com")).toBe(false)
    })

    it("should return false for a domain without a dot", () => {
      expect(isValidEmail("user@example")).toBe(false)
    })

    it("should return false for an empty string", () => {
      expect(isValidEmail("")).toBe(false)
    })
  })

  describe("emailRegex", () => {
    it("should match a valid email address", () => {
      expect(emailRegex.test("user@example.com")).toBe(true)
    })

    it("should not match a string without @", () => {
      expect(emailRegex.test("userexample.com")).toBe(false)
    })
  })
})

describe("Feature: test-coverage-expansion, Property 3: Email validation regex equivalence", () => {
  /**
   * **Validates: Requirements 10.6, 10.7**
   *
   * For any string, isValidEmail() return value must match emailRegex.test()
   * return value. Strings matching /\S+@\S+\.\S+/ should return true, others false.
   */
  it("should return the same result as emailRegex.test() for any string", () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        expect(isValidEmail(str)).toBe(emailRegex.test(str))
      }),
      { numRuns: 100 },
    )
  })
})
