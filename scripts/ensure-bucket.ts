import { CreateBucketCommand, S3Client } from "@aws-sdk/client-s3"

// Creates the bucket the local RustFS container serves. This is the one step of
// `mise run dev:up` that needs an S3 API call rather than a shell command.
//
// The values come from mise.toml's [env]; the fallbacks keep the script working
// when it runs without mise's shell integration. An empty value counts as unset,
// because `scripts/setup-env.ts` writes every optional key even when it is left
// unanswered, so a `.env` produced for Vercel Blob carries `S3_ACCESS_KEY_ID=`
// and friends as empty strings.
function envOr(key: string, fallback: string): string {
  const value = process.env[key]
  return value && value.trim() !== "" ? value : fallback
}

export async function createBucketIfNotExists(
  s3Client: S3Client,
  bucket: string,
): Promise<void> {
  try {
    await s3Client.send(new CreateBucketCommand({ Bucket: bucket }))
    console.log(`✅ Created bucket: ${bucket}`)
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "BucketAlreadyOwnedByYou") {
      console.log(`✅ Bucket already exists: ${bucket}`)
      return
    }
    throw error
  }
}

if (import.meta.main) {
  const s3Client = new S3Client({
    credentials: {
      accessKeyId: envOr("S3_ACCESS_KEY_ID", "rustfs"),
      secretAccessKey: envOr("S3_SECRET_ACCESS_KEY", "rustfs123"),
    },
    region: envOr("S3_REGION", "us-east-1"),
    endpoint: envOr("S3_ENDPOINT", "http://localhost:9000"),
    forcePathStyle: true,
  })

  await createBucketIfNotExists(s3Client, envOr("S3_BUCKET", "dcrs-dev"))
}
