import { SiteFooter } from "@src/components/SiteFooter"
import { SiteHeader } from "@src/components/SiteHeader"
import NextNProgress from "nextjs-progressbar"
import { ReactElement } from "react"
import { Toaster } from "react-hot-toast"

type LayoutProps = Required<{
  readonly children: ReactElement
}>

export const Layout = ({ children }: LayoutProps) => (
  <>
    <NextNProgress height={2} color="#0099D9" options={{ showSpinner: false }} />
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
    <SiteHeader />
    {children}
    <SiteFooter />
  </>
)
