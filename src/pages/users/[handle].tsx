import "dayjs/locale/ja"

import { DiscussionCard } from "@src/components/Discussion"
import { Knowledge } from "@src/components/Knowledge"
import { Layout } from "@src/components/Layout"
import { UserLoader } from "@src/components/Loader"
import { MyPageSeo } from "@src/components/MyPageSeo"
import { NotContent } from "@src/components/NotContent"
import Tab from "@src/components/Tab"
import { Tooltip } from "@src/components/Tooltip"
import fetcher from "@src/lib/fetcher"
import prisma from "@src/lib/prisma"
import { NextPageWithLayout } from "@src/pages/_app"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { DiscussionProps, KnowledgeProps, UserProps } from "@src/types"
import { CommentProps } from "@src/types/comment"
import { getDiscussionPath, getTagPath, getUserpagePath } from "@src/utils/helper"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { getServerSession } from "next-auth/next"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { AiFillTag } from "react-icons/ai"
import { FaCode } from "react-icons/fa"
import { MdDateRange } from "react-icons/md"
import useSWR from "swr"

dayjs.extend(relativeTime)
dayjs.locale("ja")

export interface Badge {
  id: string
  name: string
  icon?: string
}

const Page: NextPageWithLayout<UserProps> = (props) => {
  const {
    _count,
    badges,
    bio,
    contributor,
    createdAt,
    displayname,
    handle,
    image,
    leave,
    n_course,
    role,
  } = props

  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (!session && typeof session != "undefined") {
      router.push(`/`)
    }
  }, [session, router])

  const { data: discussions, isValidating: isDiscussionValidating } = useSWR<
    Array<DiscussionProps>
  >(
    session &&
      (!router.query.tab || (router.query.tab !== "knowledge" && router.query.tab !== "comment")) &&
      `/api/discussion?handle=${handle}`,
    fetcher,
  )

  const { data: knowledge, isValidating: isKnowledgeValidating } = useSWR<Array<KnowledgeProps>>(
    session && router.query.tab == "knowledge" && `/api/knowledge?handle=${handle}`,
    fetcher,
  )

  const { data: comments, isValidating: isCommentsValidating } = useSWR<Array<CommentProps>>(
    session && router.query.tab == "comment" && `/api/comments?handle=${handle}`,
    fetcher,
  )

  const title =
    router.query.tab === "knowledge"
      ? "ナレッジ"
      : router.query.tab === "comment"
      ? "コメント"
      : "ディスカッション"

  return (
    <>
      <MyPageSeo path={getUserpagePath(handle)} title={displayname + "さんの" + title} />
      <header>
        <div className="mx-auto max-w-screen-lg px-4 md:px-8">
          <div className="items-center justify-between py-10 md:flex">
            <div>
              {handle && image && (
                <img
                  className="aspect-square rounded-full object-cover"
                  width="120"
                  height="120"
                  alt={displayname}
                  src={image}
                ></img>
              )}
            </div>
            <div className="mt-7 ml-0 flex-1 md:mt-0 md:ml-7">
              <div className="flex items-center justify-center">
                <h1 className="flex-1 text-xl font-bold">{displayname}</h1>
                {session && session.user.handle === handle && (
                  <div className="text-right">
                    <Link
                      href="/dashboard/settings"
                      className="inline-flex items-center rounded-full border py-2 px-4 text-base font-bold text-gray-800 hover:bg-gray-200"
                    >
                      プロフィールを編集
                    </Link>
                  </div>
                )}
              </div>
              <div className="my-2">
                {bio ? (
                  <p>{bio}</p>
                ) : session && session.user.handle === handle ? (
                  <p className="break-words">
                    自己紹介がありません。<Link href="/dashboard/settings">アカウント設定</Link>
                    で追加してみましょう。
                  </p>
                ) : null}
                <div className="mt-2 flex flex-wrap items-center">
                  <span className="mr-1 mb-2 flex items-center font-medium">
                    <MdDateRange size={20} className="mr-1 text-gray-500" />
                    <span>{dayjs(createdAt).format("YYYY年M月")}に参加</span>
                  </span>
                  {role && (
                    <span className="mr-2 mb-2 flex items-center font-medium">
                      <img
                        src="/n-school.png"
                        alt="N中等部"
                        width="20"
                        height="20"
                        className="mr-1"
                      ></img>
                      <span>
                        {role === "student"
                          ? leave
                            ? "卒業・退会済み"
                            : n_course === "commute"
                            ? "通学生徒"
                            : n_course === "net"
                            ? "ネット" + "生徒"
                            : "生徒"
                          : leave
                          ? "退職済み"
                          : "メンター / TA"}
                      </span>
                    </span>
                  )}
                  {contributor && (
                    <>
                      <span className="mr-1 mb-2">
                        <Tooltip text="コントリビューター">
                          <FaCode size={20} color="#61bd8d" className="mr-1" />
                        </Tooltip>
                      </span>
                    </>
                  )}
                  {badges.map((badge) => (
                    <Link href={getTagPath(badge.id)} key={badge.id} className="mr-1 mb-1">
                      <Tooltip text={badge.name}>
                        {badge.icon ? (
                          <img
                            width="20"
                            className="mr-1"
                            height="20"
                            src={badge.icon}
                            alt={badge.name}
                          ></img>
                        ) : (
                          <AiFillTag size={20} color="#ee7800" className="mr-1" />
                        )}
                      </Tooltip>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-screen-lg items-center px-4 md:px-8">
        <Tab
          href={`/users/${handle}/`}
          title={"Discussion " + _count.discussion}
          isSelected={
            !router.query.tab ||
            (router.query.tab !== "knowledge" && router.query.tab !== "comment")
          }
        />
        <Tab
          href={`/users/${handle}?tab=knowledge`}
          title={"Knowledge " + _count.knowledge}
          isSelected={router.query.tab == "knowledge"}
        />
        <Tab
          href={`/users/${handle}/?tab=comment`}
          title="Comment"
          isSelected={router.query.tab == "comment"}
        />
      </div>
      <div className="min-h-screen bg-gray-100 pt-16 pb-20">
        <div className="mx-auto max-w-screen-lg px-4 md:px-8">
          {isDiscussionValidating ? (
            <UserLoader />
          ) : (
            <>
              {(!router.query.tab ||
                (router.query.tab !== "knowledge" && router.query.tab !== "comment")) && (
                <>
                  {discussions && discussions.length > 0 ? (
                    <>
                      <div className="overflow-hidden rounded-lg border">
                        {discussions?.map((discussion) => (
                          <DiscussionCard key={discussion.id} discussion={discussion} />
                        ))}
                      </div>
                    </>
                  ) : (
                    <NotContent message="アクティビティが存在しません" />
                  )}
                </>
              )}
            </>
          )}
          {isKnowledgeValidating ? (
            <UserLoader />
          ) : (
            <>
              {router.query.tab == "knowledge" && (
                <>
                  {knowledge && knowledge.length > 0 ? (
                    <>
                      <div className="overflow-hidden rounded-lg border">
                        {knowledge.map((post) => (
                          <Knowledge knowledge={post} key={post.id} />
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <NotContent message="アクティビティが存在しません" />
                    </>
                  )}
                </>
              )}
            </>
          )}
          {isCommentsValidating ? (
            <UserLoader />
          ) : (
            <>
              {router.query.tab == "comment" && (
                <>
                  {comments && comments.length > 0 ? (
                    <>
                      <div className="overflow-hidden rounded-lg border">
                        {comments.map((post) => (
                          <div
                            key={post.id}
                            className="bg-white p-3 [&:not(:first-child)]:border-t"
                          >
                            <div className="flex items-center">
                              <Link href={getUserpagePath(post.user.handle)}>
                                <img
                                  width="35"
                                  height="35"
                                  src={post.user.image}
                                  className="mr-2 aspect-square rounded-full object-cover"
                                  alt={post.user.displayname}
                                ></img>
                              </Link>
                              <div>
                                <Link
                                  href={getUserpagePath(post.user.handle)}
                                  className="text-sm font-bold text-gray-800"
                                >
                                  {post.user.displayname}
                                </Link>
                                <div className="text-xs text-gray-500">
                                  <time dateTime={dayjs(post.createdAt).toISOString()}>
                                    {dayjs(post.createdAt).fromNow()}に
                                  </time>
                                  <Link
                                    href={getDiscussionPath(post.discussion.id)}
                                    className="font-bold text-gray-500 hover:underline"
                                  >
                                    {post.discussion.title.length > 20
                                      ? post.discussion.title.slice(0, 20) + "..."
                                      : post.discussion.title}
                                  </Link>
                                  <span>で投稿</span>
                                </div>
                              </div>
                            </div>
                            <Link
                              href={"/discussion/" + post.discussion.id + "#comment-" + post.id}
                              className="mt-4 block text-gray-800 hover:underline"
                            >
                              {post.content}
                            </Link>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <NotContent message="アクティビティが存在しません" />
                    </>
                  )}
                </>
              )}
            </>
          )}
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
    return { props: { profile: [] } }
  }

  const profile = await prisma.user.findUnique({
    select: {
      _count: {
        select: {
          discussion: true,
          knowledge: { where: { knowledge: { published: true } } },
        },
      },
      badges: {
        select: {
          id: true,
          name: true,
          icon: true,
        },
      },
      bio: true,
      contributor: true,
      createdAt: true,
      displayname: true,
      handle: true,
      image: true,
      leave: true,
      n_course: true,
      role: true,
    },
    where: {
      handle: String(params?.handle),
    },
  })

  if (!profile) {
    return {
      notFound: true,
    }
  }

  return {
    props: JSON.parse(JSON.stringify(profile)),
  }
}

export default Page
