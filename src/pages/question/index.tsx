import { ContentWrapper } from "@src/components/ContentWrapper"
import { Layout } from "@src/components/Layout"
import { MyPageSeo } from "@src/components/MyPageSeo"
import { NotContent } from "@src/components/NotContent"
import { QuestionCard } from "@src/components/Question"
import prisma from "@src/lib/prisma"
import { NextPageWithLayout } from "@src/pages/_app"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { QuestionProps } from "@src/types/question"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { getServerSession } from "next-auth/next"
import { useSession } from "next-auth/react"
import { useEffect } from "react"

dayjs.extend(relativeTime)
dayjs.locale("ja")

type Props = {
  latest: QuestionProps[]
  open: QuestionProps[]
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
      <MyPageSeo path="/question" title="質問" />
      <section className="bg-gray-50 py-10">
        <ContentWrapper>
          <h3 className="mb-7 text-2xl font-bold md:text-3xl">🔥 注目されている質問</h3>
          <p className="mb-5 text-lg text-gray-500">
            現在アクティブの注目されている質問です。
          </p>
          {props.open.length > 0 ? (
            <div className="overflow-hidden rounded-lg border">
              {props.open.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </div>
          ) : (
            <NotContent />
          )}
        </ContentWrapper>
      </section>
      <section className="bg-white py-10">
        <ContentWrapper>
          <h3 className="mb-7 text-2xl font-bold md:text-3xl">🚀 最近作成された質問</h3>
          <p className="mb-5 text-lg text-gray-500">最近作成された質問です。</p>
          {props.latest.length > 0 ? (
            <div className="overflow-hidden rounded-lg border">
              {props.latest.map((question) => (
                <QuestionCard key={question.id} question={question} />
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
              質問してみましょう
            </h2>
            <Link
              href="/question/new"
              className="my-4 inline-block rounded-md bg-primary py-3 px-6 font-bold text-white hover:opacity-90"
            >
              + 質問する
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

  const open = await prisma.question.findMany({
    include: {
      _count: {
        select: {
          comments: true,
          votes: true,
        },
      },
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
    take: 5,
    where: {
      archive: false,
    },
  })

  const latest = await prisma.question.findMany({
    include: {
      _count: {
        select: {
          comments: true,
          votes: true,
          },
      },
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
      archive: false,
    },
  })

  return {
    props: { latest: JSON.parse(JSON.stringify(latest)), open: JSON.parse(JSON.stringify(open)) },
  }
}

Page.getLayout = (page) => <Layout>{page}</Layout>

export default Page
