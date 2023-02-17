import { Dialog, Switch, Transition } from "@headlessui/react"
import Loader from "@src/components/Loader"
import { MyPageSeo } from "@src/components/MyPageSeo"
import fetcher from "@src/lib/fetcher"
import { HttpMethod } from "@src/types"
import { getKnowledgePath } from "@src/utils/helper"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { ChangeEvent, Fragment, useEffect, useRef, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { AiOutlineCheck } from "react-icons/ai"
import { HiTrash } from "react-icons/hi"
import { IoArrowBackOutline } from "react-icons/io5"
import { MdOutlineInfo } from "react-icons/md"
import TextareaAutosize from "react-textarea-autosize"
import useSWR from "swr"

type Knowledge = {
  id: string
  title: string
  archive: boolean
  content: string
  creator: {
    id: string
  }
  emoji: string
  published: boolean
}

export default function Post() {
  const { data: session } = useSession()

  const router = useRouter()

  const [changed, setChanged] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const cancelButtonRef = useRef(null)

  useEffect(() => {
    if (!session && typeof session != "undefined") {
      router.push(`/`)
    }
  })

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
    archive: false,
    content: "",
    creator: {
      id: "",
    },
    emoji: "",
    published: false,
  })

  useEffect(() => {
    if (knowledge)
      setData({
        id: knowledge.id ?? "",
        title: knowledge.title ?? "",
        archive: knowledge.archive ?? false,
        content: knowledge.content ?? "",
        creator: {
          id: knowledge.creator.id,
        },
        emoji: knowledge.emoji ?? "",
        published: knowledge.published ?? false,
      })
  }, [knowledge])

  async function save() {
    setPublishing(true)

    try {
      const response = await fetch(`/api/knowledge/${knowledgeId}`, {
        body: JSON.stringify({
          id: data.id,
          title: data.title,
          archive: data.archive,
          content: data.content,
          emoji: data.emoji,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: HttpMethod.PUT,
      })

      if (response.status !== 200) {
        const paas = await response.json()

        toast.error(paas.error.message)
      } else {
        setChanged(false)
        toast.success(`変更を保存しました`)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setPublishing(false)
    }
  }

  async function publish() {
    try {
      const response = await fetch(`/api/knowledge/${knowledgeId}`, {
        body: JSON.stringify({
          id: data.id,
          title: data.title,
          archive: data.archive,
          content: data.content,
          emoji: data.emoji,
          published: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: HttpMethod.PUT,
      })

      if (response.status !== 200) {
        const paas = await response.json()

        toast.error(paas.error.message)
      } else {
        setChanged(false)
        router.push(getKnowledgePath(knowledgeId as string))
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (data.emoji && !publishing && changed) setDisabled(false)
    else setDisabled(true)
  }, [publishing, data, changed])

  async function deleteKnowledge(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/knowledge/${id}`, {
        method: HttpMethod.DELETE,
      })

      if (response.ok) {
        router.push("/")
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (isValidating || !session) return <Loader />

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
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
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
                      <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <HiTrash className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          ナレッジの削除
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            本当にナレッジを削除してよろしいですか？ 復元することはできません。
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => {
                        deleteKnowledge(knowledgeId as string)
                        setOpen(false)
                      }}
                    >
                      削除
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
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto"
          onClose={() => setIsOpen(false)}
        >
          <div className="min-h-screen px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
            </Transition.Child>

            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="relative my-8 inline-block w-full max-w-md overflow-hidden rounded-xl bg-white p-6 align-middle shadow-xl transition-all">
                <h3 className="mb-6 text-center text-2xl font-bold">公開設定</h3>
                {/*
                <div>
                  <button className="mt-2 flex w-full items-center overflow-hidden rounded-xl border-2">
                    <div className="flex h-16 w-16 items-center justify-center bg-gray-100 text-5xl">
                      <span>{data.emoji}</span>
                    </div>
                    <div className="p-4 font-bold">絵文字を変更</div>
                  </button>
                </div>
                */}
                <div className="mx-auto">
                  {knowledge?.published && (
                    <>
                      <h2 className="mt-2 text-lg font-bold">アーカイブとしてマーク</h2>
                      <p className="mt-2 text-base text-gray-500">
                        不要となった情報はアーカイブしましょう。引き続き参照可能ですが、一覧などからは表示されなくなります。
                        <Link target="_blank" href="/archive">
                          アーカイブとは?
                        </Link>
                      </p>
                      <div className="mt-2">
                        <Switch
                          checked={data.archive}
                          onChange={() => setData({ ...data, archive: !data.archive })}
                          className={`${
                            data.archive ? "bg-primary" : "bg-gray-300"
                          } relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                        >
                          <span className="sr-only">Use setting</span>
                          <span
                            aria-hidden="true"
                            className={`${data.archive ? "translate-x-9" : "translate-x-0"}
              pointer-events-none inline-block h-[34px] w-[34px] rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                          />
                        </Switch>
                      </div>
                    </>
                  )}
                </div>
                {!knowledge?.published && knowledge?.creator?.id == session?.user?.id && (
                  <>
                    <div>
                      <h2 className="mt-2 text-lg font-bold">削除</h2>
                      <p className="mt-2 text-gray-500">
                        公開前であればナレッジを削除できます。この操作は元に戻せません。
                      </p>
                      <button
                        className="mt-2 flex items-center rounded-md bg-red-500 p-2 font-bold text-white shadow-sm hover:opacity-90"
                        onClick={() => setOpen(true)}
                      >
                        <HiTrash className="mr-1" />
                        ナレッジを削除
                      </button>
                    </div>
                  </>
                )}
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={async () => {
                      await publish()
                    }}
                    className="rounded-md bg-primary px-4 py-2 font-bold text-white transition-all duration-150 ease-in-out hover:opacity-90 focus:outline-none"
                  >
                    {data.published ? "更新する" : "公開する"}
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      <MyPageSeo
        path={"/knowledge/" + knowledgeId + "/edit"}
        title={data.title ? data.title + "を編集中..." : "無題のナレッジを編集中..."}
      />
      <div>
        <div>
          <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
            <div className="flex items-center justify-between py-2">
              <Link
                href={getKnowledgePath(knowledgeId as string)}
                className="flex items-center text-gray-700 "
              >
                <IoArrowBackOutline size={22} className="mr-2" />
                <span className="hidden md:block"> ナレッジを見る</span>
              </Link>
              <div className="flex items-center">
                {!knowledge?.published && (
                  <button
                    disabled={disabled}
                    onClick={async () => {
                      await save()
                    }}
                    className={`${
                      disabled
                        ? "flex items-center rounded-md px-4 py-2 font-bold opacity-70"
                        : "rounded-md p-2 font-bold hover:opacity-90"
                    } border-2 bg-white text-black transition-all duration-150 ease-in-out focus:outline-none`}
                  >
                    {publishing ? (
                      "保存中..."
                    ) : changed ? (
                      <>下書き保存</>
                    ) : (
                      <>
                        <span className="mr-1">
                          <AiOutlineCheck />
                        </span>
                        保存済み
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(true)}
                  className="ml-4 rounded-md bg-primary px-4 py-2 font-bold text-white transition-all duration-150 ease-in-out focus:outline-none"
                >
                  {data.published ? "更新する" : "公開する"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-screen-lg px-4 md:px-8">
          <div className="pb-16">
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
              placeholder="💡 この本文にはMarkdownを使用できます。"
              value={data.content}
            />
            <div className="flex items-center text-sm text-gray-500 md:text-base">
              <MdOutlineInfo className="mr-1" />
              <Link href="/guideline" className="text-gray-500 underline">
                ガイドライン
              </Link>
              を遵守した投稿を心がけてください。
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
