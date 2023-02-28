import { RadioGroup } from "@headlessui/react"
import { config } from "@site.config"
import Loader from "@src/components/Loader"
import { MyPageSeo } from "@src/components/MyPageSeo"
import fetcher from "@src/lib/fetcher"
import useRequireAuth from "@src/lib/useRequireAuth"
import { HttpMethod, UserSettings } from "@src/types"
import JSConfetti from "js-confetti"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { AiFillCheckCircle } from "react-icons/ai"
import TextareaAutosize from "react-textarea-autosize"
import useSWR from "swr"

const Page: NextPage = () => {
  const session = useRequireAuth()

  const { data: user } = useSWR<UserSettings>(session && `/api/me`, fetcher)
  const [disabled, setDisabled] = useState(true)
  const [thanks, setThanks] = useState(false)

  const router = useRouter()

  const [data, setData] = useState<UserSettings>({
    id: "",
    name: "",
    bio: "",
    displayname: "",
    email: "",
    handle: "",
    image: "",
    leave: false,
    n_course: "",
    role: "",
  })

  useEffect(() => {
    if (user)
      setData({
        id: user.id ?? "",
        name: user.name ?? "",
        bio: user.bio ?? "",
        displayname: user.displayname ?? "",
        email: user.email ?? "",
        handle: user.handle ?? "",
        image: user.image ?? "",
        leave: user.leave ?? false,
        n_course: user.n_course === "nodata" && user.role !== "teacher" ? "commute" : user.n_course,
        role: user.role ?? "",
      })
  }, [user])

  useEffect(() => {
    if (data.displayname && data.handle) setDisabled(false)
    else setDisabled(true)
  }, [data])

  const course = [
    {
      name: "通学コース",
      value: "commute",
    },
    {
      name: "ネットコース",
      value: "net",
    },
  ]

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

  async function saveSettings(data: UserSettings) {
    setDisabled(true)
    const response = await fetch("/api/me", {
      body: JSON.stringify({
        ...data,
      }),
      method: HttpMethod.PUT,
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

  if (!session) return <Loader />

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
            {user && data && (
              <div>
                <section className="mt-8">
                  <h2 className="mb-4 text-2xl font-bold">アイコン</h2>
                  <div className="flex items-center">
                    {data?.image && (
                      <img
                        width={130}
                        height={130}
                        className="mr-5 aspect-square rounded-full object-cover shadow-lg"
                        src={data.image}
                        alt={data.name || "アイコン"}
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
                    placeholder={data.name || "表示名を入力"}
                    className="w-full resize-none rounded-xl border-2 border-gray-100 bg-gray-50 p-2"
                    value={data.displayname}
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
                        data.email.endsWith("@n-jr.jp") &&
                        data.email.split("@")[0].indexOf("njr") != -1
                          ? data.email.substring(
                              data.email.indexOf("_") + 1,
                              data.email.indexOf("@"),
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
                {user && user.role === "student" && (
                  <section className="mt-8">
                    <h2 className="mb-4 text-2xl font-bold">あなたのコース</h2>
                    <RadioGroup
                      value={data.n_course}
                      onChange={(value: string) => setData({ ...data, n_course: value })}
                    >
                      <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
                      <div className="space-y-2">
                        {course.map((course) => (
                          <RadioGroup.Option
                            key={course.name}
                            value={course.value}
                            className={({ checked }) =>
                              `
                  ${checked ? "bg-primary bg-opacity-75 text-white" : "bg-white"}
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                            }
                          >
                            {({ checked }) => (
                              <>
                                <div className="flex w-full items-center justify-between">
                                  <div className="flex items-center">
                                    <div className="text-sm">
                                      <RadioGroup.Label
                                        as="p"
                                        className={`font-medium  ${
                                          checked ? "text-white" : "text-gray-900"
                                        }`}
                                      >
                                        {course.name}
                                      </RadioGroup.Label>
                                    </div>
                                  </div>
                                  {checked && (
                                    <div className="shrink-0 text-white">
                                      <AiFillCheckCircle className="h-6 w-6" />
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  </section>
                )}
                <section className="mt-8">
                  <h2 className="mb-4 text-2xl font-bold">自己紹介</h2>
                  <TextareaAutosize
                    name="name"
                    minRows={3}
                    placeholder="自己紹介を入力"
                    className="w-full resize-none rounded-xl border-2 border-gray-100 bg-gray-50 p-2"
                    value={data.bio}
                    onInput={(e) => {
                      const value = (e.target as HTMLTextAreaElement).value
                      setData({
                        ...data,
                        bio: value,
                      })
                    }}
                  />
                </section>{" "}
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
            )}
          </div>
        </>
      )}
    </>
  )
}

export default Page
