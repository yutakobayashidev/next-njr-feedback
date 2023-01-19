import "dayjs/locale/ja"

import { Dialog, Transition } from "@headlessui/react"
import { Alert } from "@src/components/Alert"
import { ContentWrapper } from "@src/components/ContentWrapper"
import { MyPageSeo } from "@src/components/MyPageSeo"
import prisma from "@src/lib/prisma"
import { KnowledgeProps } from "@src/types"
import { getKnowledgeEditPath, getKnowledgePath } from "@src/utils/helper"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { GetServerSideProps, NextPage } from "next"
import Link from "next/link"
import Router, { useRouter } from "next/router"
import { getSession, useSession } from "next-auth/react"
import { Fragment, useEffect, useRef, useState } from "react"
import { BiWorld } from "react-icons/bi"
import { remark } from "remark"
import html from "remark-html"

/*
import data from "@emoji-mart/data"
import i18n from "@emoji-mart/data/i18n/ja.json"
import Picker from "@emoji-mart/react"
*/

dayjs.extend(relativeTime)
dayjs.locale("ja")

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  const session = await getSession({ req })

  if (!session) {
    res.statusCode = 403
    return { props: { knowledge: [] } }
  }

  const data = await prisma.knowledge.findFirst({
    include: {
      contributors: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      creator: {
        select: {
          id: true,
          image: true,
        },
      },
    },
    where: {
      id: String(params?.id),
    },
  })

  if (data?.published === false && data.creator.id != session.user.id) {
    res.statusCode = 403
    return { props: { knowledge: [] } }
  }

  const knowledge = JSON.parse(JSON.stringify(data))

  const htmlBody = await remark().use(html).process(knowledge.content)
  const contentHtml = htmlBody.toString()
  knowledge.content = contentHtml

  return {
    props: knowledge,
  }
}

async function deletePost(id: string): Promise<void> {
  await fetch(`/api/knowledge/${id}`, {
    method: "DELETE",
  })
  Router.push("/")
}

async function publishPost(id: string): Promise<void> {
  await fetch(`/api/knowledge/${id}`, {
    method: "PUT",
  })
  await Router.reload()
}

async function archivePost(id: string): Promise<void> {
  await fetch(`/api/archive/${id}`, {
    method: "PUT",
  })
  await Router.reload()
}

