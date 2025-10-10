import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    cacheComponents: true,
    inlineCss: true,
    isrFlushToDisk: false,
    // Disable react compiler due to react hook form
    // reactCompiler: true,
    viewTransition: true,
  },
  output: "standalone",
  typedRoutes: true,
}

export default nextConfig
