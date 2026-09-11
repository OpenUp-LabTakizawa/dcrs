import { CreateBucketCommand, S3Client } from "@aws-sdk/client-s3"
import { $ } from "bun"

// This script bootstraps the local Docker stack, so it resolves the local
// development values from mise.toml's [env] and falls back to the same
// defaults when it runs without mise's shell integration.
//
// An empty value counts as unset: `scripts/setup-env.ts` writes every optional
// key even when it is left unanswered, so a `.env` produced for Vercel Blob
// carries `S3_ACCESS_KEY_ID=` and friends as empty strings.
function envOr(key: string, fallback: string): string {
  const value = process.env[key]
  return value && value.trim() !== "" ? value : fallback
}

const DATABASE_URL = envOr(
  "DATABASE_URL",
  "postgres://dcrs:dcrs@localhost:5432/dcrs",
)
const DB_TYPE = envOr("DB_TYPE", "postgres")
const S3_ENDPOINT = envOr("S3_ENDPOINT", "http://localhost:9000")
const S3_REGION = envOr("S3_REGION", "us-east-1")
const S3_ACCESS_KEY_ID = envOr("S3_ACCESS_KEY_ID", "rustfs")
const S3_SECRET_ACCESS_KEY = envOr("S3_SECRET_ACCESS_KEY", "rustfs123")
const S3_BUCKET = envOr("S3_BUCKET", "dcrs-dev")

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

async function main(): Promise<void> {
  try {
    await $`docker compose up -d --wait`
  } catch {
    console.error("❌ Failed to start Docker Compose. Is Docker running?")
    process.exit(1)
  }

  // `bun run migrate` reads DATABASE_URL and DB_TYPE through drizzle.config.ts
  // in a child process, so export the resolved values for it to inherit.
  process.env.DATABASE_URL = DATABASE_URL
  process.env.DB_TYPE = DB_TYPE
  await $`bun run migrate`

  const s3Client = new S3Client({
    credentials: {
      accessKeyId: S3_ACCESS_KEY_ID,
      secretAccessKey: S3_SECRET_ACCESS_KEY,
    },
    region: S3_REGION,
    endpoint: S3_ENDPOINT,
    forcePathStyle: true,
  })

  await createBucketIfNotExists(s3Client, S3_BUCKET)
}

if (import.meta.main) {
  main()
}
