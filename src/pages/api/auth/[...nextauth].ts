import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@src/lib/prisma"
import type { NextAuthOptions } from "next-auth"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        bio: user.bio,
        displayname: user.displayname,
        handle: user.handle,
      },
    }),
    async signIn({ account, profile }) {
      if (account && account.provider === "google" && profile && profile.email) {
        return profile.email.endsWith("@n-jr.jp") || profile.email.endsWith("@nnn.ac.jp")
      }
      return true
    },
  },
  debug: process.env.VERCEL_ENV ? false : true,
  pages: {
    error: "/auth/error",
    newUser: "/auth/welcome",
  },
  providers: [
    GoogleProvider({
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile: (profile) => {
        return {
          id: profile.sub,
          name: profile.name,
          displayname: profile.name,
          email: profile.email,
          handle:
            profile.email.endsWith("@n-jr.jp") && profile.email.split("@")[0].indexOf("njr") != -1
              ? profile.email.substring(profile.email.indexOf("_") + 1, profile.email.indexOf("@"))
              : profile.sub,
          image: profile.picture,
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  theme: {
    colorScheme: "light",
  },
}

export default NextAuth(authOptions)
