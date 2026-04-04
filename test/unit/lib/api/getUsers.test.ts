import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test"
import type { User } from "@/app/lib/schema"

const mockFetch = mock()

const originalFetch = globalThis.fetch

beforeEach(() => {
  mockFetch.mockClear()
  globalThis.fetch = mockFetch
})

afterEach(() => {
  globalThis.fetch = originalFetch
})

const { getUsers } = await import("@/app/lib/api/getUsers")
const { baseUrl } = await import("@/app/lib/api/baseUrl")

describe("GetUsers Client", () => {
  it("should return { getUsers: User[] } when fetch returns status 200", async () => {
    const users: User[] = [
      {
        id: 1,
        createdAt: new Date("2024-01-01T00:00:00Z"),
        name: "田中太郎",
        company: "テスト株式会社",
        employeeId: "EMP001",
        telephone: "090-1234-5678",
        email: "tanaka@example.com",
        image: "EMP001.png",
      },
    ]
    const body = { getUsers: users }
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify(body), { status: 200 }),
    )

    const result = await getUsers()

    expect(result).toEqual(JSON.parse(JSON.stringify(body)))
  })

  it("should throw Error with status code and status text when fetch returns non-200", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response("Not Found", { status: 404, statusText: "Not Found" }),
    )

    await expect(getUsers()).rejects.toThrow("404")
  })

  it("should propagate network errors thrown by fetch", async () => {
    const networkError = new TypeError("fetch failed")
    mockFetch.mockRejectedValueOnce(networkError)

    await expect(getUsers()).rejects.toThrow(networkError)
  })

  it(`should fetch from ${baseUrl}/api/users`, async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ getUsers: [] }), { status: 200 }),
    )

    await getUsers()

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch.mock.calls[0][0]).toBe(`${baseUrl}/api/users`)
  })
})
