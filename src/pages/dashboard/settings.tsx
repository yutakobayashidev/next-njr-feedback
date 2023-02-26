import { config } from "@site.config"
import { ContentWrapper } from "@src/components/ContentWrapper"
import { DashboardSidebar } from "@src/components/DashboardSidebar"
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

  const handleImageChange = async function (e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      toast
        .promise(handleImageUpload(e.target.files[0]), {
          error: "アップロード時に問題が発生しました",
          loading: "アップロードしています...",
          success: "アップロードしました",
        })
        .then((image) => {
          if (image) {
            setData({
              ...data,
              image: image.secure_url,
            })
          }
        })
    }
  }

  const handleImageUpload = async function (file: Blob) {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "uwj1ormw")

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        body: formData,
        method: "POST",
      },
    )
    return response.json()
  }

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
      toast.error(paas.error.message)
    } else {
      setDisabled(false)
      setPublishing(false)
      toast.success(`変更を保存しました`)

      const event = new Event("visibilitychange")
      document.dispatchEvent(event)
    }
  }

  useEffect(() => {
    if (data?.displayname && data?.handle) setDisabled(false)
    else setDisabled(true)
  }, [data])

  return (
    <>
      <MyPageSeo path="/dashboard/settings" title="アカウント設定" />
      <ContentWrapper>
        <div className="mt-10 block items-start md:flex">
          <DashboardSidebar />
          <div className="ml-auto max-w-4xl flex-1">
            <h1 className="text-4xl font-bold">アカウント設定</h1>
            <div className="mt-10">
              <h2 className="my-4 flex items-center text-lg font-medium">アイコン</h2>
              <div className="flex items-center">
                {data?.image && (
                  <img
                    src={data.image}
                    height={100}
                    width={100}
                    className="mr-8 aspect-square rounded-full object-cover shadow-lg"
                    alt={session?.user.displayname || "アイコン"}
                  />
                )}
                <label
                  className="cursor-pointer rounded-md border px-2 py-1 text-lg text-gray-800"
                  htmlFor="single"
                >
                  画像を選択
                </label>
                <input
                  onChange={(e) => handleImageChange(e)}
                  type="file"
                  className="hidden"
                  id="single"
                  accept=".jpg, .jpeg, .png, .gif"
                />
              </div>
              <h2 className="my-4 flex items-center text-lg font-medium">
                表示名<span className="ml-1 text-red-800">*</span>
              </h2>
              <input
                type="text"
                name="name"
                placeholder={data?.name || "表示名"}
                className="w-full resize-none rounded-xl border-2 border-gray-100 bg-gray-50 p-2"
                value={data?.displayname || ""}
                onInput={(e) =>
                  setData({
                    ...data,
                    displayname: (e.target as HTMLTextAreaElement).value,
                  })
                }
              />
              <h2 className="my-4 flex items-center text-lg font-medium">
                ハンドル<span className="ml-1 text-red-800">*</span>
              </h2>
              <p className="mb-4 text-gray-600">
                ハンドルはあなたのユーザーページのURLで使用されます。
              </p>
              <div className="flex items-center gap-2">
                <label className="my-4 flex items-center text-gray-500">
                  {config.siteRoot}/users/
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder={
                    session &&
                    session.user &&
                    session.user.email &&
                    session.user.email.endsWith("@n-jr.jp") &&
                    session.user.email.split("@")[0].indexOf("njr") != -1
                      ? session.user.email.substring(
                          session.user.email.indexOf("_") + 1,
                          session.user.email.indexOf("@"),
                        )
                      : "ハンドル"
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
              <h2 className="my-4 flex items-center text-lg font-medium">自己紹介</h2>
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
        </div>
      </ContentWrapper>
    </>
  )
}

Page.getLayout = (page) => <Layout>{page}</Layout>

export default Page
