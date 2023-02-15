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
import { useRouter } from "next/router"
import { getServerSession } from "next-auth"
import { useSession } from "next-auth/react"
import { useEffect } from "react"

dayjs.extend(relativeTime)
dayjs.locale("ja")

type Props = {
  diff: Diff
  knowledge: KnowledgeProps
}

const Page: NextPageWithLayout<Props> = (props) => {
  const { id: diffid, title, createdAt } = props.diff
  const { id } = props.knowledge

  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session && typeof session != "undefined") {
      router.push(`/`)
    }
  }, [session, router])

  return (
    <>
      <MyPageSeo
        path={`/knowledge/${id}/diff/${diffid}`}
        title={title ? title : "無題のナレッジ"}
      />
      <Alert>
        💡 {dayjs(createdAt).fromNow()}に作成された履歴を表示しています
        {id && (
          <span className="ml-2">
            <Link className="my-3 rounded-md border-2 px-3 text-white" href={getKnowledgePath(id)}>
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
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.statusCode = 403
    return { props: { knowledge: [] } }
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
        select: {
          id: true,
          displayname: true,
          email: true,
          handle: true,
          image: true,
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

  return {
    props: { diff, knowledge },
  }
}

Page.getLayout = (page) => <Layout>{page}</Layout>

export default Page
