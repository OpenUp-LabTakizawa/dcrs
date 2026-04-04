import { describe, expect, it, mock } from "bun:test"

const mockGet = mock()

mock.module("@/app/lib/storage", () => ({
  storageClient: {
    get: mockGet,
  },
}))

const { getImage } = await import("@/app/lib/api/getImage")

describe("GetImage Client", () => {
  it("should return { body, contentType } from storageClient.get()", async () => {
    const fakeResult = {
      body: new ReadableStream(),
      contentType: "image/png",
    }
    mockGet.mockResolvedValueOnce(fakeResult)

    const result = await getImage("test.png")

    expect(result).toBe(fakeResult)
  })

  it("should propagate errors from storageClient.get()", async () => {
    mockGet.mockRejectedValueOnce(
      new Error("Failed to fetch blob: missing.png"),
    )

    await expect(getImage("missing.png")).rejects.toThrow(
      "Failed to fetch blob: missing.png",
    )
  })

  it("should pass the path directly to storageClient.get()", async () => {
    mockGet.mockClear()
    mockGet.mockResolvedValueOnce({
      body: new ReadableStream(),
      contentType: "image/jpeg",
    })

    await getImage("folder/image file.png")

    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGet.mock.calls[0][0]).toBe("folder/image file.png")
  })
})
