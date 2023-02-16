import { ContentWrapper } from "@src/components/ContentWrapper"
import { Knowledge } from "@src/components/Knowledge"
import { Layout } from "@src/components/Layout"
import { MyPageSeo } from "@src/components/MyPageSeo"
import { NotContent } from "@src/components/NotContent"
import prisma from "@src/lib/prisma"
import type { NextPageWithLayout } from "@src/pages/_app"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { KnowledgeProps } from "@src/types"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { getServerSession } from "next-auth/next"
import { useSession } from "next-auth/react"
import React, { useEffect } from "react"

type Props = {
  old: KnowledgeProps[]
  views: KnowledgeProps[]
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
    return null
  }

  return (
    <>
      <MyPageSeo
        path="/knowledge"
        title="ナレッジ"
        description="ナレッジはN中等部内の様々な情報を整理するためのコンテンツです。"
      />
      <section className="bg-gray-50 py-10">
        <ContentWrapper>
          <h1 className="mb-7 text-2xl font-bold md:text-3xl">📈 アクセスの多い情報</h1>
          <p className="mb-5 text-lg text-gray-500">
            ナレッジはN中等部内の様々な情報を整理するためのコンテンツです。
            <Link href="/about-knowledge">ナレッジについて詳しく →</Link>
          </p>
          {props.views.length > 0 ? (
            <div className="overflow-hidden rounded-lg border">
              {props.views.map((knowledge) => (
                <Knowledge knowledge={knowledge} key={knowledge.id} />
              ))}
            </div>
          ) : (
            <NotContent />
          )}
        </ContentWrapper>
      </section>
      <section className="bg-white py-10">
        <ContentWrapper>
          <h3 className="mb-7 text-2xl font-bold md:text-3xl">📉 更新が必要な情報</h3>
          <p className="mb-5 text-lg text-gray-500">
            更新が行われていない順のナレッジです。古い情報などがあれば編集してみましょう。
          </p>
          {props.old.length > 0 ? (
            <div className="overflow-hidden rounded-lg border">
              {props.old.map((knowledge) => (
                <Knowledge knowledge={knowledge} key={knowledge.id} />
              ))}
            </div>
          ) : (
            <NotContent />
          )}
        </ContentWrapper>
      </section>
    </>
  )
}

Page.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    res.statusCode = 403
    return { props: { knowledge: [] } }
  }

  const views = await prisma.knowledge.findMany({
    include: {
      contributors: {
        include: {
          user: {
            select: {
              displayname: true,
              handle: true,
              image: true,
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
    },
    orderBy: [
      {
        views: "desc",
      },
    ],
    take: 10,
    where: {
      archive: false,
      published: true,
    },
  })

  const old = await prisma.knowledge.findMany({
    include: {
      contributors: {
        include: {
          user: {
            select: {
              displayname: true,
              handle: true,
              image: true,
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
    },
    orderBy: [
      {
        updated_at: "asc",
      },
    ],
    take: 10,
    where: {
      archive: false,
      published: true,
    },
  })

  return {
    props: { old: JSON.parse(JSON.stringify(old)), views: JSON.parse(JSON.stringify(views)) },
  }
}

export default Page
