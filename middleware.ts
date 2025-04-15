import { auth } from "@/auth"
import { NextResponse } from "next/server"

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
