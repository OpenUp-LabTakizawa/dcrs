import { existsSync, writeFileSync } from "node:fs"
import { createInterface } from "node:readline"

const ENV_PATH = ".env"

interface EnvVar {
  key: string
  description: string
  required: boolean
  defaultValue?: string
}

const envVars: EnvVar[] = [
  {
    key: "BETTER_AUTH_SECRET",
    description: "Secret key for Better Auth session encryption",
    required: true,
  },
  {
    key: "BETTER_AUTH_URL",
    description: "Base URL for Better Auth",
    required: true,
    defaultValue: "http://localhost:3000",
  },
  {
    key: "AUTH_RESEND_KEY",
    description: "Resend API key for sending emails",
    required: true,
  },
  {
    key: "DATABASE_URL",
    description: "Neon PostgreSQL connection string",
    required: true,
  },
  {
    key: "DB_TYPE",
    description:
      "Database driver type: 'neon' (default) or 'postgres' for standard PostgreSQL",
    required: false,
    defaultValue: "neon",
  },
  {
    key: "BLOB_READ_WRITE_TOKEN",
    description:
      "Vercel Blob read/write token (S3 backend is used when not set)",
    required: false,
  },
  {
    key: "S3_ACCESS_KEY_ID",
    description: "AWS S3 access key ID (required when using S3 backend)",
    required: false,
  },
  {
    key: "S3_SECRET_ACCESS_KEY",
    description: "AWS S3 secret access key (required when using S3 backend)",
    required: false,
  },
  {
    key: "S3_REGION",
    description:
      "S3 region (AWS_REGION is also accepted; required when using S3 backend)",
    required: false,
  },
  {
    key: "S3_BUCKET",
    description: "S3 bucket name (uses default value if omitted)",
    required: false,
  },
  {
    key: "API_URL",
    description: "Base URL for the API",
    required: false,
    defaultValue: "http://localhost:3000",
  },
]

const rl = createInterface({ input: process.stdin, output: process.stdout })

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve))
}

async function main(): Promise<void> {
  if (existsSync(ENV_PATH)) {
    const overwrite = await ask(".env already exists. Overwrite? (y/N): ")
    if (overwrite.toLowerCase() !== "y") {
      console.log("Aborted.")
      rl.close()
      return
    }
  }

  console.log("\nConfigure environment variables.")
  console.log("Press Enter to accept the default value when available.\n")

  const lines: string[] = []

  for (const v of envVars) {
    const label = v.required ? "[required]" : "[optional]"
    const def = v.defaultValue ? ` (default: ${v.defaultValue})` : ""
    const value = await ask(`${label} ${v.key} - ${v.description}${def}: `)

    const resolved = value || v.defaultValue || ""

    if (v.required && !resolved) {
      console.log(`  ⚠ ${v.key} is required. Please edit .env manually later.`)
    }

    lines.push(`${v.key}=${resolved}`)
  }

  writeFileSync(ENV_PATH, `${lines.join("\n")}\n`)
  console.log(`\n✅ Generated ${ENV_PATH}.`)
  rl.close()
}

main()
