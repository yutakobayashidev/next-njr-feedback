import "dayjs/locale/ja"

import Alert from "@src/components/Alert"
import { KnowledgePage } from "@src/components/KnowledgePage"
import { Layout } from "@src/components/Layout"
import { MyPageSeo } from "@src/components/MyPageSeo"
import prisma from "@src/lib/prisma"
import { NextPageWithLayout } from "@src/pages/_app"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { Diff, KnowledgeProps } from "@src/types"
import { getKnowledgePath } from "@src/utils/helper"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { remark } from "remark"
import remarkBreaks from "remark-breaks"
import remarkGfm from "remark-gfm"
import remarkHtml from "remark-html"

dayjs.extend(relativeTime)
dayjs.locale("ja")

type Props = {
  diff: Diff
  knowledge: KnowledgeProps
}

const Page: NextPageWithLayout<Props> = (props) => {
  const { id: diffid, title, createdAt } = props.diff
  const { id } = props.knowledge

  return (
    <Layout>
      <>
        <MyPageSeo
          path={`/knowledge/${id}/diff/${diffid}`}
          title={title ? title : "無題のナレッジ"}
        />
        <Alert>
          💡 {dayjs(createdAt).fromNow()}に作成された履歴を表示しています
          {id && (
            <span className="ml-2">
              <Link
                className="my-3 rounded-md border-2 px-3 text-white"
                href={getKnowledgePath(id)}
              >
                最新のページへ移動
              </Link>
            </span>
          )}
        </Alert>
        <div className="mx-auto max-w-screen-lg px-4 md:px-8">
          <article className="py-16">
            <KnowledgePage knowledge={props.knowledge} diff={props.diff} />
          </article>
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

  const knowledgedata = await prisma.knowledge.findFirst({
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
              displayname: true,
              handle: true,
              image: true,
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
    },
    where: {
      id: String(params?.id),
    },
  })

  const data = await prisma.diff.findFirst({
    include: {
      author: {
        select: {
          displayname: true,
          handle: true,
          image: true,
        },
      },
      course: true,
    },
    where: {
      id: Number(params?.diff),
    },
  })

  if (!data) {
    return {
      notFound: true,
    }
  }

  if (knowledgedata?.published === false && knowledgedata.creatorId != session.user.id) {
    res.statusCode = 403
    return { props: { knowledge: [] } }
  }

  const diff = JSON.parse(JSON.stringify(data))
  const knowledge = JSON.parse(JSON.stringify(knowledgedata))

  const html = await remark().use(remarkGfm).use(remarkBreaks).use(remarkHtml).process(diff.content)
  diff.content = html.toString()

  return {
    props: { diff, knowledge },
  }
}

Page.getLayout = (page) => <Layout>{page}</Layout>

export default Page
