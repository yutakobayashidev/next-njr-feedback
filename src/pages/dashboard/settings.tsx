import { RadioGroup } from "@headlessui/react"
import { config } from "@site.config"
import { ContentWrapper } from "@src/components/ContentWrapper"
import { DashboardSidebar } from "@src/components/DashboardSidebar"
import { Layout } from "@src/components/Layout"
import { MyPageSeo } from "@src/components/MyPageSeo"
import useRequireAuth from "@src/hooks/useRequireAuth"
import fetcher from "@src/lib/fetcher"
import type { NextPageWithLayout } from "@src/pages/_app"
import { HttpMethod, UserSettings } from "@src/types"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { AiFillCheckCircle } from "react-icons/ai"
import TextareaAutosize from "react-textarea-autosize"
import useSWR from "swr"

const Page: NextPageWithLayout = () => {
  const session = useRequireAuth()
  const { data: user } = useSWR<UserSettings>(session && `/api/me`, fetcher)
  const [disabled, setDisabled] = useState(true)
  const [publishing, setPublishing] = useState(false)

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

  const [data, setData] = useState<UserSettings>({
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

  async function saveSettings(data: UserSettings) {
    setDisabled(true)
    setPublishing(true)

    const response = await fetch("/api/me", {
      body: JSON.stringify({
        ...data,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: HttpMethod.PUT,
    })

    if (response.status !== 200) {
      setDisabled(false)
      setPublishing(false)
      const json = await response.json()
      toast.error(json.error.message)
    } else {
      setDisabled(false)
      setPublishing(false)
      toast.success(`変更を保存しました`)

      const event = new Event("visibilitychange")
      document.dispatchEvent(event)
    }
  }

  return (
    <Layout>
      <>
        <MyPageSeo path="/dashboard/settings" title="アカウント設定" />
        <ContentWrapper>
          <div className="mt-10 block items-start md:flex">
            <DashboardSidebar />
            <div className="ml-auto max-w-4xl flex-1">
              <h1 className="text-4xl font-bold">アカウント設定</h1>
              {user && data && (
                <div className="mt-10">
                  <h2 className="my-4 flex items-center text-lg font-medium">アイコン</h2>
                  <div className="flex items-center">
                    <img
                      src={data.image}
                      height={100}
                      width={100}
                      className="mr-8 aspect-square rounded-full object-cover shadow-lg"
                      alt={data.displayname || "アイコン"}
                    />
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
                    placeholder={data.name || "表示名"}
                    className="w-full resize-none rounded-xl border-2 border-gray-100 bg-gray-50 p-2"
                    value={data.displayname || ""}
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
                        data.email.endsWith("@n-jr.jp") &&
                        data.email.split("@")[0].indexOf("njr") != -1
                          ? data.email.substring(
                              data.email.indexOf("_") + 1,
                              data.email.indexOf("@"),
                            )
                          : "ハンドル"
                      }
                      className="w-full flex-1 resize-none rounded-xl border-2 border-gray-100 bg-gray-50 p-2"
                      value={data.handle}
                      onInput={(e) =>
                        setData({
                          ...data,
                          handle: (e.target as HTMLTextAreaElement).value,
                        })
                      }
                    />
                  </div>
                  {user.role === "student" && (
                    <>
                      <h2 className="my-4 flex items-center text-lg font-medium">コース</h2>
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
                    </>
                  )}
                  <h2 className="my-4 flex items-center text-lg font-medium">自己紹介</h2>
                  <TextareaAutosize
                    name="name"
                    minRows={3}
                    placeholder="自己紹介..."
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
                  <h2 className="my-4 flex items-center text-lg font-medium">
                    {user.role === "student"
                      ? "卒業・退会済みとしてマーク"
                      : "退職済みとしてマーク"}
                  </h2>
                  <p className="mb-2 text-sm text-gray-500">
                    情報整理のため、{user.role === "student" ? "卒業や退会" : "退職"}
                    時期が近づいているときに有効にしてください。
                  </p>
                  <input
                    type="checkbox"
                    name="agree"
                    id="agreeCheck"
                    checked={data.leave}
                    onChange={(e) =>
                      setData({
                        ...data,
                        leave: !data.leave,
                      })
                    }
                    className="h-4 w-4 rounded border-0 bg-gray-100 text-primary focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-200 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                  />
                  <label htmlFor="agreeCheck" className="ml-2 text-sm font-medium text-gray-600">
                    {user.role === "student" ? "卒業・退会" : "退職"}済みとしてマーク
                  </label>
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
              )}
            </div>
          </div>
        </ContentWrapper>
      </>
    </Layout>
  )
}

export default Page
