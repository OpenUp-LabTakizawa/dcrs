import { db } from "@/app/lib/schema"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import NextAuth from "next-auth"
import Resend from "next-auth/providers/resend"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Resend({
      from: "lab.takizawa@openuplab-takizawa.com",
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnUserTable = nextUrl.pathname.startsWith("/users")
      if (isOnUserTable) {
        return isLoggedIn
      }
      if (isLoggedIn) {
        return Response.redirect(new URL("/users", nextUrl))
      }
      return true
    },
    signIn(profile) {
      if (!profile?.user?.email) {
        return false
      }
      return profile.user.email.endsWith("@bnt.benextgroup.jp")
    },
  },
  trustHost: true,
})
