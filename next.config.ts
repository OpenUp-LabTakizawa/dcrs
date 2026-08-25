import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  agentRules: false,
  experimental: {
    inlineCss: true,
    isrFlushToDisk: false,
  },
  output: "standalone",
  reactCompiler: true,
  typedRoutes: true,
}

export default nextConfig
