import { config } from "@site.config"
import { MyPageSeo } from "@src/components/MyPageSeo"
import { HttpMethod, UserSettings } from "@src/types"
import JSConfetti from "js-confetti"
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
  const [thanks, setThanks] = useState(false)

  const router = useRouter()

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

  useEffect(() => {
    if (!session && typeof session != "undefined") {
      router.push(`/`)
    }
  }, [session, router])

  useEffect(() => {
    if (data?.displayname && data?.handle) setDisabled(false)
    else setDisabled(true)
  }, [data])

  useEffect(() => {
    if (thanks) {
      const jsConfetti = new JSConfetti()

      setTimeout(() => {
        jsConfetti.addConfetti()
      }, 150)

      setTimeout(() => {
        router.push("/")
      }, 2500)
    }
  }, [thanks, router])

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
      alert(paas.error.message)
    } else {
      setDisabled(false)
      setThanks(true)
      const event = new Event("visibilitychange")
      document.dispatchEvent(event)
    }
  }

  return (
    <>
      <MyPageSeo path="/auth/welcome" title="Welcome!" />
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
      {thanks ? (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 font-inter text-7xl font-bold md:text-8xl">Thanks!</div>
          </div>
        </div>
      ) : (
        <>
          <div className="my-24 mx-auto max-w-screen-sm px-4 md:px-8">
            <h1 className="mb-8 text-center font-inter text-5xl font-bold">Welcome!</h1>
            <p className="text-center text-gray-600">
              まずはプロフィールを作成しましょう。
              Slackと同じユーザー情報を使用することをおすすめします。
            </p>
            <img src="/welcome.png" alt="Celebration" className="mx-auto" width={480} />
            <div>
              <section className="mt-8">
                <h2 className="mb-4 text-2xl font-bold">アイコン</h2>
                <div className="flex items-center">
                  {data?.image && (
                    <img
                      width={130}
                      height={130}
                      className="mr-5 aspect-square rounded-full object-cover shadow-lg"
                      src={data?.image}
                      alt={session?.user.name || "アイコン"}
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
                  ></input>
                </div>
              </section>
              <section className="mt-8">
                <h2 className="mb-4 text-2xl font-bold">表示名</h2>
                <input
                  type="text"
                  name="name"
                  placeholder={session?.user.name || "表示名を入力"}
                  className="w-full resize-none rounded-xl border-2 border-gray-100 bg-gray-50 p-2"
                  value={data?.displayname || ""}
                  onInput={(e) =>
                    setData({
                      ...data,
                      displayname: (e.target as HTMLTextAreaElement).value,
                    })
                  }
                />
              </section>
              <section className="mt-8">
                <h2 className="mb-4 text-2xl font-bold">ハンドル</h2>
                <div className="flex items-center gap-2">
                  <label className="flex items-center text-gray-500">
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
              </section>
              <section className="mt-8">
                <h2 className="mb-4 text-2xl font-bold">自己紹介</h2>
                <TextareaAutosize
                  name="name"
                  minRows={3}
                  placeholder="自己紹介を入力"
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
              </section>
              <div className="mt-6 text-center">
                <button
                  disabled={disabled}
                  onClick={() => {
                    saveSettings(data)
                  }}
                  className={`${
                    disabled ? "bg-gray-300 opacity-95" : "bg-primary hover:opacity-90"
                  } h-12 w-36 rounded-md  font-bold text-white shadow-md`}
                >
                  はじめる
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Page
