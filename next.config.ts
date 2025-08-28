import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
    isrFlushToDisk: false,
    ppr: true,
    // Disable react compiler due to react hook form
    // reactCompiler: true,
    viewTransition: true,
  },
  output: "standalone",
  typedRoutes: true,
}

export default nextConfig
