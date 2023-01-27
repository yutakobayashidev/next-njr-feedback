import { SiteFooter } from "@src/components/SiteFooter"
import { SiteHeader } from "@src/components/SiteHeader"
import NextNProgress from "nextjs-progressbar"
import { ReactElement } from "react"

type LayoutProps = Required<{
  readonly children: ReactElement
}>

export const Layout = ({ children }: LayoutProps) => (
  <>
    <NextNProgress height={2} color="#0099D9" options={{ showSpinner: false }} />
    <SiteHeader />
    {children}
    <SiteFooter />
  </>
)
