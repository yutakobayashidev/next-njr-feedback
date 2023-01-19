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
      },
    }),
  },
  debug: process.env.VERCEL_ENV ? false : true,
  pages: {
    error: "/",
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
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  theme: {
    colorScheme: "light",
  },
}

export default NextAuth(authOptions)
