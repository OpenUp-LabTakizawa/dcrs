import { beforeEach, describe, expect, it, mock } from "bun:test"
import fc from "fast-check"

const mockUpload = mock(async () => ({ url: "https://example.com/img.png" }))
const mockDelete = mock(async () => {})

mock.module("@/app/lib/storage", () => ({
  storageClient: {
    upload: mockUpload,
    delete: mockDelete,
    get: mock(),
  },
}))

const mockReturning = mock()
const mockValues = mock(() => ({ returning: mockReturning }))
const mockInsert = mock(() => ({ values: mockValues }))

mock.module("@/app/lib/schema", () => ({
  db: {
    select: mock(() => ({ from: mock(async () => []) })),
    insert: mockInsert,
  },
  handicap: {},
}))

import { POST } from "@/app/api/users/route"

describe("Feature: vercel-blob-storage, Property 4: Rollback on DB insert failure", () => {
  beforeEach(() => {
    mockUpload.mockClear()
    mockDelete.mockClear()
    mockInsert.mockClear()
    mockValues.mockClear()
    mockReturning.mockClear()
  })

  /**
   * **Validates: Requirements 6.4**
   *
   * For any storage backend, when a DB insert fails after a successful
   * image upload, storageClient.delete should be called to roll back.
   */
  it("should call storageClient.delete when DB insert fails after successful upload", () => {
    fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 1 }),
        async (name, company, employeeId, telephone, email) => {
          mockDelete.mockClear()
          mockUpload.mockResolvedValueOnce({
            url: "https://example.com/img.png",
          })
          mockReturning.mockReturnValueOnce(
            Promise.resolve([]).then(() => {
              throw new Error("DB insert failed")
            }),
          )

          const formData = new FormData()
          formData.append("name", name)
          formData.append("company", company)
          formData.append("employeeId", employeeId)
          formData.append("telephone", telephone)
          formData.append("email", email)
          formData.append(
            "image",
            new File(["data"], "test.png", { type: "image/png" }),
          )

          const request = new Request("http://localhost/api/users", {
            method: "POST",
            body: formData,
          })

          const response = await POST(request)
          expect(response.status).toBe(500)
          expect(mockDelete).toHaveBeenCalledTimes(1)
        },
      ),
      { numRuns: 100 },
    )
  })
})
