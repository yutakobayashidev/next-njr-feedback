import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export default NextAuth({
  callbacks: {
    async signIn({ account, profile }) {
      if (account && account.provider === "google" && profile && profile.email) {
        return profile.email.endsWith("@n-jr.jp") || profile.email.endsWith("@nnn.ac.jp")
      }
      return true // Do different verification for other providers that don't have email_verified
    },
  },
  debug: process.env.VERCEL_ENV ? false : true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  theme: {
    colorScheme: "auto",
  },
})
