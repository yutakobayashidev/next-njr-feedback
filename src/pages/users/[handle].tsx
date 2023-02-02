import { Knowledge } from "@src/components/Knowledge"
import { Layout } from "@src/components/Layout"
import { MyPageSeo } from "@src/components/MyPageSeo"
import { NotContent } from "@src/components/NotContent"
import prisma from "@src/lib/prisma"
import { NextPageWithLayout } from "@src/pages/_app"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { KnowledgeProps } from "@src/types"
import { getUserpagePath } from "@src/utils/helper"
import dayjs from "dayjs"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { getServerSession } from "next-auth/next"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { FaCode } from "react-icons/fa"
import { MdDateRange } from "react-icons/md"

interface TabProps {
  title: string
  href: string
  isSelected: boolean
}

const Tab = ({ title, href, isSelected }: TabProps) => (
  <Link
    href={href}
    className={`mr-5 border-gray-700 py-2 font-inter text-base font-bold ${
      isSelected ? "border-b-2 text-gray-700" : "text-gray-400"
    }`}
  >
    {title}
  </Link>
)

export type UserProps = {
  _count: {
    knowledge: number
  }
  bio: string
  createdAt: string
  displayname: string
  email: string
  handle: string
  image: string
  knowledge: KnowledgeProps[]
}

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.statusCode = 403
    return { props: { knowledge: [] } }
  }

  const data = await prisma.user.findUnique({
    include: {
      knowledge: {
        orderBy: {
          publishedAt: "desc",
        },
        select: {
          id: true,
          title: true,
          content: true,
          contributors: true,
          course: true,
          emoji: true,
          published: true,
          publishedAt: true,
          updatedAt: true,
        },
        where: {
          archive: false,
          published: true,
        },
      },
    },
    where: {
      handle: String(params?.handle),
    },
  })

  if (!data) {
    return {
      notFound: true,
    }
  }

  const profile = JSON.parse(JSON.stringify(data))

  return {
    props: profile,
  }
}

const Page: NextPageWithLayout<UserProps> = (props) => {
  const { bio, createdAt, displayname, email, handle, image, knowledge } = props

  const { query } = useRouter()
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (!session && typeof session != "undefined") {
      router.push(`/`)
    }
  }, [session, router])

  return (
    <>
      <MyPageSeo path={getUserpagePath(handle)} title={displayname} />
      <header>
        <div className="mx-auto max-w-screen-lg px-4 md:px-8">
          <div className="items-center justify-between py-10 md:flex">
            <div>
              {handle && image && (
                <img
                  className="rounded-full"
                  width="120"
                  height="120"
                  alt={displayname}
                  src={image}
                ></img>
              )}
            </div>
            <div className="mt-7 ml-0 flex-1 md:mt-0 md:ml-7">
              <div className="flex items-center justify-center">
                <h1 className="flex-1 text-2xl font-bold">{displayname}</h1>
                {session && session.user.handle === handle && (
                  <div className="text-right">
                    <Link
                      href="/settings"
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
                    自己紹介がありません。<Link href="/settings">アカウント設定</Link>
                    で追加してみましょう。
                  </p>
                ) : null}
                <div className="mt-2 flex items-center">
                  <span className="mr-1 flex items-center font-medium">
                    <MdDateRange size={20} className="mr-1 text-gray-500" />
                    <span>{dayjs(createdAt).format("YYYY年M月")}に参加</span>
                  </span>
                  {email && (
                    <span className="mr-2 flex items-center font-medium">
                      <img
                        src="/n-school.png"
                        alt="N中等部"
                        width="20"
                        height="20"
                        className="mr-1"
                      ></img>
                      <span>{email.endsWith("@n-jr.jp") ? "生徒" : "メンター / TA"}</span>
                    </span>
                  )}
                  <span className="mr-1 flex items-center font-medium">
                    <FaCode size={20} color="#61bd8d" className="mr-1" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-screen-lg items-center px-4 md:px-8">
        <Tab href={`/users/${handle}`} title={`Knowledge`} isSelected={!query.tab} />
      </div>
      <div className="bg-gray-100 pt-16 pb-20">
        {props.knowledge.length > 0 ? (
          <div className="mx-auto max-w-screen-lg px-4 md:px-8">
            <div className="overflow-hidden rounded-2xl border">
              {knowledge.map((post) => (
                <Knowledge knowledge={post} key={post.id} />
              ))}
            </div>
          </div>
        ) : (
          <NotContent />
        )}
      </div>
    </>
  )
}

Page.getLayout = (page) => <Layout>{page}</Layout>

export default Page
