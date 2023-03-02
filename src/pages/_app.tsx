import "@src/styles/globals.css" // Tailwind CSS

import { config } from "@site.config"
import GoogleAnalytics from "@src/components/GoogleAnalytics"
import usePageView from "@src/hooks/usePageView"
import { NextPage } from "next"
import type { AppProps } from "next/app"
import { Inter } from "next/font/google"
import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import { ReactElement, ReactNode } from "react"
import { Toaster } from "react-hot-toast"

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

  if (process.env.NODE_ENV === "production") {
    console.log(
      `%c${config.siteMeta.title}の開発に貢献することに興味がありますか？\n${config.siteMeta.repository}`,
      "color:#0099D9; font-size:3em",
    )
  }

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 10000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
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