const Page: NextPage<KnowledgeProps> = (props) => {
  const {
    id,
    title,
    archive,
    content,
    contributors,
    creator,
    emoji,
    published,
    publishedAt,
    updatedAt,
  } = props

  const { data: session } = useSession()

  const userHasValidSession = Boolean(session)

  const [open, setOpen] = useState(false)

  const cancelButtonRef = useRef(null)

  const router = useRouter()

  useEffect(() => {
    if (!session && typeof session != "undefined") {
      router.push(`/`)
    }
  }, [session, router])

  if (!session) {
    return null
  }

  return (
    <>
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
                      onClick={() => {
                        publishPost(id)
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
      <MyPageSeo path={getKnowledgePath(id)} title={title} />
      {published === false && (
        <Alert id={id} edit={true}>
          💡 このナレッジは非公開です。有益な知識は積極的に公開しましょう
        </Alert>
      )}
      {published && !archive && dayjs(updatedAt).diff(dayjs(), "month") < -6 && (
        <>
          <Alert id={id} edit={true}>
            このナレッジは最終更新から半年以上が経過しています
          </Alert>
        </>
      )}
      {archive === true && (
        <div className="bg-gray-400">
          <ContentWrapper>
            <div className="py-5 text-center text-white">
              <span className="mr-3">🗑 このナレッジはアーカイブされています</span>
              <span>
                <Link href="\" className="my-3 rounded-md border-2 px-3 text-white">
                  アーカイブを取り消す
                </Link>
              </span>
            </div>
          </ContentWrapper>
        </div>
      )}
      <div className="mx-auto max-w-screen-lg px-4 md:px-8">
        <article className="py-16">
          <header className="mb-8">
            <div>
              <div className="flex justify-center text-8xl">
                <span>{emoji}</span>
              </div>
              <h1 className="mt-10 text-center text-3xl font-bold lg:text-5xl lg:leading-normal">
                <span>{title}</span>
              </h1>
              <div className="flex items-center justify-center pt-5">
                <div className="flex items-center">
                  <span className="flex items-center">
                    {publishedAt ? (
                      <>
                        <img
                          src={creator.image}
                          height={35}
                          width={35}
                          className="mr-2 rounded-full"
                          alt={creator.name}
                        ></img>
                        <time
                          dateTime={dayjs(publishedAt).toISOString()}
                          className="mr-3 text-sm text-gray-700  lg:text-lg"
                        >
                          {dayjs(publishedAt).isSame(dayjs(updatedAt), "day")
                            ? `${dayjs(publishedAt).format("YYYY/MM/DD")}に公開 `
                            : `${dayjs(updatedAt).fromNow()}に更新`}
                        </time>
                      </>
                    ) : (
                      <>
                        <img
                          src={creator.image}
                          height={35}
                          width={35}
                          className="mr-2 rounded-full"
                          alt={creator.name}
                        ></img>
                        <span className="mr-3 text-sm text-gray-700  lg:text-lg">非公開</span>
                      </>
                    )}
                  </span>
                  <span className="mr-3 rounded-2xl bg-coursebg py-1 px-2 text-sm font-bold text-course lg:px-4 lg:text-lg">
                    通学コース
                  </span>
                  <span className="mr-3 rounded-2xl bg-coursebg py-1 px-2 text-sm font-bold  text-course lg:px-4 lg:text-lg">
                    ネットコース
                  </span>
                </div>
              </div>
            </div>
          </header>
          <div
            className="prose max-w-none prose-h2:text-3xl prose-h3:text-2xl prose-p:text-lg"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          {/*
          <Picker
            i18n={i18n}
            locale={"ja"}
            theme={"light"}
            data={data}
            onEmojiSelect={console.log}
          />
          */}
          {!published && userHasValidSession && (
            <button onClick={() => deletePost(id)}>Delete</button>
          )}
          {!published && userHasValidSession && creator?.id == session.user?.id && (
            <button onClick={() => setOpen(true)}>Publish</button>
          )}
          {!archive && published && userHasValidSession && (
            <button onClick={() => archivePost(id)}>アーカイブ</button>
          )}
          <aside className="mt-5 border-t-2 pt-5">
            <h2 className="mb-5 text-2xl font-bold">
              🎉 このナレッジの貢献者 ({contributors.length}人)
            </h2>
            <p className="mb-4 text-base text-gray-600">
              ✨ 情報が古い場合や問題点を見つけた場合は
              <Link href={getKnowledgeEditPath(id)}>編集</Link>
              してみましょう。より良いナレッジを作成するための助けになります。
            </p>
            <div className="rounded-2xl border">
              {contributors &&
                contributors.map((contributor) => (
                  <div
                    key={contributor?.id}
                    className="flex items-start p-4 [&:not(:first-child)]:border-t-2"
                  >
                    <div>
                      <img
                        className="rounded-full border"
                        src={contributor.image}
                        height={"65"}
                        width={"65"}
                        alt={contributor.name}
                      ></img>
                    </div>
                    <div className="ml-5">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800 line-clamp-1">
                          {contributor.name}
                          {contributor.email === session?.user?.email && " (あなた)"}
                        </h2>
                      </div>
                      <div className="mt-2">
                        <span className="mr-2 rounded-2xl bg-coursebg px-3 py-1 text-sm font-bold text-course">
                          {contributor.email.endsWith("@n-jr.jp") ? "生徒" : "メンター / TA"}
                        </span>
                        {contributor.id === creator?.id && (
                          <span className="mr-2 rounded-2xl bg-coursebg px-3 py-1 text-sm font-bold text-course">
                            ページ作成者
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </aside>
        </article>
      </div>
    </>
  )
}

export default Page
