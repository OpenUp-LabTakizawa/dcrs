import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
    isrFlushToDisk: false,
    // Disable react compiler due to react hook form
    // reactCompiler: true,
    viewTransition: true,
  },
  cacheComponents: true,
  output: "standalone",
  typedRoutes: true,
}

export default nextConfig
