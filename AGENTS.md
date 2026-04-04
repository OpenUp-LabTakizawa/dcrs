# AGENTS.md — DCRS (Disability Certificate Register System)

## Project Overview

DCRS is a web application for registering and managing disability certificates.
Users submit certificate images along with personal information, and administrators can review the registered data.

## Tech Stack

- **Runtime / Package Manager**: Bun (latest)
- **Framework**: Next.js (canary) with App Router, React 19, TypeScript 6
- **Styling**: Tailwind CSS v4 + daisyUI v5
- **Database**: PostgreSQL (Neon Serverless) + Drizzle ORM
- **Auth**: better-auth (magic link via Resend)
- **Storage**: Vercel Blob / AWS S3
- **Forms**: TanStack Form
- **Linter / Formatter**: Biome
- **Testing**: Bun test (unit, happy-dom) + Playwright (e2e) + fast-check (property-based)
- **Deployment**: Docker (distroless Node.js 24) → AWS Lambda (Lambda Web Adapter)
- **Tool Management**: mise

## Project Structure

```text
app/
├── @modal/              # Parallel routes (intercepting routes for modals)
├── api/                 # Route Handlers (auth, image, users)
├── components/          # UI components
│   ├── animation/
│   ├── button/
│   └── layout/
├── lib/                 # Core logic
│   ├── api/             # Data fetching functions
│   ├── storage/         # Blob / S3 storage utilities
│   ├── types/           # TypeScript type definitions
│   ├── auth.ts          # better-auth server config
│   ├── auth-client.ts   # better-auth client
│   ├── constant.ts      # Shared constants
│   ├── db.ts            # Drizzle client
│   └── schema.ts        # Drizzle schema definitions
├── register/            # Registration flow pages
├── users/               # User list / detail pages
├── layout.tsx           # Root layout (ja locale, Sawarabi Gothic font)
└── page.tsx             # Home page
test/
├── unit/                # Unit tests (bun test)
└── e2e/                 # E2E tests (Playwright)
drizzle/                 # Database migration files
```

## Commands

| Task                   | Command              |
| ---------------------- | -------------------- |
| Dev server             | `bun dev`            |
| Build                  | `bun run build`      |
| Lint (Biome)           | `bun lint`           |
| Format (Biome)         | `bun format`         |
| Lint + Format fix      | `bun lint:fix`       |
| Unit tests             | `bun test:unit`      |
| E2E tests              | `bun test:e2e`       |
| DB migration generate  | `bun run generate`   |
| DB migration apply     | `bun run migrate`    |
| Drizzle Studio         | `bun run studio`     |
| Markdown lint          | `mise lint:md`       |
| Full lint (Biome + MD) | `mise lint`          |

## Coding Conventions

### General

- TypeScript strict mode. Never use `any`
- No semicolons (Biome: `"semicolons": "asNeeded"`)
- 2-space indentation
- LF line endings
- Unused imports are errors (`noUnusedImports`)
- No unnecessary `else` blocks (`noUselessElse`)
- Always use block statements (`useBlockStatements`)
- Use path alias `@/*` for imports from the project root

### React / Next.js

- React Compiler is enabled. Do not use `useMemo` / `useCallback`
- Use Server Components by default. Only add `"use client"` when client-side interactivity is required
- Explicitly annotate component return types as `JSX.Element`
- Async Server Components return `Promise<JSX.Element>`
- Next.js typed routes are enabled (`typedRoutes: true`)
- Use the View Transition API (`ViewTransition` component)
- Modals are implemented via Parallel Routes / Intercepting Routes

### Database

- Define schemas in `app/lib/schema.ts` using Drizzle ORM
- Migrations: `drizzle-kit generate` → `drizzle-kit migrate`
- Always generate a migration file after changing table definitions

### Types

- Place type definitions in `app/lib/types/`
- Derive types from Drizzle schemas using `$inferSelect` / `$inferInsert`
- Use `import type { ... }` for type-only imports
- Use `LayoutProps<"/">` style typing for Next.js layout props

### Testing

- Unit tests go in `test/unit/`, run with `bun test` + happy-dom
- E2E tests go in `test/e2e/`, run with Playwright
- Property-based tests use `fast-check`
- Test file naming: `*.test.ts` / `*.test.tsx`

### UI

- Prefer daisyUI component classes (e.g. `btn`, `badge`, `timeline`)
- Import icons from `@heroicons/react/24/solid`
- UI is in Japanese. Font: Sawarabi Gothic

## Environment Variables

| Variable               | Description                            |
| ---------------------- | -------------------------------------- |
| `DATABASE_URL`         | Neon PostgreSQL connection string      |
| `AUTH_RESEND_KEY`      | Resend API key (for magic link emails) |
| `BETTER_AUTH_SECRET`   | better-auth secret key                 |
| `BETTER_AUTH_URL`      | Application URL                        |
| `BLOB_READ_WRITE_TOKEN`| Vercel Blob token                      |

## CI/CD

Automated via GitHub Actions:

- `test.yml`: Unit + E2E tests (with PostgreSQL service container)
- `docker.yml`: Docker image build & push
- `codeql.yml`: Security scanning
- `commitlint.yml`: Commit message validation
- `autofix.yml`: Auto-fix lint issues
- `dependency-review.yml`: Dependency security review

## Important Notes

- `next` uses the canary channel — watch out for breaking changes
- Unit tests run inside the Docker build (same quality gate as CI)
- Standalone output mode requires manual copy of `public/` and `.next/static`
- Deployed serverlessly via AWS Lambda Web Adapter
