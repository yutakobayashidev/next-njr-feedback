import { ContentWrapper } from "@src/components/ContentWrapper"
import Loader from "@src/components/Loader"
import { MyPageSeo } from "@src/components/MyPageSeo"
import fetcher from "@src/lib/fetcher"
import { HttpMethod } from "@src/types"
import { getKnowledgeEditPath, getKnowledgePath } from "@src/utils/helper"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { ChangeEvent, useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { MdOutlineInfo } from "react-icons/md"
import TextareaAutosize from "react-textarea-autosize"
import useSWR from "swr"

type Knowledge = {
  id: string
  title: string
  content: string
  emoji: string
  published: boolean
}

export default function Post() {
  const { data: session } = useSession()

  const [changed, setChanged] = useState(false)

  const pageChangeHandler = () => {
    const answer = window.confirm("行った変更は保存されていません。保存せずに終了しますか？")
    if (!answer) {
      throw "Abort route"
    }
  }

  const beforeUnloadhandler = (event: BeforeUnloadEvent) => {
    event.returnValue = "行った変更は保存されていません。保存せずに終了しますか？"
  }

  useEffect(() => {
    if (changed) {
      router.events.on("routeChangeStart", pageChangeHandler)
      window.addEventListener("beforeunload", beforeUnloadhandler)
      return () => {
        router.events.off("routeChangeStart", pageChangeHandler)
        window.removeEventListener("beforeunload", beforeUnloadhandler)
      }
    }
  }, [changed])

  useEffect(() => {
    if (!session && typeof session != "undefined") {
      router.push(`/`)
    }
  })

  const router = useRouter()

  const { id: knowledgeId } = router.query

  const { data: knowledge, isValidating } = useSWR<Knowledge>(
    router.isReady && `/api/knowledge/${knowledgeId}`,
    fetcher,
    {
      dedupingInterval: 1000,
      onError: () => router.push("/"),
      revalidateOnFocus: false,
    },
  )

  const [data, setData] = useState<Knowledge>({
    id: "",
    title: "",
    content: "",
    emoji: "",
    published: false,
  })

  useEffect(() => {
    if (knowledge)
      setData({
        id: knowledge.id ?? "",
        title: knowledge.title ?? "",
        content: knowledge.content ?? "",
        emoji: knowledge.emoji ?? "",
        published: knowledge.published ?? false,
      })
  }, [knowledge])

  const [publishing, setPublishing] = useState(false)
  const [disabled, setDisabled] = useState(true)

  async function publish() {
    setPublishing(true)

    try {
      const response = await fetch(`/api/knowledge/${knowledgeId}`, {
        body: JSON.stringify({
          id: data.id,
          title: data.title,
          content: data.content,
          emoji: data.emoji,
          published: data.published,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: HttpMethod.PUT,
      })

      if (response.ok) {
        setChanged(false)
        toast.success(`変更を保存しました`)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setPublishing(false)
    }
  }

  useEffect(() => {
    if (data.title && data.emoji && data.content && !publishing) setDisabled(false)
    else setDisabled(true)
  }, [publishing, data])

  if (isValidating || !session)
    return (
      <>
        <Loader />
      </>
    )
  return (
    <>
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
      <MyPageSeo
        path={"/knowledge/" + data.id + "/edit"}
        title={data.title ? data.title + "を編集中..." : "無題のナレッジを編集中..."}
      />
      <div className="border-b">
        <ContentWrapper>
          <div className="flex items-center justify-between py-2">
            <Link href={getKnowledgePath(data.id)}>← ナレッジに戻る</Link>
            <div className="flex items-center justify-between space-x-10 md:space-x-16">
              <Link href={getKnowledgeEditPath(data.id)}>エディター</Link>
              <Link href={"/knowledge/" + data.id + "/edit/settings"}>設定</Link>
            </div>
            <div>
              <button
                disabled={disabled}
                onClick={async () => {
                  await publish()
                }}
                className={`${
                  disabled
                    ? "cursor-not-allowed rounded-md border-gray-300 bg-gray-300 px-4 py-2 font-bold"
                    : "rounded-md bg-n px-4 py-2 font-bold hover:opacity-90"
                } text-white transition-all duration-150 ease-in-out focus:outline-none`}
              >
                {data.published ? "変更を保存" : "下書き保存"}
              </button>
            </div>
          </div>
        </ContentWrapper>
      </div>
      <div className="mx-auto max-w-screen-lg px-4 md:px-8">
        <div className="pb-16">
          {/*
        <div>
          <button className="flex w-full items-center overflow-hidden border">
            <div className="flex items-center justify-center text-5xl">
              <span>{data.emoji}</span>
            </div>
            <div>絵文字を変更</div>
          </button>
        </div>
        */}
          <TextareaAutosize
            name="title"
            onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setData({
                ...data,
                title: (e.target as HTMLTextAreaElement).value,
              })
            }
            onChange={(e) => {
              setChanged(true)
            }}
            className="font-cal mt-6 w-full resize-none border-none px-2 py-4 text-5xl font-bold text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-0"
            placeholder="タイトル"
            value={data.title}
          />
          <TextareaAutosize
            name="content"
            onChange={(e) => {
              setChanged(true)
            }}
            onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setData({
                ...data,
                content: (e.target as HTMLTextAreaElement).value,
              })
            }
            className="w-full resize-none border-none px-2 py-3 text-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-0"
            placeholder={"Markdownで入力..."}
            value={data.content}
          />
          <div className="flex items-center text-lg text-gray-500">
            <MdOutlineInfo className="mr-1" />
            <Link href="/guideline" className="text-gray-500 underline">
              ガイドライン
            </Link>
            を意識した投稿を心がけましょう
          </div>
        </div>
      </div>
    </>
  )
}
