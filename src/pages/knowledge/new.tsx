import { MyPageSeo } from "@src/components/MyPageSeo"
import { getKnowledgeEditPath } from "@src/utils/helper"
import { NextPage } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import TextareaAutosize from "react-textarea-autosize"

const Page: NextPage = () => {
  const { data: session } = useSession()

  const [title, setTitle] = useState("")
  const [disabled, setDisabled] = useState(true)
  const [publishing, setPublishing] = useState(false)

  const router = useRouter()

  useEffect(() => {
    if (title && !publishing) setDisabled(false)
    else setDisabled(true)
  }, [title, publishing])

  useEffect(() => {
    if (!session && typeof session != "undefined") {
      router.push(`/`)
    }
  })

  if (!session) {
    return <></>
  }

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    setPublishing(true)
    try {
      const body = { title }
      const response = await fetch("/api/knowledge", {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      })

      if (response.ok) {
        setPublishing(false)
        const json = await response.json()
        await router.push(getKnowledgeEditPath(json.id))
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <MyPageSeo path="/new" title="ナレッジを作成" />
      <div className="mx-auto max-w-prose px-4 md:px-8">
        <h1 className="my-10 text-center text-4xl font-bold">ナレッジを作成</h1>
        <p className="mb-6 text-center text-base text-gray-500">
          ナレッジはN中等部内の様々な情報を整理するためのコンテンツです。
          <br />
          作成する際は<Link href="/guideline">ガイドライン</Link>
          をできるだけ遵守してください。
        </p>
        <form onSubmit={submitData}>
          <TextareaAutosize
            className="w-full resize-none rounded-xl border-2 border-gray-100 bg-gray-50 p-2"
            name="title"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タイトルを入力..."
          />
          <div className="mt-4 text-center">
            <button
              disabled={disabled}
              type="submit"
              className="h-12 w-36 rounded bg-n font-bold text-white hover:enabled:hover:bg-blue-500 disabled:opacity-90"
            >
              ナレッジページを作成
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Page
