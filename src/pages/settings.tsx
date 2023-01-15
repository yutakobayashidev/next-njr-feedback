import { MyPageSeo } from "@src/components/MyPageSeo"
import { HttpMethod } from "@src/types"
import { NextPage } from "next"
import { useRouter } from "next/router"
import type { User as NextAuthUser } from "next-auth"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"

type UserSettings = Pick<NextAuthUser, "name" | "email" | "image">

const Page: NextPage = () => {
  const { data: session } = useSession()

  const [saving, setSaving] = useState<boolean>(false)
  const [data, setData] = useState<UserSettings | null>(null)

  const router = useRouter()

  useEffect(() => {
    if (!session && typeof session != "undefined") {
      router.push(`/`)
    }
  }, [session, router])

  useEffect(() => {
    if (session)
      setData({
        ...session.user,
      })
  }, [session])

  async function saveSettings(data: UserSettings | null) {
    setSaving(true)
    const response = await fetch("/api/settings", {
      body: JSON.stringify({
        ...data,
      }),
      method: HttpMethod.POST,
    })
    if (response.ok) {
      setSaving(false)
      toast.success(`変更を保存しました`)
    }
  }

  return (
    <>
      <MyPageSeo path="/settings" title={"アカウント設定"} noindex={true} />
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
      <div className="mx-auto mt-10 max-w-screen-md px-4 md:px-8">
        <h1 className="text-center text-4xl font-bold">アカウント設定</h1>
        <div className="mt-10">
          <h2 className="mb-4 text-2xl font-medium">表示名</h2>
          <p className="mb-4">💡 Slack名と同じにすることで見つけられやすくなります。</p>
          <div>
            <input
              type="text"
              name="name"
              placeholder="表示名を入力..."
              className="w-full"
              value={data?.name || ""}
              onInput={(e) =>
                setData({
                  ...data,
                  name: (e.target as HTMLTextAreaElement).value,
                })
              }
            />
          </div>
        </div>
        <div className="m-4 text-center">
          <button
            onClick={() => {
              saveSettings(data)
            }}
            disabled={saving}
            className="h-12 w-36 rounded bg-n font-bold text-white hover:opacity-90"
          >
            更新する
          </button>
        </div>
      </div>
    </>
  )
}

export default Page
