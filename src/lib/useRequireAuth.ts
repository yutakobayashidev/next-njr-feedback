import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useEffect } from "react"

function useRequireAuth() {
  const { data: session } = useSession()

  const router = useRouter()

  useEffect(() => {
    if (!session && typeof session != "undefined") {
      router.push("/")
    }
  }, [session, router])

  return session
}

export default useRequireAuth
