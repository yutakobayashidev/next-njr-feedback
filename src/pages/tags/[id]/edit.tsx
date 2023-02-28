import { Tag } from "@prisma/client"
import { Layout } from "@src/components/Layout"
import Loader from "@src/components/Loader"
import { MyPageSeo } from "@src/components/MyPageSeo"
import fetcher from "@src/lib/fetcher"
import useRequireAuth from "@src/lib/useRequireAuth"
import { NextPageWithLayout } from "@src/pages/_app"
import { HttpMethod } from "@src/types"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { AiFillTag } from "react-icons/ai"
import TextareaAutosize from "react-textarea-autosize"
import useSWR from "swr"

const Page: NextPageWithLayout = () => {
  const session = useRequireAuth()

  const router = useRouter()
  const [publishing, setPublishing] = useState(false)

  const { id } = router.query

  type TagProps = Pick<Tag, "id" | "name" | "description" | "icon" | "official">

  const { data: tag } = useSWR<TagProps>(session && `/api/tags/${id}`, fetcher, {
    dedupingInterval: 1000,
    onError: () => router.push("/"),
    revalidateOnFocus: false,
  })

  const [data, setData] = useState<TagProps>({
    id: "",
    name: "",
    description: "",
    icon: "",
    official: "",
  })

  useEffect(() => {
    if (tag)
      setData({
        id: tag.id,
        name: tag.name,
        description: tag.description ?? null,
        icon: tag.icon ?? null,
        official: tag.official ?? null,
      })
  }, [tag])

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
              icon: image.secure_url,
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

  async function updateTag(data: TagProps) {
    setPublishing(true)

    try {
      const response = await fetch(`/api/tags/${data.id}`, {
        body: JSON.stringify({
          ...data,
        }),
        method: HttpMethod.PUT,
      })
      if (response.status !== 200) {
        const json = await response.json()
        toast.error(json.error.message)
      } else {
        toast.success(`変更を保存しました`)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setPublishing(false)
    }
  }

  if (!session) return <Loader />

  return (
    <Layout>
      <>
        {tag && tag.name && <MyPageSeo path={"/"} title={tag.name} />}
        <div className="min-h-screen py-12">
          {data && tag && (
            <div className="mx-auto max-w-prose px-4 md:px-8">
              {tag.name && (
                <>
                  <h1 className="mb-4 text-center font-inter text-5xl font-bold">{tag.name}</h1>
                  <p className="mb-6 text-center text-lg text-gray-500">
                    {tag.name}の古い情報などがあれば更新してください
                  </p>
                </>
              )}
              <div>
                <label className="my-2 flex items-center text-base font-medium">アイコン</label>
                <div className="bg-gray-50 py-6 px-4">
                  <div className="flex items-center justify-center">
                    {data.icon ? (
                      <img
                        src={data.icon}
                        height={100}
                        width={100}
                        alt={data.name}
                        className="mr-8 aspect-square rounded-full bg-white object-cover"
                      />
                    ) : (
                      <div className="mr-8 flex h-[100px] w-[100px] items-center justify-center rounded-full bg-white">
                        <AiFillTag size={50} color="#ee7800" className="mr-1" />
                      </div>
                    )}

                    <label
                      className="cursor-pointer rounded-md border bg-white px-2 py-1 text-lg font-bold text-gray-800 shadow-lg  "
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
                </div>
                <label className="my-2 flex items-center text-base font-medium">
                  表示名<span className="ml-1 text-red-800">*</span>
                </label>
                <input
                  name="name"
                  className="w-full rounded-xl border-2 border-gray-100 bg-gray-50 p-2"
                  placeholder="表示名を入力してください"
                  type="text"
                  value={data.name}
                  onInput={(e) =>
                    setData({
                      ...data,
                      name: (e.target as HTMLTextAreaElement).value,
                    })
                  }
                />
                <label className="my-2 flex items-center text-base font-medium">詳細</label>
                <TextareaAutosize
                  name="description"
                  minRows={6}
                  className="w-full resize-none rounded-xl border-2 border-gray-100 bg-gray-50 p-2"
                  placeholder="説明を入力してください"
                  value={data.description || ""}
                  onInput={(e) =>
                    setData({
                      ...data,
                      description: (e.target as HTMLTextAreaElement).value,
                    })
                  }
                />
                <label className="my-2 flex items-center text-base font-medium">公式サイト</label>
                <input
                  name="official"
                  type="text"
                  className="w-full rounded-xl border-2 border-gray-100 bg-gray-50 p-2"
                  placeholder={"URLを入力してください"}
                  value={data.official || ""}
                  onInput={(e) =>
                    setData({
                      ...data,
                      official: (e.target as HTMLTextAreaElement).value,
                    })
                  }
                />
              </div>
              <div className="my-6 text-center">
                <button
                  onClick={() => {
                    updateTag(data)
                  }}
                  disabled={!data.name}
                  className="inline-flex h-12 w-36 items-center justify-center rounded-md bg-primary text-center font-bold text-white hover:enabled:hover:bg-blue-500 disabled:bg-gray-300 disabled:opacity-90"
                >
                  {publishing ? "更新中..." : "更新する"}
                </button>
              </div>
            </div>
          )}
        </div>
      </>
    </Layout>
  )
}

Page.getLayout = (page) => <Layout>{page}</Layout>

export default Page
