import { Knowledge } from "@src/components/Knowledge"
import { Layout } from "@src/components/Layout"
import { UserLoader } from "@src/components/Loader"
import { MyPageSeo } from "@src/components/MyPageSeo"
import { NotContent } from "@src/components/NotContent"
import Tab from "@src/components/Tab"
import useRequireAuth from "@src/hooks/useRequireAuth"
import { fetcher } from "@src/lib/fetcher"
import prisma from "@src/lib/prisma"
import { NextPageWithLayout } from "@src/pages/_app"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { KnowledgeProps, Tag, UserProps } from "@src/types"
import { getTagPath, getUserpagePath } from "@src/utils/helper"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { getServerSession } from "next-auth"
import { AiFillTag } from "react-icons/ai"
import { FiArrowUpRight } from "react-icons/fi"
import useSWR from "swr"

const Page: NextPageWithLayout<Tag> = (props) => {
  const { id, name, _count, description, icon, official } = props

  const router = useRouter()
  const session = useRequireAuth()

  const { data: knowledge, isValidating: isKnowledgeValidating } = useSWR<Array<KnowledgeProps>>(
    session && (!router.query.tab || router.query.tab !== "users") && `/api/knowledge?tag=${id}`,
    fetcher,
  )

  const { data: users, isValidating: isUserValidating } = useSWR<Array<UserProps>>(
    session && router.query.tab == "users" && `/api/users?knowledge=${id}`,
    fetcher,
  )

  const title = router.query.tab === "users" ? "の試験に合格したユーザー" : "のナレッジ一覧"

  return (
    <Layout>
      <>
        <MyPageSeo path={getTagPath(id)} title={name + title} />
        <header>
          <div className="mx-auto max-w-screen-lg px-4 md:px-8">
            <div className="items-center justify-between py-10 md:flex">
              {icon ? (
                <div>
                  <img
                    width={100}
                    height={100}
                    className="block rounded-full border"
                    src={icon}
                    alt={name}
                  />
                </div>
              ) : (
                <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full border">
                  <AiFillTag size={50} color="#ee7800" className="mr-1" />
                </div>
              )}
              <div className="mt-7 ml-0 flex-1 md:mt-0 md:ml-7">
                <div className="mb-2 flex items-center justify-center">
                  <h1 className="flex-1 text-2xl font-bold md:text-3xl">{name}</h1>
                  <Link
                    href={`/tags/${id}/edit`}
                    className="rounded-md border bg-white px-2 py-1 text-right text-gray-800 shadow-md"
                  >
                    表示を更新
                  </Link>
                </div>
                {description ? <p className="text-base">{description}</p> : null}
              </div>
            </div>
          </div>
        </header>
        <div className="mx-auto flex max-w-screen-lg items-center px-4 md:px-8">
          <Tab
            href={getTagPath(id)}
            title={"Knowledge " + _count.knowledge}
            isSelected={!router.query.tab || router.query.tab !== "users"}
          />
          <Tab
            href={`/tags/${id}?tab=users`}
            title={"Users " + _count.users}
            isSelected={router.query.tab == "users"}
          />
          {official && (
            <a
              target="_blank"
              rel="noopener noreferrer nofollow"
              href={official}
              className="mr-5 flex items-center border-b-2 border-white py-2 text-sm font-bold text-gray-400 transition duration-100 hover:text-gray-600 md:text-base"
            >
              公式サイト
              <FiArrowUpRight className="ml-1" />
            </a>
          )}
        </div>
        <div className="min-h-screen bg-gray-100 pt-16 pb-20">
          <div className="mx-auto max-w-screen-lg px-4 md:px-8">
            {isKnowledgeValidating ? (
              <UserLoader />
            ) : (
              <>
                {(!router.query.tab || router.query.tab !== "users") && (
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
                        <NotContent />
                      </>
                    )}
                  </>
                )}
              </>
            )}
            {isUserValidating ? (
              <UserLoader />
            ) : (
              <>
                {router.query.tab == "users" && (
                  <>
                    {users && users.length > 0 ? (
                      <>
                        <div className="overflow-hidden rounded-lg border">
                          {users.map((user) => (
                            <Link
                              key={user.id}
                              className="flex bg-white p-3 [&:not(:first-child)]:border-t"
                              href={getUserpagePath(user.handle)}
                            >
                              <div className="flex text-gray-800">
                                <img
                                  className="mr-4 aspect-square rounded-full border object-cover"
                                  height={60}
                                  width={60}
                                  src={user.image}
                                  alt={user.displayname}
                                ></img>
                                <div>
                                  <div className="text-lg font-bold">{user.displayname}</div>
                                  <div className="text-sm text-gray-400">@{user.handle}</div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <NotContent message="ユーザーが存在しません" />
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  const session = await getServerSession(req, res, authOptions)

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }

  const tags = await prisma.tag.findUnique({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          knowledge: {
            where: {
              published: true,
            },
          },
          users: true,
        },
      },
      description: true,
      icon: true,
      official: true,
    },
    where: {
      id: String(params?.id),
    },
  })

  if (!tags) {
    return {
      notFound: true,
    }
  }

  return {
    props: tags,
  }
}

export default Page
