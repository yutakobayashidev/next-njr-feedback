import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@src/lib/prisma"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async signIn({ account, profile }) {
      if (account && account.provider === "google" && profile && profile.email) {
        return profile.email.endsWith("@n-jr.jp") || profile.email.endsWith("@nnn.ac.jp")
      }
      return true
    },
  },
  debug: process.env.VERCEL_ENV ? false : true,
  providers: [
    GoogleProvider({
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  theme: {
    colorScheme: "auto",
  },
})
