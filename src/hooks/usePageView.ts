import { existsGaId, pageview } from "@src/lib/gtag"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function usePageView() {
  const router = useRouter()

  useEffect(() => {
    if (!existsGaId) {
      return
    }

    const handleRouteChange = (path: string) => {
      pageview(path)
    }

    router.events.on("routeChangeComplete", handleRouteChange)

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [router.events])
}
