/**
 * Feature: auth-migration-better-auth, Property 1: Authorization proxy access control
 *
 * For any HTTP request to a `/users` path, access should be granted when a valid session
 * exists, and denied (redirected) when no session exists.
 *
 * Validates: Requirements 7.3, 8.1, 8.2
 */
import { describe, expect, mock, test } from "bun:test"
import fc from "fast-check"

// --- Mutable state container (avoids const reassignment with mock.module) ---
const state = {
  session: null as object | null,
  redirectPath: null as string | null,
  nextCalled: false,
}

// Mock auth.api.getSession
mock.module("@/app/lib/auth", () => ({
  auth: {
    api: {
      getSession: async () => state.session,
    },
  },
}))

// Mock next/headers
mock.module("next/headers", () => ({
  headers: async () => new Headers(),
}))

// Mock next/server
mock.module("next/server", () => {
  class MockNextResponse {
    type: "redirect" | "next"
    constructor(type: "redirect" | "next") {
      this.type = type
    }
    static redirect(url: URL) {
      state.redirectPath = url.pathname
      return new MockNextResponse("redirect")
    }
    static next() {
      state.nextCalled = true
      return new MockNextResponse("next")
    }
  }
  return { NextResponse: MockNextResponse }
})

// Import proxy after mocks
const { proxy } = await import("@/proxy")

// --- Helpers ---

function createMockRequest(path: string) {
  const url = `http://localhost:3000${path}`
  return {
    url,
    nextUrl: new URL(url),
  } as Parameters<typeof proxy>[0]
}

/** Arbitrary: random subpaths under /users/ */
const pathSegmentArb = fc.stringMatching(/^[a-z0-9_-]{1,20}$/)

const usersPathArb = fc
  .array(pathSegmentArb, { minLength: 1, maxLength: 5 })
  .map((segments) => `/users/${segments.join("/")}`)

// --- Property Test ---

describe("Authorization proxy access control", () => {
  /**
   * Feature: auth-migration-better-auth, Property 1: Authorization proxy access control
   *
   * Validates: Requirements 7.3, 8.1, 8.2
   */
  test("session presence determines access grant/deny", async () => {
    await fc.assert(
      fc.asyncProperty(usersPathArb, fc.boolean(), async (path, hasSession) => {
        // Reset state
        state.redirectPath = null
        state.nextCalled = false

        // Configure session
        state.session = hasSession
          ? {
              user: { id: "user-1", email: "test@example.com" },
              session: { id: "sess-1" },
            }
          : null

        const request = createMockRequest(path)
        await proxy(request)

        if (hasSession) {
          // Req 8.2: Authenticated users are allowed access to /users paths
          expect(state.nextCalled).toBe(true)
          expect(state.redirectPath).toBeNull()
        } else {
          // Req 7.3, 8.1: Unauthenticated users are denied access to /users paths
          expect(state.redirectPath).toBe("/")
          expect(state.nextCalled).toBe(false)
        }
      }),
      { numRuns: 100 },
    )
  })
})
