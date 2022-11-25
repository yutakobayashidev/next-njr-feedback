import '@src/styles/globals.css'

import { SiteHeader } from "@src/components/SiteHeader";
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SiteHeader />
      <Component {...pageProps} />
    </>
  );
}
