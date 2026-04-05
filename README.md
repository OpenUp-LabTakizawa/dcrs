<div align="center">
  <h1>dcrs</h1>

  <a href="https://better-auth.com/"><img src="https://img.shields.io/badge/better%20auth-FFFFFF?labelColor=000000&logo=betterauth&style=for-the-badge" alt="Better Auth" /></a>
  <a href="https://biomejs.dev/"><img src="https://img.shields.io/badge/biome-60A5FA?labelColor=000000&logo=biome&style=for-the-badge" alt="Biome" /></a>
  <a href="https://bun.sh/"><img src="https://img.shields.io/badge/bun-FBF0DF?labelColor=000000&logo=bun&style=for-the-badge" alt="Bun" /></a>
  <a href="https://orm.drizzle.team/"><img src="https://img.shields.io/badge/drizzle-C5F74F?labelColor=000000&logo=drizzle&style=for-the-badge" alt="Drizzle" /></a>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/next.js-000000?labelColor=000000&logo=next.js&style=for-the-badge" alt="Next.js" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/react-61DAFB?labelColor=000000&logo=react&style=for-the-badge" alt="React" /></a>
  <a href="https://tanstack.com/form/"><img src="https://img.shields.io/badge/tanstack%20form-000000?labelColor=000000&logo=tanstack&style=for-the-badge" alt="TanStack Form" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/tailwind%20css-06B6D4?labelColor=000000&logo=tailwindcss&style=for-the-badge" alt="Tailwind CSS" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?labelColor=000000&logo=typescript&style=for-the-badge" alt="TypeScript" /></a>
  <a href="https://pr.new/github.com/OpenUp-LabTakizawa/dcrs"><img src="https://img.shields.io/badge/stackblitz-207BEA?labelColor=000000&logo=stackblitz&style=for-the-badge" alt="StackBlitz" /></a>
  <a href="https://github.com/codespaces/new/?repo=OpenUp-LabTakizawa/dcrs"><img src="https://img.shields.io/badge/open-007ACC?label=github%20codespaces&labelColor=000000&style=for-the-badge" alt="GitHub Codespaces" /></a>
  <a href="https://github.com/OpenUp-LabTakizawa/dcrs/blob/main/LICENSE"><img src="https://img.shields.io/github/license/OpenUp-LabTakizawa/dcrs?labelColor=000000&style=for-the-badge" alt="License" /></a>

  <p>
    Disability Certificate Register System📇
  </p>
</div>

## 📄 Usage

To clone and run this application, you'll need [Git](https://git-scm.com/) and [Mise](https://mise.jdx.dev/) installed on your computer.  
From your command line:

### 1. Clone this repository

```bash
git clone https://github.com/OpenUp-LabTakizawa/dcrs
```

### 2. Install dependencies using Bun

```bash
cd dcrs && bun i
```

### 3. Set up environment variables

Interactively generate your `.env` file:

```bash
bun setup
```

