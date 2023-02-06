import { Layout } from "@src/components/Layout"
import { MyPageSeo } from "@src/components/MyPageSeo"
import type { NextPageWithLayout } from "@src/pages/_app"
import { HttpMethod, UserSettings } from "@src/types"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import TextareaAutosize from "react-textarea-autosize"

const Page: NextPageWithLayout = () => {
  const { data: session } = useSession()

  const [disabled, setDisabled] = useState(true)
  const [data, setData] = useState<UserSettings | null>(null)
  const [publishing, setPublishing] = useState(false)

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
    setDisabled(true)
    setPublishing(true)
    const response = await fetch("/api/settings", {
      body: JSON.stringify({
        ...data,
      }),
      method: HttpMethod.POST,
    })
    if (response.status !== 200) {
      setDisabled(false)
      setPublishing(false)
      const paas = await response.json()
      toast.error(paas.error.messsage)
    } else {
      setDisabled(false)
      setPublishing(false)
      toast.success(`変更を保存しました`)
    }
  }

  useEffect(() => {
    if (data?.displayname && data?.handle) setDisabled(false)
    else setDisabled(true)
  }, [data])

  return (
    <>
      <MyPageSeo path="/settings" title="アカウント設定" />
      <div className="mx-auto mt-10 max-w-screen-md px-4 md:px-8">
        <h1 className="text-center text-4xl font-bold">アカウント設定</h1>
        <div className="mt-10">
          <label className="my-4 flex items-center text-lg font-medium">
            表示名<span className="ml-1 text-red-800">*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="表示名を入力..."
            className="w-full resize-none rounded-xl border-2 border-gray-100 bg-gray-50 p-2"
            value={data?.displayname || ""}
            onInput={(e) =>
              setData({
                ...data,
                displayname: (e.target as HTMLTextAreaElement).value,
              })
            }
          />
          <label className="my-4 flex items-center text-lg font-medium">
            ハンドル<span className="ml-1 text-red-800">*</span>
          </label>
          <p className="mb-4 text-gray-600">
            ハンドルはあなたのユーザーページのURLで使用されます。
          </p>
          <div className="flex items-center gap-2">
            <label className="my-4 flex items-center text-gray-500">
              njr-feedback.vercel.app/users/
            </label>
            <input
              type="text"
              name="name"
              placeholder={
                session?.user?.email?.substring(
                  session?.user?.email?.indexOf("_") + 1,
                  session?.user?.email?.indexOf("@"),
                ) || "ハンドル"
              }
              className="w-full flex-1 resize-none rounded-xl border-2 border-gray-100 bg-gray-50 p-2"
              value={data?.handle || ""}
              onInput={(e) =>
                setData({
                  ...data,
                  handle: (e.target as HTMLTextAreaElement).value,
                })
              }
            />
          </div>
          <label className="my-4 flex items-center text-lg font-medium">自己紹介</label>
          <TextareaAutosize
            name="name"
            minRows={3}
            placeholder="自己紹介..."
            className="w-full resize-none rounded-xl border-2 border-gray-100 bg-gray-50 p-2"
            value={data?.bio || ""}
            onInput={(e) => {
              const value = (e.target as HTMLTextAreaElement).value
              setData({
                ...data,
                bio: value,
              })
            }}
          />
        </div>
        <div className="m-4 text-center">
          <button
            onClick={() => {
              saveSettings(data)
            }}
            disabled={disabled}
            className={`${
              disabled ? "bg-gray-300 opacity-95" : "bg-primary hover:opacity-90"
            } h-12 w-36 rounded-md font-bold text-white`}
          >
            {publishing ? "保存中..." : "更新する"}
          </button>
        </div>
      </div>
    </>
  )
}

Page.getLayout = (page) => <Layout>{page}</Layout>

export default Page
