import "dayjs/locale/ja"

import { ContentWrapper } from "@src/components/ContentWrapper"
import { Layout } from "@src/components/Layout"
import { MyPageSeo } from "@src/components/MyPageSeo"
import { NotContent } from "@src/components/NotContent"
import prisma from "@src/lib/prisma"
import { NextPageWithLayout } from "@src/pages/_app"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { DiscussionProps } from "@src/types"
import { getDiscussionPath, getUserpagePath } from "@src/utils/helper"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { getServerSession } from "next-auth/next"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { TfiReload } from "react-icons/tfi"

dayjs.extend(relativeTime)
dayjs.locale("ja")

type Props = {
  latest: DiscussionProps[]
  open: DiscussionProps[]
}

const DiscussionCard: React.FC<{ discussion: DiscussionProps }> = ({ discussion }) => {
  return (
    <div className="flex items-center bg-white p-3 [&:not(:first-child)]:border-t">
      <div className="flex flex-1 items-start">
        <Link className="mr-4" href={getUserpagePath(discussion.user.handle)}>
          <img
            className="rounded-full border"
            src={discussion.user.image}
            height={60}
            width={60}
            alt={discussion.user.displayname}
          ></img>
        </Link>
        <div className="flex-1">
          <Link
            className="block text-xl font-bold text-gray-800"
            href={getDiscussionPath(discussion.id)}
          >
            {discussion.title}
          </Link>
          <div className="mt-2 flex items-center">
            <Link
              href={getUserpagePath(discussion.user.handle)}
              className="mr-2 text-gray-800 hover:underline"
            >
              {discussion.user.displayname}
            </Link>
            <span className="mr-2 flex items-center text-gray-500">
              <TfiReload className="mr-1" />
              {dayjs(discussion.updatedAt).fromNow()}
            </span>
            <span className="flex items-center text-gray-500">{discussion.views}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const Page: NextPageWithLayout<Props> = (props) => {
  const { data: session } = useSession()

  const router = useRouter()

  useEffect(() => {
    if (!session && typeof session != "undefined") {
      router.push(`/`)
    }
  }, [session, router])

  if (!session) {
    return <></>
  }

  return (
    <>
      <MyPageSeo path="/discussion" title="ディスカッション" />
      <section className="bg-gray-50 py-10">
        <ContentWrapper>
          <h3 className="mb-7 text-3xl font-bold">🔥 注目のある議論</h3>
          <p className="mb-5 text-lg text-gray-500">
            現在アクティブの注目されているディスカッションです。注目度はコメント数、ページビューなどによって決定されています。
          </p>
          {props.open.length > 0 ? (
            <div className="overflow-hidden rounded-lg border">
              {props.open.map((discussion) => (
                <DiscussionCard key={discussion.id} discussion={discussion} />
              ))}
            </div>
          ) : (
            <NotContent />
          )}
        </ContentWrapper>
      </section>
      <section className="bg-white py-10">
        <ContentWrapper>
          <h3 className="mb-7 text-3xl font-bold">🚀 最近作成された議論</h3>
          <p className="mb-5 text-lg text-gray-500">最近作成されたディスカッションです。</p>
          {props.latest.length > 0 ? (
            <div className="overflow-hidden rounded-lg border">
              {props.latest.map((discussion) => (
                <DiscussionCard key={discussion.id} discussion={discussion} />
              ))}
            </div>
          ) : (
            <NotContent />
          )}
        </ContentWrapper>
      </section>
      <section className="py-10">
        <ContentWrapper>
          <div className="text-center">
            <h2 className="text-xl font-bold">
              見つかりませんでしたか？
              <br className="block md:hidden" />
              作成しましょう
            </h2>
            <Link
              href="/discussion/new"
              className="my-4 inline-block rounded-md bg-primary py-3 px-6 font-bold text-white hover:opacity-90"
            >
              + 議論を作成
            </Link>
          </div>
        </ContentWrapper>
      </section>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    res.statusCode = 403
    return { props: { archive: [], open: [] } }
  }

  const opendata = await prisma.discussion.findMany({
    include: {
      user: {
        select: {
          displayname: true,
          handle: true,
          image: true,
        },
      },
    },
    orderBy: [
      {
        views: "desc",
      },
    ],
    take: 10,
    where: {
      status: false,
    },
  })

  const open = JSON.parse(JSON.stringify(opendata))

  const archivedata = await prisma.discussion.findMany({
    include: {
      user: {
        select: {
          displayname: true,
          handle: true,
          image: true,
        },
      },
    },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
    take: 10,
    where: {
      status: false,
    },
  })

  const latest = JSON.parse(JSON.stringify(archivedata))

  return {
    props: { latest, open },
  }
}

Page.getLayout = (page) => <Layout>{page}</Layout>

export default Page
