import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test"
import fc from "fast-check"

const mockFetch = mock()

const originalFetch = globalThis.fetch

beforeEach(() => {
  mockFetch.mockClear()
  globalThis.fetch = mockFetch
})

afterEach(() => {
  globalThis.fetch = originalFetch
})

const { getImage } = await import("@/app/lib/api/getImage")
const { baseUrl } = await import("@/app/lib/api/baseUrl")

describe("GetImage Client", () => {
  it("should return the Response object when fetch returns status 200", async () => {
    const response = new Response("image-data", { status: 200 })
    mockFetch.mockResolvedValueOnce(response)

    const result = await getImage("test.png")

    expect(result).toBe(response)
  })

  it("should throw Error with status code and status text when fetch returns non-200", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response("Not Found", { status: 404, statusText: "Not Found" }),
    )

    await expect(getImage("missing.png")).rejects.toThrow("404")
  })

  it("should propagate network errors thrown by fetch", async () => {
    const networkError = new TypeError("fetch failed")
    mockFetch.mockRejectedValueOnce(networkError)

    await expect(getImage("test.png")).rejects.toThrow(networkError)
  })

  it("should encode the path with encodeURIComponent() in the URL", async () => {
    mockFetch.mockResolvedValueOnce(new Response("image-data", { status: 200 }))

    const pathWithSpecialChars = "folder/image file.png"
    await getImage(pathWithSpecialChars)

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch.mock.calls[0][0]).toBe(
      `${baseUrl}/api/image/${encodeURIComponent(pathWithSpecialChars)}`,
    )
  })
})

describe("Feature: test-coverage-expansion, Property 2: getImage URL encoding round-trip", () => {
  /**
   * **Validates: Requirements 8.5**
   *
   * For any path string containing special characters,
   * decoding the path portion of the URL passed to fetch with decodeURIComponent()
   * must yield the original path string.
   */
  it("should round-trip any path through encodeURIComponent/decodeURIComponent", () => {
    const pathArb = fc.string({ minLength: 1 })

    fc.assert(
      fc.asyncProperty(pathArb, async (path) => {
        mockFetch.mockClear()
        mockFetch.mockResolvedValueOnce(new Response("ok", { status: 200 }))

        await getImage(path)

        expect(mockFetch).toHaveBeenCalledTimes(1)
        const url = mockFetch.mock.calls[0][0] as string
        const prefix = `${baseUrl}/api/image/`
        expect(url.startsWith(prefix)).toBe(true)

        const encodedPath = url.slice(prefix.length)
        const decoded = decodeURIComponent(encodedPath)
        expect(decoded).toBe(path)
      }),
      { numRuns: 100 },
    )
  })
})
