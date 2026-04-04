import { describe, expect, it, mock } from "bun:test"
import type { User } from "@/app/lib/schema"

const mockSelect = mock()
const mockFrom = mock()

mock.module("@/app/lib/db", () => ({
  db: {
    select: () => {
      mockSelect()
      return { from: mockFrom }
    },
  },
}))

const { getUsers } = await import("@/app/lib/api/getUsers")

describe("GetUsers Client", () => {
  it("should return { getUsers: User[] } when DB returns records", async () => {
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
    mockFrom.mockResolvedValueOnce(users)

    const result = await getUsers()

    expect(result).toEqual({ getUsers: users })
  })

  it("should return { getUsers: [] } when DB returns empty array", async () => {
    mockFrom.mockResolvedValueOnce([])

    const result = await getUsers()

    expect(result).toEqual({ getUsers: [] })
  })

  it("should propagate DB errors", async () => {
    const dbError = new Error("connection refused")
    mockFrom.mockRejectedValueOnce(dbError)

    await expect(getUsers()).rejects.toThrow("connection refused")
  })

  it("should call db.select().from(handicap)", async () => {
    mockSelect.mockClear()
    mockFrom.mockClear()
    mockFrom.mockResolvedValueOnce([])

    await getUsers()

    expect(mockSelect).toHaveBeenCalledTimes(1)
    expect(mockFrom).toHaveBeenCalledTimes(1)
  })
})
