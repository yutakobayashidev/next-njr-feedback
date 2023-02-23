import "dayjs/locale/ja"

import { Menu, Transition } from "@headlessui/react"
import { Alert } from "@src/components/Alert"
import { ContentWrapper } from "@src/components/ContentWrapper"
import { Layout } from "@src/components/Layout"
import { MyPageSeo } from "@src/components/MyPageSeo"
import prisma from "@src/lib/prisma"
import { NextPageWithLayout } from "@src/pages/_app"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { HttpMethod, KnowledgeProps } from "@src/types"
import {
  getKnowledgeEditPath,
  getKnowledgePath,
  getReportPath,
  getTagPath,
  getUserpagePath,
} from "@src/utils/helper"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { getServerSession } from "next-auth/next"
import { useSession } from "next-auth/react"
import { Fragment, useEffect, useState } from "react"
import { AiFillTag, AiOutlineFlag } from "react-icons/ai"
import { BiChevronDown } from "react-icons/bi"
import { BsBookmark, BsFillBookmarkCheckFill, BsPencilFill } from "react-icons/bs"
import { GrHistory } from "react-icons/gr"
import { remark } from "remark"
import remarkBreaks from "remark-breaks"
import remarkGfm from "remark-gfm"
import remarkHtml from "remark-html"

dayjs.extend(relativeTime)
dayjs.locale("ja")

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

const Badge: React.FC<{ text: string }> = ({ text }) => {
  return (
    <span className="mr-2 mb-2 inline-block rounded-2xl bg-coursebg py-1 px-3 text-sm font-bold text-course md:mb-0">
      {text}
    </span>
  )
}

