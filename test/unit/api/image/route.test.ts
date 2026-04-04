import { beforeEach, describe, expect, it, mock } from "bun:test"

const mockGet = mock()

mock.module("@/app/lib/storage", () => ({
  storageClient: {
    upload: mock(),
    delete: mock(),
    get: mockGet,
  },
}))

import { GET } from "@/app/api/image/[key]/route"

function buildRequest(
  key: string,
): [Request, { params: Promise<{ key: string }> }] {
  const request = new Request(`http://localhost/api/image/${key}`)
  const context = { params: Promise.resolve({ key }) }
  return [request, context]
}

describe("Image Route Handler", () => {
  beforeEach(() => {
    mockGet.mockClear()
  })

  it("should call storageClient.get() and return 200 with body and Content-Type header", async () => {
    const fakeBody = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("image-data"))
        controller.close()
      },
    })
    mockGet.mockResolvedValueOnce({
      body: fakeBody,
      contentType: "image/png",
    })

    const [request, context] = buildRequest("EMP001.png")
    const response = await GET(request, context)

    expect(response.status).toBe(200)
    expect(response.headers.get("Content-Type")).toBe("image/png")
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledWith("EMP001.png")

    const text = await response.text()
    expect(text).toBe("image-data")
  })

  it("should propagate error when storageClient.get() throws", async () => {
    const error = new Error("Storage unavailable")
    mockGet.mockRejectedValueOnce(error)

    const [request, context] = buildRequest("missing.png")

    expect(GET(request, context)).rejects.toThrow("Storage unavailable")
  })
})
