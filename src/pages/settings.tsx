import { MyPageSeo } from "@src/components/MyPageSeo"
import { HttpMethod, UserSettings } from "@src/types"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import TextareaAutosize from "react-textarea-autosize"

const Page: NextPage = () => {
  const { data: session } = useSession()

  const [disabled, setDisabled] = useState(true)

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
    setDisabled(true)
    const response = await fetch("/api/settings", {
      body: JSON.stringify({
        ...data,
      }),
      method: HttpMethod.POST,
    })
    if (response.status !== 200) {
      setDisabled(false)
      const paas = await response.json()
      toast.error(paas.error.messsage)
    } else {
      setDisabled(false)
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
            生徒番号<span className="ml-1 text-red-800">*</span>
          </label>
          <p className="mb-4 text-gray-600">
            生徒番号はあなたのユーザーページのURLで使用されます。通常は自動で設定されますが、間違いがあれば修正できます。
          </p>
          <input
            type="text"
            name="name"
            placeholder={
              session?.user?.email?.substring(
                session?.user?.email?.indexOf("_") + 1,
                session?.user?.email?.indexOf("@"),
              ) || "生徒番号が見つかりませんでした"
            }
            className="w-full resize-none rounded-xl border-2 border-gray-100 bg-gray-50 p-2"
            value={data?.handle || ""}
            onInput={(e) =>
              setData({
                ...data,
                handle: (e.target as HTMLTextAreaElement).value,
              })
            }
          />
          <label className="my-4 flex items-center text-lg font-medium">自己紹介</label>
          <TextareaAutosize
            name="name"
            minRows={3}
            placeholder="自己紹介..."
            className="w-full resize-none rounded-xl border-2 border-gray-100 bg-gray-50 p-2"
            value={data?.bio || ""}
            onInput={(e) =>
              setData({
                ...data,
                bio: (e.target as HTMLTextAreaElement).value,
              })
            }
          />
        </div>
        <div className="m-4 text-center">
          <button
            onClick={() => {
              saveSettings(data)
            }}
            disabled={disabled}
            className={`${
              disabled ? "bg-n opacity-95" : "bg-n hover:opacity-90"
            } h-12 w-36 rounded bg-n font-bold text-white`}
          >
            更新する
          </button>
        </div>
      </div>
    </>
  )
}

export default Page