const Page: NextPageWithLayout<KnowledgeProps> = (props) => {
  const {
    id,
    title,
    _count,
    archive,
    bookmarks,
    content,
    contributors,
    course,
    creator,
    emoji,
    lastEditor,
    published,
    publishedAt,
    tags,
    updated_at,
  } = props

  const { data: session } = useSession()
  const router = useRouter()

  const [bookmarkCount, setBookmarkCount] = useState(Number(_count.bookmarks))
  const [bookmark, setBookmark] = useState(false)

  useEffect(() => {
    if (bookmarks.some((bookmark) => bookmark.user.id === session?.user.id)) {
      setBookmark(true)
    }
  }, [bookmarks, session?.user.id])

  async function addbookmarks() {
    const response = await fetch(`/api/knowledge/${id}/bookmarks`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: HttpMethod.POST,
    })

    if (response.ok) {
      bookmark ? setBookmark(false) : setBookmark(true)
      bookmark ? setBookmarkCount(bookmarkCount - 1) : setBookmarkCount(bookmarkCount + 1)
    }
  }

  useEffect(() => {
    if (!session && typeof session != "undefined") {
      router.push(`/`)
    }
  }, [session, router])

  useEffect(() => {
    const registerView = () =>
      fetch(`/api/knowledge/${id}/views`, {
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
      <MyPageSeo path={getKnowledgePath(id)} title={title ? title : "無題のナレッジ"} />
      {!published && (
        <Alert id={id}>💡 このナレッジは非公開です。有益な知識は積極的に公開しましょう</Alert>
      )}
      {published && !archive && dayjs(updated_at).diff(dayjs(), "month") < -6 && (
        <>
          <Alert id={id}>
            💡
            更新から半年以上が経過しています。情報が古い場合更新するか、不要な情報はアーカイブしましょう
          </Alert>
        </>
      )}
      {archive === true && (
        <div className="bg-gray-400">
          <ContentWrapper>
            <Alert id={id}>🗑 このナレッジはアーカイブされています</Alert>
          </ContentWrapper>
        </div>
      )}
      <div>
        <div className="mx-auto max-w-screen-lg px-4 md:px-8">
          <article className="py-16">
            <header className="mb-16">
              <div>
                <div className="flex justify-center text-8xl">
                  <span>{emoji}</span>
                </div>
                <h1 className="mt-10 text-center text-3xl font-bold lg:text-5xl lg:leading-normal">
                  <span>{title ? title : "無題のナレッジ"}</span>
                </h1>
                <div className="flex items-center justify-center pt-5">
                  <div className="flex items-center">
                    <span className="flex items-center">
                      {publishedAt ? (
                        <>
                          <Link href={getUserpagePath(lastEditor.handle)}>
                            <img
                              src={lastEditor.image}
                              height={45}
                              width={45}
                              className="mr-2 aspect-square rounded-full object-cover"
                              alt={lastEditor.displayname}
                            ></img>
                          </Link>
                          <time
                            dateTime={dayjs(publishedAt).toISOString()}
                            className="mr-3 text-sm text-gray-700  lg:text-lg"
                          >
                            {dayjs(publishedAt).isSame(dayjs(updated_at), "day")
                              ? `${dayjs(publishedAt).format("YYYY/MM/DD")}に公開 `
                              : `${dayjs(updated_at).fromNow()}に更新`}
                          </time>
                        </>
                      ) : (
                        <>
                          <Link href={getUserpagePath(creator.handle)}>
                            <img
                              src={creator.image}
                              height={45}
                              width={45}
                              className="mr-2 aspect-square rounded-full object-cover"
                              alt={creator.displayname}
                            ></img>
                          </Link>
                          <span className="mr-3 text-sm text-gray-700  lg:text-lg">非公開</span>
                        </>
                      )}
                    </span>
                    {course.map((post) => (
                      <>
                        <span className="mr-3 rounded-2xl bg-coursebg py-1 px-2 text-sm font-bold text-course lg:px-4 lg:text-lg">
                          {post.name}
                        </span>
                      </>
                    ))}
                  </div>
                </div>
              </div>
            </header>
            <div>
              {tags.map((tag) => (
                <>
                  <Link
                    href={getTagPath(tag.id)}
                    className="mb-2 mr-2 inline-flex items-center rounded-full border border-gray-100 px-2 py-1 text-gray-800 hover:bg-gray-100"
                  >
                    <div className="mr-2">
                      {tag.icon ? (
                        <img
                          className="block rounded-full"
                          width={20}
                          height={20}
                          src={tag.icon}
                          alt={tag.name}
                        />
                      ) : (
                        <AiFillTag size={20} color="#ee7800" className="block" />
                      )}
                    </div>
                    <div className="text-sm">{tag.name}</div>
                  </Link>
                </>
              ))}
              {content ? (
                <div
                  className="prose max-w-none break-words prose-h2:text-3xl prose-h3:text-2xl prose-p:text-lg prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline"
                  dangerouslySetInnerHTML={{
                    __html: content,
                  }}
                />
              ) : (
                <div className="text-center text-gray-600">
                  <p>
                    コンテンツがありません。
                    <Link href={getKnowledgeEditPath(id)}>ナレッジを編集</Link>してみませんか？
                  </p>
                </div>
              )}
              <div className="mt-10 flex items-center justify-between">
                <div className="inline-flex items-center">
                  <button
                    aria-label="ブックマーク"
                    onClick={async () => {
                      await addbookmarks()
                    }}
                    className="inline-flex items-center justify-center rounded-full border bg-gray-100 p-3"
                  >
                    {bookmark ? (
                      <BsFillBookmarkCheckFill className="text-primary" size={25} />
                    ) : (
                      <BsBookmark className="text-gray-400" size={25} />
                    )}
                  </button>
                  <span className="ml-2 text-gray-500">{bookmarkCount}</span>
                </div>
                <div className="flex items-center">
                  <Menu as="div" className="relative ml-auto  inline-block">
                    <Menu.Button>
                      <BiChevronDown className="mr-2 text-gray-400" size={35} aria-hidden="true" />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href={`/knowledge/${id}/diff`}
                                className={classNames(
                                  active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                  "flex items-center px-4 py-2 text-base",
                                )}
                              >
                                <GrHistory color="#93a5b1" className="mr-1" />
                                変更履歴を表示
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href={getReportPath()}
                                className={classNames(
                                  active ? "bg-gray-100 text-red-900" : "text-red-700",
                                  "flex border-t-2 border-gray-100 items-center text-base px-4 py-2",
                                )}
                              >
                                <AiOutlineFlag className="mr-1" />
                                違反を報告
                              </Link>
                            )}
                          </Menu.Item>{" "}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                  <Link
                    href={getKnowledgeEditPath(id)}
                    className="flex items-center rounded-full border p-3 font-medium text-gray-400 hover:text-gray-600"
                  >
                    <BsPencilFill className="mr-2" />
                    ナレッジを編集
                  </Link>
                </div>
              </div>
              <div className="my-5 border-t pt-5">
                <h2 className="mb-5 text-2xl font-bold">
                  ✨ このナレッジの貢献者 ({contributors.length}人)
                </h2>
                <p className="mb-4 text-base text-gray-600">
                  情報が古い場合や問題点を見つけた場合は
                  <Link href={getKnowledgeEditPath(id)}>編集</Link>
                  してみましょう。より良いナレッジを作成するための助けになります。
                </p>
                <div className="rounded-2xl border">
                  {contributors &&
                    contributors.map((contributor) => (
                      <div
                        key={contributor?.id}
                        className="flex flex-1 items-start p-4 [&:not(:first-child)]:border-t-2"
                      >
                        <Link href={getUserpagePath(contributor.user.handle)}>
                          <img
                            className="aspect-square rounded-full border object-cover"
                            src={contributor.user.image}
                            height={"65"}
                            width={"65"}
                            alt={contributor.user.displayname}
                          ></img>
                        </Link>
                        <div className="ml-5 flex-1">
                          <div>
                            <Link
                              href={getUserpagePath(contributor.user.handle)}
                              className="text-xl font-bold text-gray-800 line-clamp-1"
                            >
                              {contributor.user.displayname}
                              {contributor.user.id === session?.user?.id && " (あなた)"}
                            </Link>
                          </div>
                          <div className="mt-2">
                            <Badge
                              text={
                                contributor.user.role === "student"
                                  ? contributor.user.n_course === "commute"
                                    ? "通学コース" + "生徒"
                                    : contributor.user.n_course === "net"
                                    ? "ネットコース" + "生徒"
                                    : "生徒"
                                  : "メンター / TA"
                              }
                            />
                            {contributor.user.id === creator?.id && <Badge text="ページ作成者" />}
                            {contributor.user.contributor && <Badge text="コントリビューター" />}
                            {contributor.user.badges.map((badge) => (
                              <Badge text={badge.name} key={badge.id} />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </>
  )
}

Page.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.statusCode = 403
    return { props: { knowledge: [] } }
  }

  const data = await prisma.knowledge.findFirst({
    include: {
      _count: {
        select: {
          bookmarks: true,
        },
      },
      bookmarks: {
        select: {
          user: {
            select: {
              id: true,
            },
          },
        },
      },
      contributors: {
        include: {
          user: {
            select: {
              id: true,
              badges: {
                select: {
                  id: true,
                  name: true,
                  icon: true,
                },
              },
              contributor: true,
              displayname: true,
              handle: true,
              image: true,
              n_course: true,
              role: true,
            },
          },
        },
      },
      course: {
        select: {
          id: true,
          name: true,
        },
      },
      creator: {
        select: {
          id: true,
          displayname: true,
          handle: true,
          image: true,
        },
      },
      lastEditor: {
        select: {
          displayname: true,
          handle: true,
          image: true,
        },
      },
      tags: {
        select: {
          id: true,
          name: true,
          icon: true,
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

  if (data?.published === false && data.creator.id != session.user.id) {
    res.statusCode = 403
    return { props: { knowledge: [] } }
  }

  const knowledge = JSON.parse(JSON.stringify(data))

  const html = await remark()
    .use(remarkGfm)
    .use(remarkBreaks)
    .use(remarkHtml)
    .process(knowledge.content)

  knowledge.content = html.toString()

  return {
    props: knowledge,
  }
}
export default Page
