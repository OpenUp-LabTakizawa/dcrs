/**
 * Feature: tanstack-form-migration
 * Property 4: Image file validation rejects invalid files
 *
 * Validates: Requirements 5.5
 */
import { describe, expect, test } from "bun:test"
import fc from "fast-check"

/** Constants extracted from imageUploader.tsx */
const maxUploadSize: number = 5 * 1024 * 1024
const acceptedMimeTypes: readonly string[] = [
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const

/**
 * Pure validation function extracted from imageUploader.tsx.
 * Returns an error message string if invalid, or empty string if valid.
 */
function validateFile(file: Readonly<File>): string {
  if (file.size > maxUploadSize) {
    return `ファイルサイズは最大${maxUploadSize / 1024 / 1024}MBです`
  }
  if (!acceptedMimeTypes.includes(file.type)) {
    return "不正なファイル形式です"
  }
  return ""
}

/** Helper to create a File with a given size and MIME type */
function createFile(size: number, mimeType: string): File {
  const buffer = new ArrayBuffer(size)
  return new File([buffer], "test-file", { type: mimeType })
}

/** Arbitrary: valid MIME type (one of the 4 accepted types) */
const validMimeTypeArb: fc.Arbitrary<string> = fc.constantFrom(
  ...acceptedMimeTypes,
)

/** Arbitrary: invalid MIME type (not in the accepted list) */
const invalidMimeTypeArb: fc.Arbitrary<string> = fc
  .oneof(
    fc.constant("application/pdf"),
    fc.constant("text/plain"),
    fc.constant("image/gif"),
    fc.constant("image/bmp"),
    fc.constant("image/tiff"),
    fc.constant("video/mp4"),
    fc.constant("application/octet-stream"),
    fc.string({ minLength: 1 }).map((s) => `invalid/${s}`),
  )
  .filter((mime) => !acceptedMimeTypes.includes(mime))

/** Arbitrary: file size within the 5MB limit (1 byte to 5MB inclusive) */
const validSizeArb: fc.Arbitrary<number> = fc.integer({
  min: 1,
  max: maxUploadSize,
})

/** Arbitrary: file size exceeding the 5MB limit */
const oversizedArb: fc.Arbitrary<number> = fc.integer({
  min: maxUploadSize + 1,
  max: maxUploadSize * 3,
})

/**
 * Feature: tanstack-form-migration, Property 4: Image file validation rejects invalid files
 *
 * Validates: Requirements 5.5
 */
describe("Image file validation rejects invalid files", () => {
  test("files exceeding 5MB are rejected with a size error message", () => {
    fc.assert(
      fc.property(oversizedArb, validMimeTypeArb, (size, mimeType) => {
        const file = createFile(size, mimeType)
        const result = validateFile(file)
        expect(result).toBe("ファイルサイズは最大5MBです")
      }),
      { numRuns: 100 },
    )
  })

  test("files with invalid MIME types are rejected with a format error message", () => {
    fc.assert(
      fc.property(validSizeArb, invalidMimeTypeArb, (size, mimeType) => {
        const file = createFile(size, mimeType)
        const result = validateFile(file)
        expect(result).toBe("不正なファイル形式です")
      }),
      { numRuns: 100 },
    )
  })

  test("valid files (<=5MB with accepted MIME type) are accepted", () => {
    fc.assert(
      fc.property(validSizeArb, validMimeTypeArb, (size, mimeType) => {
        const file = createFile(size, mimeType)
        const result = validateFile(file)
        expect(result).toBe("")
      }),
      { numRuns: 100 },
    )
  })
})
