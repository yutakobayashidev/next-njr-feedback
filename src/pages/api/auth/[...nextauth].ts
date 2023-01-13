import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export default NextAuth({
  callbacks: {
    signIn: async ({ account, profile }) => {
      if (
        account &&
        account.provider === "google" &&
        profile &&
        profile.email &&
        (profile.email.endsWith("@n-jr.jp") || profile.email.endsWith("@nnn.ac.jp"))
      ) {
        return Promise.resolve(true)
      } else {
        return Promise.resolve(false)
      }
    },
  },
  pages: {
    signIn: "/",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.JWT_SECRET,
})
