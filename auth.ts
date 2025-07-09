import { DrizzleAdapter } from "@auth/drizzle-adapter"
import NextAuth from "next-auth"
import Resend from "next-auth/providers/resend"
import { db } from "@/app/lib/schema"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Resend({
      from: "akio.muto@bnt.benextgroup.jp",
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnUserTable = nextUrl.pathname.startsWith("/users")
      if (isOnUserTable) {
        return isLoggedIn
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
