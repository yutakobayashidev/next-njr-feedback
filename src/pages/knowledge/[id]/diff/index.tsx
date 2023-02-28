import "dayjs/locale/ja"

import { ContentWrapper } from "@src/components/ContentWrapper"
import { Layout } from "@src/components/Layout"
import { MyPageSeo } from "@src/components/MyPageSeo"
import prisma from "@src/lib/prisma"
import { NextPageWithLayout } from "@src/pages/_app"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { KnowledgeProps } from "@src/types"
import { getKnowledgeEditPath, getUserpagePath } from "@src/utils/helper"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { GrHistory } from "react-icons/gr"
import { IoTimeOutline } from "react-icons/io5"

dayjs.extend(relativeTime)
dayjs.locale("ja")

const Page: NextPageWithLayout<KnowledgeProps> = (props) => {
  const { id, title, diff } = props

  return (
    <>
      <MyPageSeo
        path={`/knowledge/${id}/diff`}
        title={title ? title + "の履歴" : "無題のナレッジ" + "の履歴"}
      />
      <section className="py-12">
        <ContentWrapper>
          <h1 className="mb-7 flex items-center text-3xl font-bold">
            <GrHistory color="#93a5b1" className="mr-4" />
            {title ? "「" + title + "」" + "の変更履歴" : "「無題のナレッジ」" + "の変更履歴"}
          </h1>
          <p className="my-4 text-lg">
            {diff.length}
            件の変更履歴が見つかりました。
            <Link href={getKnowledgeEditPath(id)}>ナレッジを編集</Link>
            してより良いナレッジベースを構築しましょう。
          </p>
          <div className="relative ml-5 min-h-screen border-l-2 py-0.5">
            {diff.map((history) => (
              <div className="relative mt-10 block pl-10" key={history.id}>
                <div className="absolute -left-6 -top-1.5 flex items-center justify-center">
                  <Link href={getUserpagePath(history.author.handle)}>
                    <img
                      src={history.author.image}
                      width={45}
                      height={45}
                      className="aspect-square rounded-full border object-cover"
                      alt={history.author.image}
                    ></img>
                  </Link>
                </div>
                <div>
                  <span>
                    <Link
                      href={getUserpagePath(history.author.handle)}
                      className="font-bold text-gray-800 hover:underline"
                    >
                      {history.author.displayname}
                    </Link>
                  </span>
                  <span className="text-gray-500">
                    さんが{dayjs(history.createdAt).fromNow()}に編集
                  </span>
                </div>
                <div className="mt-5 flex items-center justify-between rounded-lg border bg-white p-3">
                  <div className="flex flex-1 items-start">
                    <Link
                      href={`/knowledge/${id}/diff/${history.id}`}
                      className="mr-4 flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 text-4xl"
                    >
                      <span>{history.emoji}</span>
                    </Link>
                    <div className="w-[calc(100%-100px)]">
                      <Link
                        href={`/knowledge/${id}/diff/${history.id}`}
                        className="text-xl font-bold text-gray-800 line-clamp-2"
                      >
                        {history.title ? history.title : "無題のナレッジ"}
                      </Link>
                      <div className="mt-2 flex items-center text-xs md:text-base">
                        {history?.course.map((course) => (
                          <span
                            key={course.id}
                            className="mr-2 rounded-2xl bg-coursebg px-3 py-0.5 font-bold text-course"
                          >
                            {course.name}
                          </span>
                        ))}
                        <span className="flex items-center text-gray-500">
                          <IoTimeOutline className="mr-1" />
                          {dayjs(history.createdAt).fromNow()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ContentWrapper>
      </section>
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

  const data = await prisma.knowledge.findFirst({
    include: {
      diff: {
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
        select: {
          id: true,
          title: true,
          author: true,
          course: true,
          createdAt: true,
          emoji: true,
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

  if (data?.published === false && data.creatorId != session.user.id) {
    res.statusCode = 403
    return { props: { knowledge: [] } }
  }

  const knowledge = JSON.parse(JSON.stringify(data))

  return { props: knowledge }
}

export default Page
