import "dayjs/locale/ja"

import { ContentWrapper } from "@src/components/ContentWrapper"
import Knowledge from "@src/components/Knowledge"
import { MyPageSeo } from "@src/components/MyPageSeo"
import prisma from "@src/lib/prisma"
import { KnowledgeProps } from "@src/types"
import { GetServerSideProps, NextPage } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { getSession, useSession } from "next-auth/react"
import React, { useEffect } from "react"

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req })
  if (!session) {
    res.statusCode = 403
    return { props: { knowledge: [] } }
  }

  const data = await prisma.knowledge.findMany({
    include: {
      contributors: {
        select: {
          name: true,
          image: true,
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

const Page: NextPage<Props> = (props) => {
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
            <Link href="/guideline">ナレッジについて詳しく →</Link>
          </p>
          {props.knowledge.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border">
              <div className="flex bg-gray-100 p-3 font-bold">
                <span className="mr-1 ">✨</span>
                <span>最近更新されたナレッジ</span>
              </div>
              <div className="border-t">
                {props.knowledge.map((post, index) => (
                  <Knowledge post={post} key={post.id} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xl font-bold">
                ナレッジが存在しません。最初の作成者になってみませんか？
              </p>
              <p className="mt-10">
                <img
                  className="mx-auto"
                  width="300"
                  height="243"
                  src="/not-content.svg"
                  alt={"My App"}
                />
              </p>
            </div>
          )}
        </ContentWrapper>
      </section>
    </>
  )
}

export default Page
