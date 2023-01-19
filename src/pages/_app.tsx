import "@src/styles/globals.css"

import { Inter } from "@next/font/google"
import { SiteHeader } from "@src/components/SiteHeader"
import type { AppProps } from "next/app"
import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import NextNProgress from "nextjs-progressbar"

const inter = Inter({ subsets: ["latin"] })

export default function App({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <>
      <NextNProgress height={2} color="#0099D9" options={{ showSpinner: false }} />
      <SessionProvider session={pageProps.session}>
        <SiteHeader />
        <Component {...pageProps} />
        <style jsx global>
          {`
            :root {
              --font-inter: ${inter.style.fontFamily};
            }
          `}
        </style>
      </SessionProvider>
    </>
  )
}
