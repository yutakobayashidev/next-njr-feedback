import { config } from "@site.config"
import { MyPageSeo } from "@src/components/MyPageSeo"
import { HttpMethod, UserSettings } from "@src/types"
import JSConfetti from "js-confetti"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import TextareaAutosize from "react-textarea-autosize"

const Page: NextPage = () => {
  const { data: session } = useSession()

  const [disabled, setDisabled] = useState(true)
  const [data, setData] = useState<UserSettings | null>(null)

  const [thanks, setThanks] = useState(false)

  const router = useRouter()

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
    }
  }

  return (
    <>
      <MyPageSeo path="/auth/welcome" title="Welcome!" />
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
            <p className="text-gray-600">
              まずはプロフィールを作成しましょう。
              Slackと同じユーザー情報を使用することをおすすめします。
            </p>
            <img src="/profile.png" alt="Profile" className="mx-auto my-8" width={500} />
            <div>
              <label className="text-2xl font-bold">表示名</label>
              <input
                type="text"
                name="name"
                placeholder={session?.user.name || "表示名を入力"}
                className="my-4 w-full resize-none rounded-xl border-2 border-gray-100 bg-gray-50 p-2"
                value={data?.displayname || ""}
                onInput={(e) =>
                  setData({
                    ...data,
                    displayname: (e.target as HTMLTextAreaElement).value,
                  })
                }
              />
              <label className="text-2xl font-bold">ハンドル</label>
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
              <label className="text-2xl font-bold">自己紹介</label>
              <TextareaAutosize
                name="name"
                minRows={3}
                placeholder="自己紹介を入力"
                className="my-4 w-full resize-none rounded-xl border-2 border-gray-100 bg-gray-50 p-2"
                value={data?.bio || ""}
                onInput={(e) => {
                  const value = (e.target as HTMLTextAreaElement).value
                  setData({
                    ...data,
                    bio: value,
                  })
                }}
              />
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
