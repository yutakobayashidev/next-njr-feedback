import "@src/styles/globals.css" // Tailwind CSS

import { Inter } from "@next/font/google"
import GoogleAnalytics from "@src/components/GoogleAnalytics"
import usePageView from "@src/hooks/usePageView"
import { NextPage } from "next"
import type { AppProps } from "next/app"
import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import { ReactElement, ReactNode } from "react"

const inter = Inter({ subsets: ["latin"] })

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout<P> = AppProps<P> & {
  Component: NextPageWithLayout<P>
}

export default function App({ Component, pageProps }: AppPropsWithLayout<{ session: Session }>) {
  const getLayout = Component.getLayout || ((page: any) => page)

  usePageView()

  return (
    <>
      <GoogleAnalytics />
      <SessionProvider session={pageProps.session}>
        {getLayout(
          <>
            <Component {...pageProps} />
            <style jsx global>
              {`
                :root {
                  --font-inter: ${inter.style.fontFamily};
                }
              `}
            </style>
          </>,
        )}
      </SessionProvider>
    </>
  )
}
