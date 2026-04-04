import { beforeEach, describe, expect, it, mock } from "bun:test"
import fc from "fast-check"
import type { User } from "@/app/lib/schema"

const mockFrom = mock()
const mockSelect = mock(() => ({ from: mockFrom }))

const mockUpload = mock(async () => ({ url: "https://example.com/img.png" }))
const mockDelete = mock(async () => {})
const mockGet = mock()

mock.module("@/app/lib/db", () => ({
  db: {
    select: mockSelect,
    insert: mock(() => ({ values: mock(() => ({ returning: mock() })) })),
  },
}))

mock.module("@/app/lib/storage", () => ({
  storageClient: {
    upload: mockUpload,
    delete: mockDelete,
    get: mockGet,
  },
}))

mock.module("@/app/lib/schema", () => ({
  handicap: {},
}))

import { GET, POST } from "@/app/api/users/route"

describe("Users Route Handler", () => {
  describe("GET", () => {
    beforeEach(() => {
      mockSelect.mockClear()
      mockFrom.mockClear()
    })

    it("should return { getUsers: [] } when DB is empty", async () => {
      mockFrom.mockResolvedValueOnce([])

      const response = await GET()

      expect(response.status).toBe(200)
      const json = await response.json()
      expect(json).toEqual({ getUsers: [] })
      expect(mockSelect).toHaveBeenCalledTimes(1)
      expect(mockFrom).toHaveBeenCalledTimes(1)
    })

    it("should return all records when DB has multiple entries", async () => {
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
        {
          id: 2,
          createdAt: new Date("2024-01-02T00:00:00Z"),
          name: "佐藤花子",
          company: "サンプル株式会社",
          employeeId: "EMP002",
          telephone: "090-8765-4321",
          email: "sato@example.com",
          image: "EMP002.jpg",
        },
      ]
      mockFrom.mockResolvedValueOnce(users)

      const response = await GET()

      expect(response.status).toBe(200)
      const json = await response.json()
      expect(json.getUsers).toHaveLength(2)
      expect(json.getUsers[0].name).toBe("田中太郎")
      expect(json.getUsers[1].name).toBe("佐藤花子")
      expect(json.getUsers[0].employeeId).toBe("EMP001")
      expect(json.getUsers[1].employeeId).toBe("EMP002")
    })
  })

  describe("POST", () => {
    beforeEach(() => {
      mockUpload.mockClear()
    })

    it("should return 400 when image field is missing", async () => {
      const formData = new FormData()
      formData.append("name", "テスト太郎")
      const request = new Request("http://localhost/api/users", {
        method: "POST",
        body: formData,
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
      const json = await response.json()
      expect(json.error).toBeDefined()
    })

    it("should return 400 when image field is not a File instance", async () => {
      const formData = new FormData()
      formData.append("image", "not-a-file")
      const request = new Request("http://localhost/api/users", {
        method: "POST",
        body: formData,
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
      const json = await response.json()
      expect(json.error).toBeDefined()
    })

    it("should return 400 when image File has empty name", async () => {
      const file = new File(["dummy"], "", { type: "image/png" })
      const formData = new FormData()
      formData.append("image", file)
      const request = new Request("http://localhost/api/users", {
        method: "POST",
        body: formData,
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
      const json = await response.json()
      expect(json.error).toBeDefined()
    })

    describe("success flow", () => {
      const mockReturning = mock()
      const mockValues = mock(() => ({ returning: mockReturning }))
      const mockInsert = mock(() => ({ values: mockValues }))

      let db: { insert: typeof mockInsert; select: typeof mockSelect }

      beforeEach(async () => {
        mockUpload.mockClear()
        mockReturning.mockClear()
        mockValues.mockClear()
        mockInsert.mockClear()

        const dbModule = await import("@/app/lib/db")
        db = dbModule.db as typeof db
        db.insert = mockInsert
      })

      function buildFormData(fields: {
        name: string
        company: string
        employeeId: string
        telephone: string
        email: string
        image: File
      }): FormData {
        const formData = new FormData()
        formData.append("name", fields.name)
        formData.append("company", fields.company)
        formData.append("employeeId", fields.employeeId)
        formData.append("telephone", fields.telephone)
        formData.append("email", fields.email)
        formData.append("image", fields.image)
        return formData
      }

      it("should upload, insert into DB, and return inserted user", async () => {
        const insertedUser: User = {
          id: 1,
          createdAt: new Date("2024-01-01T00:00:00Z"),
          name: "田中太郎",
          company: "テスト株式会社",
          employeeId: "EMP001",
          telephone: "090-1234-5678",
          email: "tanaka@example.com",
          image: "EMP001.png",
        }
        mockReturning.mockResolvedValueOnce([insertedUser])

        const formData = buildFormData({
          name: "田中太郎",
          company: "テスト株式会社",
          employeeId: "EMP001",
          telephone: "090-1234-5678",
          email: "tanaka@example.com",
          image: new File(["data"], "photo.png", { type: "image/png" }),
        })
        const request = new Request("http://localhost/api/users", {
          method: "POST",
          body: formData,
        })

        const response = await POST(request)

        expect(response.status).toBe(200)
        const json = await response.json()
        expect(json.insertUser).toHaveLength(1)
        expect(json.insertUser[0].employeeId).toBe("EMP001")
        expect(mockUpload).toHaveBeenCalledTimes(1)
        expect(mockInsert).toHaveBeenCalledTimes(1)
      })

      it("should generate key as 'EMP001.png' for employeeId 'EMP001' and filename 'photo.png'", async () => {
        mockReturning.mockResolvedValueOnce([])

        const formData = buildFormData({
          name: "テスト",
          company: "テスト社",
          employeeId: "EMP001",
          telephone: "000-0000-0000",
          email: "test@example.com",
          image: new File(["data"], "photo.png", { type: "image/png" }),
        })
        const request = new Request("http://localhost/api/users", {
          method: "POST",
          body: formData,
        })

        await POST(request)

        expect(mockUpload).toHaveBeenCalledWith(
          expect.objectContaining({ key: "EMP001.png" }),
        )
      })

      it("should generate key as 'EMP002.jpg' for employeeId 'EMP002' and filename 'image.test.jpg' (uses last extension)", async () => {
        mockReturning.mockResolvedValueOnce([])

        const formData = buildFormData({
          name: "テスト",
          company: "テスト社",
          employeeId: "EMP002",
          telephone: "000-0000-0000",
          email: "test@example.com",
          image: new File(["data"], "image.test.jpg", { type: "image/jpeg" }),
        })
        const request = new Request("http://localhost/api/users", {
          method: "POST",
          body: formData,
        })

        await POST(request)

        expect(mockUpload).toHaveBeenCalledWith(
          expect.objectContaining({ key: "EMP002.jpg" }),
        )
      })

      it("should call storageClient.upload before DB insert", async () => {
        const callOrder: string[] = []
        mockUpload.mockImplementationOnce(async () => {
          callOrder.push("upload")
          return { url: "https://example.com/img.png" }
        })
        mockReturning.mockImplementationOnce(async () => {
          callOrder.push("insert")
          return []
        })

        const formData = buildFormData({
          name: "テスト",
          company: "テスト社",
          employeeId: "EMP003",
          telephone: "000-0000-0000",
          email: "test@example.com",
          image: new File(["data"], "pic.png", { type: "image/png" }),
        })
        const request = new Request("http://localhost/api/users", {
          method: "POST",
          body: formData,
        })

        await POST(request)

        expect(callOrder).toEqual(["upload", "insert"])
      })
    })

    describe("Feature: test-coverage-expansion, Property 1: Key generation format", () => {
      const mockReturning = mock()
      const mockValues = mock(() => ({ returning: mockReturning }))
      const mockInsert = mock(() => ({ values: mockValues }))

      let db: { insert: typeof mockInsert; select: typeof mockSelect }

      beforeEach(async () => {
        mockUpload.mockClear()
        mockReturning.mockClear()
        mockValues.mockClear()
        mockInsert.mockClear()

        const dbModule = await import("@/app/lib/db")
        db = dbModule.db as typeof db
        db.insert = mockInsert
      })

      /**
       * **Validates: Requirements 3.2, 4.1, 4.2**
       *
       * For any valid employeeId and filename with extension,
       * the key passed to storageClient.upload must be `${employeeId}.${lastExtension}`.
       */
      it("should generate key as employeeId.lastExtension for any employeeId and filename", () => {
        const extensionArb = fc.stringMatching(/^[a-zA-Z0-9]{1,8}$/)

        const filenameArb = fc
          .tuple(fc.stringMatching(/^[a-zA-Z0-9_-]{1,20}$/), extensionArb)
          .map(([base, ext]) => `${base}.${ext}`)

        const employeeIdArb = fc.stringMatching(/^[a-zA-Z0-9_-]{1,20}$/)

        fc.assert(
          fc.asyncProperty(
            employeeIdArb,
            filenameArb,
            async (employeeId, filename) => {
              mockUpload.mockClear()
              mockReturning.mockResolvedValueOnce([])

              const formData = new FormData()
              formData.append("name", "テスト")
              formData.append("company", "テスト社")
              formData.append("employeeId", employeeId)
              formData.append("telephone", "000-0000-0000")
              formData.append("email", "test@example.com")
              formData.append(
                "image",
                new File(["data"], filename, { type: "image/png" }),
              )

              const request = new Request("http://localhost/api/users", {
                method: "POST",
                body: formData,
              })

              await POST(request)

              const expectedExt = filename.split(".").pop()
              const expectedKey = `${employeeId}.${expectedExt}`

              expect(mockUpload).toHaveBeenCalledTimes(1)
              const callArgs = mockUpload.mock.calls[0][0] as { key: string }
              const actualKey = callArgs.key

              expect(actualKey).toBe(expectedKey)
              expect(actualKey).toContain(".")
              const lastDotIndex = actualKey.lastIndexOf(".")
              expect(actualKey.substring(0, lastDotIndex)).toBe(employeeId)
              expect(actualKey.substring(lastDotIndex + 1)).toBe(expectedExt)
            },
          ),
          { numRuns: 100 },
        )
      })
    })
  })
})
