import "dayjs/locale/ja"

import { CommentCard } from "@src/components/Comment"
import { ContentWrapper } from "@src/components/ContentWrapper"
import { Layout } from "@src/components/Layout"
import { MyPageSeo } from "@src/components/MyPageSeo"
import { NotContent } from "@src/components/NotContent"
import fetcher from "@src/lib/fetcher"
import prisma from "@src/lib/prisma"
import { NextPageWithLayout } from "@src/pages/_app"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { DiscussionProps, HttpMethod } from "@src/types"
import { getDiscussionPath, getUserpagePath } from "@src/utils/helper"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { getServerSession } from "next-auth"
import { useSession } from "next-auth/react"
import { Fragment, useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { AiOutlineCheck, AiOutlineEye, AiOutlineFlag } from "react-icons/ai"
import { BsPencil } from "react-icons/bs"
import { FaRegComment } from "react-icons/fa"
import TextareaAutosize from "react-textarea-autosize"
import useSWR from "swr"

dayjs.extend(relativeTime)
dayjs.locale("ja")

interface SitediscussionData {
  data: Array<DiscussionProps>
}

const Page: NextPageWithLayout<DiscussionProps> = (props) => {
  const { id, title, archive, archived_at, comments, content, updatedAt, user, views } = props
  const { data: session } = useSession()

  const router = useRouter()

  const [commentcontent, setContent] = useState("")
  const [discussiontitle, setTitle] = useState<string>("")
  const [showtitleEditForm, setTitleEditForm] = useState(false)

  useEffect(() => {
    // Set initial value to no-prefix and comment's content.
    if (title) setTitle(title)
  }, [title])

  const { data } = useSWR<SitediscussionData>(router.isReady && `/api/discussion`, fetcher)
  async function status(archive: boolean) {
    try {
      const response = await fetch(`/api/discussion/${id}`, {
        body: JSON.stringify({
          archive: archive,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: HttpMethod.PUT,
      })

      if (response.status !== 200) {
        const paas = await response.json()

        toast.error(paas.error.messsage)
      } else {
        router.replace(router.asPath)
      }
    } catch (error) {
      console.error(error)
    }
  }

  async function postcomments() {
    try {
      const response = await fetch(`/api/comments`, {
        body: JSON.stringify({
          id: id,
          content: commentcontent,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: HttpMethod.POST,
      })

      if (response.status !== 200) {
        const paas = await response.json()

        toast.error(paas.error.messsage)
      } else {
      }
    } catch (error) {
      console.error(error)
    } finally {
      router.replace(router.asPath)
    }
  }

  async function handletitle() {
    try {
      const response = await fetch(`/api/discussion/${id}`, {
        body: JSON.stringify({
          title: discussiontitle,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: HttpMethod.PUT,
      })

      if (response.ok) {
        toast.success("タイトルを変更しました")
        setTitleEditForm(false)
      } else {
        toast.error("エラーが発生しました")
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  useEffect(() => {
    const registerView = () =>
      fetch(`/api/discussion/${id}/views`, {
        method: "POST",
      })

    if (session) {
      registerView()
    }
  }, [id, session])

  if (!session) {
    return null
  }

  return (
    <>
      <MyPageSeo path={getDiscussionPath(id)} title={title} />
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
      <div className="py-16">
        <ContentWrapper>
          <div className="block md:flex md:items-start">
            <div className="md:w-[calc(100%_-_27%)] md:pr-10">
              <div className="flex items-center">
                <div
                  className={`${
                    archive ? "bg-gray-400" : "bg-primary"
                  }  mr-2  inline-block rounded-full py-2 px-4 font-inter text-sm font-bold text-white`}
                >
                  <span className="flex items-center">{archive ? "Archive" : "Open"}</span>
                </div>
                <span className="mr-2 text-gray-600">
                  {dayjs(updatedAt).format("YYYY/MM/DD")}
                  に投稿
                </span>
                <span className="flex items-center text-gray-500">
                  <AiOutlineEye className="mr-1" />
                  {views}
                </span>
              </div>
              {showtitleEditForm ? (
                <div className="my-4 flex">
                  <input
                    name="title"
                    value={discussiontitle}
                    placeholder="タイトルを入力"
                    className="w-full rounded-xl border-2 border-gray-100 bg-gray-50 p-2"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <button
                    className={`ml-8 shrink-0 rounded-md px-2 font-bold text-white ${
                      !discussiontitle ? "bg-gray-300 opacity-95" : "bg-primary hover:opacity-90"
                    }`}
                    disabled={!discussiontitle}
                    onClick={async () => {
                      await handletitle()
                    }}
                  >
                    保存する
                  </button>
                </div>
              ) : (
                <h1 className="my-4 font-inter text-3xl font-bold leading-10">
                  {discussiontitle}
                  {session.user.id == user.id && (
                    <button onClick={() => setTitleEditForm(true)}>
                      <BsPencil className="ml-2 text-xl text-gray-400" />
                    </button>
                  )}
                </h1>
              )}
              <div className="block text-sm md:flex md:items-center">
                <div className="flex items-center">
                  <span className="mr-2 rounded-2xl bg-coursebg px-3 py-1 text-sm font-bold text-course">
                    ネットコース
                  </span>
                  <span className="mr-2 rounded-2xl bg-coursebg px-3 py-1 text-sm font-bold text-course">
                    通学コース
                  </span>
                  <Link
                    href={`/report?path=${router.asPath}`}
                    className="flex items-center text-base text-gray-500"
                  >
                    <AiOutlineFlag className="mr-1" />
                    報告
                  </Link>
                </div>
              </div>
              <div className="py-10">
                <div className="block items-start md:flex">
                  <div className="relative">
                    <Link href={getUserpagePath(user.handle)} className="block">
                      <img
                        height={65}
                        width={65}
                        src={user.image}
                        className="mr-6 h-auto rounded-full"
                        alt={user.displayname}
                      />
                    </Link>
                    {user.email.endsWith("@n-jr.jp") == false && (
                      <span className="absolute right-7 -bottom-1">
                        <img
                          className="h-5 w-5 rounded-md border"
                          src="https://nnn.ed.jp/assets/img/touch_icon.png"
                          alt="角川ドワンゴ学園職員"
                        ></img>
                      </span>
                    )}
                  </div>
                  <div className="mt-5 flex-1 md:mt-0">
                    <Link
                      href={getUserpagePath(user.handle)}
                      className="mr-2 font-inter text-lg font-bold text-gray-800  "
                    >
                      {user.displayname}{" "}
                      {user.email.endsWith("@n-jr.jp") ? "(生徒)" : "(メンター / TA)"}
                    </Link>
                    <time className="text-sm text-gray-500" dateTime={updatedAt}>
                      {dayjs(updatedAt).fromNow()}
                    </time>
                    <div className="mt-2 font-inter text-lg leading-7 text-gray-800">{content}</div>
                  </div>
                </div>
              </div>
              <h3 className="my-5 text-2xl font-bold">{comments.length}件のコメント</h3>
              {comments.length > 0 ? (
                <>
                  {comments.map((comment) => (
                    <CommentCard key={comment.id} comment={comment} session={session} />
                  ))}
                </>
              ) : (
                <NotContent />
              )}
              <div className="my-10">
                <div className="flex items-start">
                  {session && session.user && session.user.image && session.user.displayname && (
                    <img
                      className="mr-4 rounded-full"
                      src={session.user.image}
                      height={60}
                      width={60}
                      alt={session.user.displayname}
                    ></img>
                  )}
                  <div className="flex-1">
                    <TextareaAutosize
                      name="name"
                      minRows={3}
                      onChange={(e) => setContent(e.target.value)}
                      value={commentcontent}
                      placeholder="コメントして議論に参加しましょう。"
                      className="w-full resize-none rounded-xl border-2 border-gray-100 bg-gray-50 p-2"
                    />
                    <div className="text-right">
                      <button
                        disabled={!commentcontent}
                        type="submit"
                        onClick={async () => {
                          await postcomments()
                        }}
                        className="my-4 inline-flex h-12 w-36 items-center justify-center rounded-md bg-primary text-center font-bold text-white hover:enabled:hover:bg-blue-500 disabled:bg-gray-300 disabled:opacity-90"
                      >
                        コメントを投稿
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 p-4">
              {user.id == session.user.id && (
                <>
                  {archive ? (
                    <div className="mb-4 flex items-center justify-between">
                      {archived_at && (
                        <span className="mr-1">
                          {dayjs(archived_at).format("YYYY/MM/DD")}にアーカイブ
                        </span>
                      )}
                      <button
                        className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-gray-50 py-2 px-4 text-center font-bold shadow-md"
                        onClick={async () => {
                          await status(false)
                        }}
                      >
                        <AiOutlineCheck className="mr-2 text-gray-600" />
                        再オープン
                      </button>
                    </div>
                  ) : (
                    <button
                      className="mb-4 inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-gray-50 py-3 px-6 text-center font-bold shadow-md"
                      onClick={async () => {
                        await status(true)
                      }}
                    >
                      <AiOutlineCheck className="mr-2 text-gray-600" />
                      アーカイブする
                    </button>
                  )}
                </>
              )}
              <h4 className="text-2xl font-bold">新しく作成された議論</h4>
              <p className="my-2 text-gray-500">最近作成されたアーカイブされていない議論の一覧</p>
              <div className="my-4">
                {data && data?.data.length > 0 ? (
                  <>
                    {data?.data.map((post) => (
                      <div key={post.id}>
                        <div className="my-2 flex items-center">
                          <Link href={getUserpagePath(post.user.handle)}>
                            <img
                              src={post.user.image}
                              alt={post.user.displayname}
                              height={30}
                              width={30}
                              className="mr-1 rounded-full"
                            />
                          </Link>
                          <Link href={getUserpagePath(post.user.handle)}>
                            <span className="mr-2 text-xs font-bold text-gray-800 ">
                              {post.user.displayname}
                            </span>
                          </Link>
                          <span className="text-xs font-bold text-gray-400">投稿</span>
                        </div>
                        <Link
                          href={getDiscussionPath(post.id)}
                          className="text-base font-bold leading-7 text-gray-800 line-clamp-3"
                        >
                          {post.title}
                        </Link>
                        <span className="mt-2 flex items-center text-gray-600">
                          <FaRegComment className="mr-1" size={17} />
                          {post._count.comments} comments
                        </span>
                      </div>
                    ))}
                  </>
                ) : (
                  <NotContent />
                )}
              </div>
              {/*
              <h4 className="font-inter text-3xl font-bold">Top Contributors</h4>
              <p className="my-2 text-gray-500">最も多く貢献したユーザーです。</p>
              <div className="my-4">
                <Link href={getUserpagePath("yuta")} className="flex items-center">
                  <img
                    height={40}
                    width={40}
                    className="mr-2 rounded-full"
                    src="https://lh3.googleusercontent.com/a/AEdFTp7CJbDs6e2z5NtruYwrWD_nhPBInFvCDq-Zo6Nf=s96-c"
                    alt={session.user.name}
                  ></img>
                  <span className="font-inter font-bold text-gray-800">Yuta Kobayashi</span>
                </Link>
              </div>
            */}
            </div>
          </div>
        </ContentWrapper>
      </div>
    </>
  )
}

Page.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.statusCode = 403
    return { props: { discussion: [] } }
  }

  const data = await prisma.discussion.findFirst({
    include: {
      comments: {
        include: {
          _count: {
            select: {
              votes: true,
            },
          },
          user: true,
          votes: true,
        },
        orderBy: [
          {
            createdAt: "asc",
          },
        ],
      },
      user: {
        select: {
          id: true,
          displayname: true,
          email: true,
          handle: true,
          image: true,
        },
      },
    },
    where: {
      id: String(params?.id),
    },
  })

  if (!data) {
    return {
      notFound: true,
    }
  }

  const discussion = JSON.parse(JSON.stringify(data))

  return {
    props: discussion,
  }
}

export default Page
