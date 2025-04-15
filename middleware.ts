import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)
export default auth(async function middleware(request) {
  const session = await auth()
  if (!session) {
    return NextResponse.redirect(new URL("/", request.url))
  }
  return NextResponse.next()
})

export const config = {
  matcher: "/users/:path*",
}