| Variable | Description | Required |
| --- | --- | --- |
| `BETTER_AUTH_SECRET` | Secret key for Better Auth session encryption | ✅ |
| `BETTER_AUTH_URL` | Base URL for Better Auth (e.g. `http://localhost:3000`) | ✅ |
| `AUTH_RESEND_KEY` | [Resend](https://resend.com/) API key for sending emails | ✅ |
| `DATABASE_URL` | Neon PostgreSQL connection string | ✅ |
| `DB_TYPE` | Database driver type: `neon` (default) or `postgres` for standard PostgreSQL | ❌ |
| `BLOB_READ_WRITE_TOKEN` | [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) read/write token. When set, Vercel Blob is used as the storage backend; otherwise S3 is used | ❌ |
| `S3_ACCESS_KEY_ID` | AWS S3 access key ID (required when using S3 backend) | ❌ |
| `S3_SECRET_ACCESS_KEY` | AWS S3 secret access key (required when using S3 backend) | ❌ |
| `S3_REGION` | S3 region (`AWS_REGION` is also accepted; required when using S3 backend) | ❌ |
| `S3_BUCKET` | S3 bucket name (uses default value if omitted) | ❌ |
| `API_URL` | Base URL for the API (default: `http://localhost:3000`) | ❌ |

### 4. Develop the app

```bash
bun dev
```

### 5. Test the app

```bash
bun test:unit
```

### 6. E2E Test

```bash
bun test:e2e
```

### 7. Format and Lint the files

```bash
bun lint:fix
```

### 8. Build the app

```bash
bun run build
```

### 9. Start the app

```bash
bun start
```

## 🆚 VSCode

[Visual Studio Code](https://code.visualstudio.com/) is the recommended IDE for working on this project, as it has been configured.

Once opening, you can run `Extensions: Show Recommended Extensions` to install the recommended extensions for good development is automatically configured.

## 🐳 Dev Containers

A **dev container** is a running container with a well-defined tool/runtime stack and its prerequisites.  
You can try out dev containers with **[GitHub Codespaces](https://github.com/features/codespaces)** or **[Visual Studio Code Dev Containers](https://aka.ms/vscode-remote/containers)**.

### Setting up the dev container

<details>
<summary>GitHub Codespaces</summary>

[![GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new/?repo=OpenUp-LabTakizawa/dcrs)  
GitHub Codespaces is a cloud-based development environment that allows you to work on this project directly in your browser.  
You can click the badge above or [here](https://github.com/codespaces/new/?repo=OpenUp-LabTakizawa/dcrs) to get started.

Follow these steps to open this project in a Codespace:  
1. Click the **Code** drop-down menu.  
2. Click on the **Codespaces** tab.  
3. Click **Create codespace on main**.

For more info, check out the [GitHub documentation](https://docs.github.com/en/codespaces/developing-in-a-codespace/creating-a-codespace-for-a-repository#creating-a-codespace).

</details>

<details>
<summary>VSCode Dev Containers</summary>

Follow these steps to open this project in a container using the VSCode Dev Containers extension:

1. If this is your first time using a dev container, please ensure your system meets the pre-reqs (i.e. have Docker installed) in the [getting started steps](https://aka.ms/vscode-remote/containers/getting-started).

2. To use this repository, open a locally cloned copy of the code:

   - Clone this repository to your local filesystem.
   - Press <kbd>F1</kbd> and select the **Dev Containers: Open Folder in Container...** command.
   - Select the cloned copy of this folder, wait for the container to start, and try things out!

</details>

## 🫶 Contribute

Want to report a bug, contribute some code, or improve the documentation? Excellent!  
Read up on our guidelines for [contributing][contributing] and [Code of Conduct][coc].  
Then check out one of our issues labeled as [😵‍💫help wanted][help] or [good first issue][gfi].

[contributing]: https://github.com/OpenUp-LabTakizawa/dcrs/blob/main/CONTRIBUTING.md
[coc]: https://github.com/OpenUp-LabTakizawa/dcrs/blob/main/CODE_OF_CONDUCT.md
[gfi]: https://github.com/OpenUp-LabTakizawa/dcrs/labels/good%20first%20issue
[help]: https://github.com/OpenUp-LabTakizawa/dcrs/labels/😵%E2%80%8D💫help%20wanted

## ♥️ Contributors

<a href="https://github.com/OpenUp-LabTakizawa/dcrs/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=OpenUp-LabTakizawa/dcrs" alt="Contributors" />
</a>

## 📦 Credits

This software uses the following open source packages:

- [AWS Lambda Web Adapter](https://github.com/awslabs/aws-lambda-web-adapter)
- [Better Auth](https://better-auth.com/)
- [Biome](https://biomejs.dev/)
- [Bun](https://bun.sh/)
- [daisyUI](https://daisyui.com/)
- [Drizzle](https://orm.drizzle.team/)
- [HAPPY DOM](https://github.com/capricorn86/happy-dom)
- [Mise](https://mise.jdx.dev/)
- [Next.js](https://nextjs.org/)
- [Node.js](https://nodejs.org/)
- [Playwright](https://playwright.dev/)
- [React](https://react.dev/)
- [TanStack Form](https://tanstack.com/form/)
- [StackBlitz Codeflow](https://stackblitz.com/codeflow/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

## ⚖️ License

The Apache License Version 2.0 (2026) - [OpenUp-LabTakizawa](https://github.com/OpenUp-LabTakizawa).
Please have a look at the [LICENSE](https://github.com/OpenUp-LabTakizawa/dcrs/blob/main/LICENSE) for more details.
