import { ContentWrapper } from "@src/components/ContentWrapper"
import Knowledge from "@src/components/Knowledge"
import { Layout } from "@src/components/Layout"
import { MyPageSeo } from "@src/components/MyPageSeo"
import { NotContent } from "@src/components/NotContent"
import prisma from "@src/lib/prisma"
import type { NextPageWithLayout } from "@src/pages/_app"
import { KnowledgeProps } from "@src/types"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { getServerSession } from "next-auth/next"
import { useSession } from "next-auth/react"
import React, { useEffect } from "react"

import { authOptions } from "../api/auth/[...nextauth]"

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    res.statusCode = 403
    return { props: { knowledge: [] } }
  }

  const data = await prisma.knowledge.findMany({
    include: {
      contributors: {
        select: {
          displayname: true,
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
    },
    orderBy: [
      {
        updatedAt: "desc",
      },
    ],
    take: 10,
    where: {
      archive: false,
      published: true,
    },
  })

  const knowledge = JSON.parse(JSON.stringify(data))

  return {
    props: { knowledge },
  }
}

type Props = {
  knowledge: KnowledgeProps[]
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
      <MyPageSeo
        path="/knowledge"
        title="ナレッジ"
        description="ナレッジはN中等部内の様々な情報を整理するためのコンテンツです。"
      />
      <section className="my-10">
        <ContentWrapper>
          <h1 className="mb-5 font-inter text-4xl font-bold">Knowledge</h1>
          <p className="mb-5 text-lg text-gray-500">
            ナレッジはN中等部内の様々な情報を整理するためのコンテンツです。
            <Link href="/about-knowledge">ナレッジについて詳しく →</Link>
          </p>
          {props.knowledge.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border">
              <div className="flex bg-gray-100 p-3 font-bold">
                <span className="mr-1 ">✨</span>
                <span>最近更新されたナレッジ</span>
              </div>
              <div className="border-t">
                {props.knowledge.map((post) => (
                  <Knowledge post={post} key={post.id} />
                ))}
              </div>
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

export default Page
