import { ContentWrapper } from "@src/components/ContentWrapper"
import { MyPageSeo } from "@src/components/MyPageSeo"
import { NextPage } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

const Page: NextPage = () => {
  const { data: session } = useSession()

  const router = useRouter()

  useEffect(() => {
    if (!session && typeof session != "undefined") {
      router.push(`/`)
    }
  })

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  if (!session) {
    return <></>
  }

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      const body = { title, content }
      const post = await fetch("/api/knowledge", {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      })

      const json = await post.json()
      await router.push("/knowledge/" + json.id)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <MyPageSeo path="/" title={"ナレッジを作成"} />
      <ContentWrapper>
        <h1 className="my-8 text-center text-4xl font-bold">ナレッジを作成</h1>
        <p className="mb-6 text-center text-base text-gray-500">
          ナレッジはN中等部内の様々な情報を整理するためのコンテンツです。
          <br />
          作成する際は<Link href="/guideline">ガイドライン</Link>
          をできるだけ遵守してください。
        </p>
        <form onSubmit={submitData}>
          <h2 className="text-lg font-bold">タイトル</h2>
          <input
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タイトルを入力"
            type="text"
            value={title}
          />
          <h2 className="text-lg font-bold">コンテンツ</h2>
          <textarea
            cols={50}
            onChange={(e) => setContent(e.target.value)}
            placeholder="コンテンツを入力"
            rows={8}
            value={content}
          />
          <div className="text-center">
            <button
              disabled={!content || !title}
              type="submit"
              className="h-12 w-36 rounded bg-n font-bold text-white hover:enabled:hover:bg-blue-500 disabled:opacity-90"
            >
              ナレッジページを作成
            </button>
          </div>
        </form>
      </ContentWrapper>
      <style jsx>{`
        .page {
          background: var(--geist-background);
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        input[type="text"],
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </>
  )
}

export default Page
