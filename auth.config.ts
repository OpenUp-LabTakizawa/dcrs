import type { NextAuthConfig } from "next-auth"

export default {
  callbacks: {
    signIn(profile) {
      if (!profile?.user?.email) {
        return false
      }
      return profile.user.email.endsWith("@bnt.benextgroup.jp")
    },
  },
  session: { strategy: "jwt" },
  providers: [],
} satisfies NextAuthConfig
