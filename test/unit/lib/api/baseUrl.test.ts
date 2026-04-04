import { afterEach, describe, expect, it, mock } from "bun:test"

describe("baseUrl", () => {
  const originalApiUrl = process.env.API_URL

  afterEach(() => {
    if (originalApiUrl !== undefined) {
      process.env.API_URL = originalApiUrl
    } else {
      delete process.env.API_URL
    }
  })

  it("should return API_URL when the environment variable is set", async () => {
    process.env.API_URL = "https://api.example.com"

    mock.module("@/app/lib/api/baseUrl", () => ({
      baseUrl: process.env.API_URL || "http://localhost:3000",
    }))

    const { baseUrl } = await import("@/app/lib/api/baseUrl")
    expect(baseUrl).toBe("https://api.example.com")
  })

  it("should return http://localhost:3000 when API_URL is not set", async () => {
    delete process.env.API_URL

    mock.module("@/app/lib/api/baseUrl", () => ({
      baseUrl: process.env.API_URL || "http://localhost:3000",
    }))

    const { baseUrl } = await import("@/app/lib/api/baseUrl")
    expect(baseUrl).toBe("http://localhost:3000")
  })
})
