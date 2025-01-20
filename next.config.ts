import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
    ppr: true,
    reactCompiler: true,
    streamingMetadata: true,
    viewTransition: true,
  },
  output: "standalone",
}

export default nextConfig
