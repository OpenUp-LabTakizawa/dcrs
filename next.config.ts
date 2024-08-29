import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    ppr: "incremental",
    pprFallbacks: true,
  },
  output: "standalone",
}

export default nextConfig
