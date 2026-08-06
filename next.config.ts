import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  agentRules: false,
  experimental: {
    inlineCss: true,
    isrFlushToDisk: false,
    useTypeScriptCli: true,
  },
  // Vercel builds its own output and fails on standalone. Everywhere else
  // (the Docker image, the Playwright webServer on CI) needs it.
  output: process.env.VERCEL ? undefined : "standalone",
  reactCompiler: true,
  typedRoutes: true,
}

export default nextConfig
