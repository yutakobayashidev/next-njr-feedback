import { Dialog, Transition } from "@headlessui/react"
import { ContentWrapper } from "@src/components/ContentWrapper"
import Loader from "@src/components/Loader"
import { MyPageSeo } from "@src/components/MyPageSeo"
import fetcher from "@src/lib/fetcher"
import { HttpMethod, KnowledgeProps } from "@src/types"
import { getKnowledgeEditPath, getKnowledgePath } from "@src/utils/helper"
import Link from "next/link"
import Router, { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { Fragment, useEffect, useRef, useState } from "react"
import { Toaster } from "react-hot-toast"
import { BiWorld } from "react-icons/bi"
import useSWR, { mutate } from "swr"

interface knowledgeData {
  id: string
  emoji: string
}

async function publishPost(id: string): Promise<void> {
  const response = await fetch(`/api/knowledge/${id}`, {
    body: JSON.stringify({
      published: true,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: HttpMethod.PUT,
  })
  if (response.ok) {
    mutate(`/api/knowledge/${id}`)
  }
}

async function restorearchivePost(id: string): Promise<void> {
  const response = await fetch(`/api/knowledge/${id}`, {
    body: JSON.stringify({
      archive: false,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: HttpMethod.PUT,
  })

  if (response.ok) {
    mutate(`/api/knowledge/${id}`)
  }
}

async function archivePost(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/knowledge/${id}`, {
      body: JSON.stringify({
        archive: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: HttpMethod.PUT,
    })
    if (response.ok) {
      mutate(`/api/knowledge/${id}`)
    }
  } catch (error) {
    console.error(error)
  }
}

async function deleteKnowledge(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/knowledge/${id}`, {
      method: HttpMethod.DELETE,
    })

    if (response.ok) {
      Router.push("/")
    }
  } catch (error) {
    console.error(error)
  }
}

export default function KnowledgeSettings() {
  const router = useRouter()

  const { data: session } = useSession()

  useEffect(() => {
    if (!session && typeof session != "undefined") {
      router.push(`/`)
    }
  })

  const [open, setOpen] = useState(false)
  const cancelButtonRef = useRef(null)

  const userHasValidSession = Boolean(session)

  const { id: postId } = router.query

  const { data: knowledge, isValidating } = useSWR<KnowledgeProps>(
    router.isReady && `/api/knowledge/${postId}`,
    fetcher,
    {
      dedupingInterval: 1000,
      onError: () => router.push("/"),
      revalidateOnFocus: false,
    },
  )

  const [data, setData] = useState<knowledgeData>({
    id: knowledge?.id ?? "id",
    emoji: knowledge?.emoji ?? "🚀",
  })

  {
    /*

  const [text, setText] = useState("")
  const [isFocus, setIsFocus] = useState(false)
  // フィルターにかけた配列をいれるためのステート
  const [suggestions, setSuggestions] = useState([])

  const handleChange = (text: string) => {
    // 入力した値をもとにフィルターをかける。
    // 空の配列を用意
    let matches = []
    // 入力する値が0文字より大きければ処理を行う
    if (text.length > 0) {
      matches = options.filter((opt) => {
        // new RegExp = パターンでテキストを検索するために使用
        const regex = new RegExp(`${text}`, "gi")
        return opt.text.match(regex)
      })
    }
    // フィルターをかけた配列をsuggestionsのステートに入れる
    setSuggestions(matches)
    setText(text)
  }

  const options = [
    { id: 1, text: "React" },
    { id: 2, text: "Ruby on Rails" },
    { id: 3, text: "JavaScript" },
    { id: 4, text: "TypeScript" },
    { id: 5, text: "Go" },
    { id: 6, text: "HTML" },
    { id: 7, text: "CSS" },
  ]

*/
  }

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
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center sm:mx-0 sm:h-10 sm:w-10">
                        <BiWorld size={35} color="#0099d9" />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          ナレッジの公開
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            本当にナレッジを公開しますか？ナレッジを一度公開すると削除はできなくなりますが、アーカイブは可能です。本文も後から編集可能です。
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-n px-4 py-2 text-base font-medium text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={async () => {
                        publishPost(postId as string)
                        setOpen(false)
                      }}
                    >
                      公開
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      キャンセル
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <MyPageSeo path={"/"} title="ナレッジの詳細設定" />
      <div className="border-b">
        <ContentWrapper>
          <div className="flex items-center justify-between py-2">
            <Link href={getKnowledgePath(data.id)}>← ナレッジに戻る</Link>
            <div className="flex items-center justify-between space-x-10 md:space-x-16">
              <Link href={getKnowledgeEditPath(data.id)}>エディター</Link>
              <Link href={"/knowledge/" + data.id + "/edit/settings"}>設定</Link>
            </div>
            <div></div>
          </div>
        </ContentWrapper>
      </div>
      <ContentWrapper>
        <div className="py-16">
          <h1 className="text-4xl font-bold">ナレッジの詳細設定</h1>
          <div className="mt-6">
            {/*
            <h2 className="text-2xl font-bold">コース</h2>
            <p className="mt-2 text-gray-500">
              通学コース・ネットコースを一つまたは2つ選択できます。
            </p>
            <div>
              <div className="my-2">
                <button>
                  <span>通学コース</span>
                </button>
              </div>
              <div className="my-2">
                <button>
                  <span>ネットコース</span>
                </button>
              </div>
            </div>
            <h2 className="text-2xl font-bold">タグ</h2>
            <p className="mt-2 text-gray-500">
              このナレッジに関連するキーワードを入力してください。
            </p>
            <input // inputにフォーカスしていたらisFocusにtrueを入れる
              onFocus={() => setIsFocus(true)}
              type="text"
              value={text}
              // handleChangeにe.target.valueを入れる
              onChange={(e) => handleChange(e.target.value)}
              placeholder="text..."
            />
            {suggestions?.map((suggestion, i) => (
              <p
                key={i}
                onClick={async () => {
                  // textにフィルターをかけた入力候補の値を入れる
                  await setText(suggestion.text)
                  await setIsFocus(false)
                }}
              >
                {suggestion.text}
              </p>
            ))}
            */}
            {!knowledge?.archive && knowledge?.published && (
              <>
                <h2 className="mt-2 text-2xl font-bold">アーカイブ</h2>
                <p className="mt-2 text-gray-500">
                  不要となった情報などはアーカイブとしてマークしましょう。ナレッジの一覧などからは表示されなくなりますが、ナレッジのURLに直接アクセスすれば引き続き参照可能です。
                </p>
                <button
                  onClick={() => archivePost(postId as string)}
                  className="mt-2 rounded-md bg-n px-5 py-3 font-bold text-white shadow-sm hover:opacity-90"
                >
                  アーカイブとしてマーク
                </button>
              </>
            )}
            {!knowledge?.published &&
              userHasValidSession &&
              knowledge?.creator?.id == session?.user?.id && (
                <>
                  <h2 className="mt-2 text-2xl font-bold">ナレッジを公開</h2>
                  <p className="mt-2 text-gray-500">
                    有益な知識は積極的に公開しましょう。ナレッジの内容はガイドラインを遵守するよう心がけてください
                  </p>
                  <button
                    className="mt-2 rounded-md bg-n px-5 py-3 font-bold text-white shadow-sm hover:opacity-90"
                    onClick={() => setOpen(true)}
                  >
                    ナレッジを公開
                  </button>
                </>
              )}
            {knowledge?.archive && knowledge?.published && (
              <>
                <h2 className="mt-2 text-2xl font-bold">アーカイブを取り消す</h2>
                <p className="mt-2 text-gray-500">
                  アーカイブは不要となった情報などを整理するための機能です。もし戻したくなったら以下のボタンをクリックしてください:)
                </p>
                <button
                  onClick={() => restorearchivePost(postId as string)}
                  className="mt-2 rounded-md bg-n px-5 py-3 font-bold text-white shadow-sm hover:opacity-90"
                >
                  アーカイブを取り消す
                </button>
              </>
            )}
            {!knowledge?.published &&
              userHasValidSession &&
              knowledge?.creator?.id == session?.user?.id && (
                <>
                  <h2 className="mt-2 text-2xl font-bold">ナレッジを削除</h2>
                  <p className="mt-2 text-gray-500">
                    公開前のみナレッジを削除することができます。公開後はアーカイブが可能です。この操作は元に戻せません。
                  </p>
                  <button
                    className="mt-2 rounded-md bg-red-500 px-5 py-3 font-bold text-white shadow-sm hover:opacity-90"
                    onClick={() => deleteKnowledge(postId as string)}
                  >
                    ナレッジを削除
                  </button>
                </>
              )}
            {/*
            <div>
              <button>変更を保存</button>
            </div>
          */}
          </div>
        </div>
      </ContentWrapper>
    </>
  )
}
