import "dayjs/locale/ja"

import Alert from "@src/components/Alert"
import { CommentCard } from "@src/components/Comment"
import { ContentWrapper } from "@src/components/ContentWrapper"
import { Layout } from "@src/components/Layout"
import { MyPageSeo } from "@src/components/MyPageSeo"
import { NotContent } from "@src/components/NotContent"
import { CommentSidebar } from "@src/components/QuestionSideber"
import prisma from "@src/lib/prisma"
import { NextPageWithLayout } from "@src/pages/_app"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { HttpMethod } from "@src/types/"
import { QuestionProps } from "@src/types/question"
import { getQuestionPath, getReportPath, getUserpagePath } from "@src/utils/helper"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { AiOutlineEye, AiOutlineFlag } from "react-icons/ai"
import { BsPencil } from "react-icons/bs"
import { IoTriangle } from "react-icons/io5"
import TextareaAutosize from "react-textarea-autosize"

dayjs.extend(relativeTime)
dayjs.locale("ja")

const Page: NextPageWithLayout<QuestionProps> = (props) => {
  const {
    id,
    title,
    _count,
    archive,
    archived_at,
    comments,
    content,
    course,
    createdAt,
    last_comment_created_at,
    updatedAt,
    user,
    views,
    votes,
  } = props
  const { data: session } = useSession()

  const [allcomments, setComments] = useState(comments)
  const [commentcontent, setContent] = useState<string>("")
  const [questiontitle, setTitle] = useState<string>("")
  const [showtitleEditForm, setTitleEditForm] = useState(false)
  const [isVoted, setIsVoted] = useState(false)
  const [voteCount, setVoteCount] = useState(Number(_count.votes))

  const [archived, setArchived] = useState(false)
  const [archived_time, setArchived_at] = useState("")

  useEffect(() => {
    setArchived(archive)
    setArchived_at(archived_at)

    const hasVotes = votes.some((vote) => vote.user.id === session?.user.id)
    setIsVoted(hasVotes)
  }, [archive, archived_at, session?.user.id, votes])

  async function status(archive: boolean) {
    try {
      const response = await fetch(`/api/question/${props.id}`, {
        body: JSON.stringify({
          archive: archive,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: HttpMethod.PUT,
      })

      const res = await response.json()

      if (response.status !== 200) {
        toast.error(res.error.message)
      } else {
        setArchived(res.archive)
        setArchived_at(res.archived_at)
      }
    } catch (error) {
      console.error(error)
    }
  }

  async function addvotes(id: string) {
    const response = await fetch(`/api/question/${id}/votes`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: HttpMethod.POST,
    })

    if (response.ok) {
      setIsVoted(!isVoted)
      setVoteCount(voteCount + (isVoted ? -1 : +1))
    } else {
      console.error("投票に失敗しました")
    }
  }

  useEffect(() => {
    // Set initial value to no-prefix and comment's content.
    if (title) setTitle(title)
  }, [title])

  const sendComment = async () => {
    try {
      const response = await fetch(`/api/answer`, {
        body: JSON.stringify({
          id: id,
          content: commentcontent,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: HttpMethod.POST,
      })

      if (response.status === 201) {
        const comment = await response.json()
        setComments([...allcomments, comment])
        setContent("")
      }
    } catch (error) {
      console.error(error)
    }
  }

  const deleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/answer/${commentId}`, {
        method: HttpMethod.DELETE,
      })

      if (response.ok) {
        toast.success("コメントを削除しました")
        setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId))
      } else {
        const json = await response.json()
        toast.error(json.error.message)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const updateComment = async (commentId: string, newComment: string) => {
    try {
      const response = await fetch(`/api/answer/${commentId}`, {
        body: JSON.stringify({ content: newComment }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
      })
      if (response.ok) {
        const updatedComment = await response.json()
        setComments((comments) =>
          comments.map((comment) => {
            if (comment.id === commentId) {
              return updatedComment
            }
            return comment
          }),
        )
      } else {
        const json = await response.json()
        toast.error(json.error.message)
      }
    } catch (error) {
      console.error(error)
    }
  }

  async function handletitle() {
    try {
      const response = await fetch(`/api/question/${id}`, {
        body: JSON.stringify({
          title: questiontitle,
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
      fetch(`/api/question/${id}/views`, {
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
      <MyPageSeo path={getQuestionPath(id)} title={title} />
      {last_comment_created_at && dayjs(last_comment_created_at).diff(dayjs(), "month") < -6 && (
        <Alert>💡最後のコメントが追加されてから半年以上が経過しています</Alert>
      )}
      <div className="py-16">
        <ContentWrapper>
          <div className="block md:flex md:items-start">
            <div className="md:w-[calc(100%_-_27%)] md:pr-10">
              <div className="flex items-center">
                <div
                  className={`${
                    archived ? "bg-gray-400" : "bg-primary"
                  }  mr-2  inline-block rounded-full py-2 px-4 font-inter text-sm font-bold text-white`}
                >
                  <span className="flex items-center">{archived ? "Resolved" : "Open"}</span>
                </div>
                <span className="mr-2 text-gray-600">
                  {last_comment_created_at
                    ? dayjs(last_comment_created_at).fromNow() + "にコメント追加"
                    : dayjs(createdAt).fromNow() + "に作成"}
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
                    value={questiontitle}
                    placeholder="タイトルを入力"
                    className="w-full rounded-xl border-2 border-gray-100 bg-gray-50 p-2"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <button
                    className={`ml-8 shrink-0 rounded-md px-2 font-bold text-white ${
                      !questiontitle ? "bg-gray-300 opacity-95" : "bg-primary hover:opacity-90"
                    }`}
                    disabled={!questiontitle}
                    onClick={async () => {
                      await handletitle()
                    }}
                  >
                    保存する
                  </button>
                </div>
              ) : (
                <h1 className="my-4 font-inter text-3xl font-bold leading-10">
                  {questiontitle}
                  {session.user.id == user.id && (
                    <button onClick={() => setTitleEditForm(true)}>
                      <BsPencil className="ml-2 text-xl text-gray-400" />
                    </button>
                  )}
                </h1>
              )}
              <div className="block text-sm md:flex md:items-center">
                <div className="flex items-center">
                  {course.map((post) => (
                    <>
                      <span className="mr-2 rounded-2xl bg-coursebg px-3 py-1 font-bold text-course">
                        {post.name}コース
                      </span>
                    </>
                  ))}
                  <Link
                    href={getReportPath()}
                    className="flex items-center text-base text-gray-500"
                  >
                    <AiOutlineFlag className="mr-1" />
                    報告
                  </Link>
                </div>
              </div>
              <div className="py-10">
                <div className="flex">
                  <div className="relative">
                    <Link href={getUserpagePath(user.handle)} className="block">
                      <img
                        height={65}
                        width={65}
                        src={user.image}
                        className="mr-6 aspect-square h-auto rounded-full object-cover"
                        alt={user.displayname}
                      />
                    </Link>
                    {user.role == "teacher" && (
                      <span className="absolute right-7 top-[50px]">
                        <img
                          className="h-5 w-5 rounded-md border"
                          src="https://nnn.ed.jp/assets/img/touch_icon.png"
                          alt="角川ドワンゴ学園職員"
                        ></img>
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <Link
                      href={getUserpagePath(user.handle)}
                      className="mr-2 font-inter text-lg font-bold text-gray-800  "
                    >
                      {user.displayname} {user.role == "student" ? "(生徒)" : "(メンター / TA)"}
                    </Link>
                    <time className="text-sm text-gray-500" dateTime={updatedAt}>
                      {dayjs(createdAt).fromNow()}
                    </time>
                    <div className="mt-2 font-inter text-lg leading-7 text-gray-800">{content}</div>
                  </div>
                  <div>
                    <div className="flex flex-col text-center">
                      <button
                        onClick={async () => {
                          await addvotes(id as string)
                        }}
                      >
                        <IoTriangle
                          className={` ${
                            isVoted ? "text-primary" : "text-gray-600 hover:text-gray-500"
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                      <div className="my-3 text-gray-600">{voteCount}</div>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="my-5 text-2xl font-bold">{allcomments.length}件のコメント</h3>
              {allcomments.length > 0 ? (
                <>
                  {allcomments.map((comment) => (
                    <CommentCard
                      onDeleteComment={deleteComment}
                      onUpdateComment={updateComment}
                      key={comment.id}
                      comment={comment}
                      session={session}
                    />
                  ))}
                </>
              ) : (
                <NotContent message="最初の回答をしましょう" />
              )}
              <div className="my-10">
                <div className="flex items-start">
                  {session && session.user && session.user.image && session.user.displayname && (
                    <img
                      className="mr-4 aspect-square rounded-full object-cover"
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
                      placeholder="回答しましょう。"
                      className="w-full resize-none rounded-xl border-2 border-gray-100 bg-gray-50 p-2"
                    />
                    <div className="text-right">
                      <button
                        disabled={!commentcontent}
                        type="submit"
                        onClick={sendComment}
                        className="my-4 inline-flex h-12 w-36 items-center justify-center rounded-md bg-primary text-center font-bold text-white hover:enabled:hover:bg-blue-500 disabled:bg-gray-300 disabled:opacity-90"
                      >
                        回答する
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CommentSidebar
              archived={archived}
              archived_time={archived_time}
              status={status}
              props={props}
              session={session}
            />
          </div>
        </ContentWrapper>
      </div>
    </>
  )
}

Page.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  const session = await getServerSession(req, res, authOptions)

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }

  const data = await prisma.question.findFirst({
    include: {
      _count: {
        select: {
          votes: true,
        },
      },
      comments: {
        include: {
          _count: {
            select: {
              votes: true,
            },
          },
          user: {
            select: {
              id: true,
              displayname: true,
              handle: true,
              image: true,
              role: true,
            },
          },
          votes: {
            select: {
              user: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
        orderBy: [
          {
            votes: {
              _count: "desc",
            },
          },
          {
            createdAt: "asc",
          },
        ],
      },
      course: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        select: {
          id: true,
          displayname: true,
          handle: true,
          image: true,
          role: true,
        },
      },
      votes: {
        select: {
          user: {
            select: {
              id: true,
            },
          },
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

  const question = JSON.parse(JSON.stringify(data))

  return {
    props: question,
  }
}

export default Page
