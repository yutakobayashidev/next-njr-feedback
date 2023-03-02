import Google from "@public/google.svg"
import { config } from "@site.config"
import { ContentWrapper } from "@src/components/ContentWrapper"
import { DiscussionCard } from "@src/components/Discussion"
import { Knowledge } from "@src/components/Knowledge"
import { Layout } from "@src/components/Layout"
import { MyPageSeo } from "@src/components/MyPageSeo"
import { NotContent } from "@src/components/NotContent"
import prisma from "@src/lib/prisma"
import type { NextPageWithLayout } from "@src/pages/_app"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { DiscussionProps, KnowledgeProps, Tag } from "@src/types"
import { getTagPath } from "@src/utils/helper"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { signIn, useSession } from "next-auth/react"
import { AiFillTag } from "react-icons/ai"

type Props = {
  discussion: DiscussionProps[]
  knowledge: KnowledgeProps[]
  tag: Tag[]
}

const Page: NextPageWithLayout<Props> = (props) => {
  const { data: session } = useSession()

  return (
    <Layout>
      <>
        <MyPageSeo
          path="/"
          title={
            session ? "ホーム" : `${config.siteMeta.title} | 議論&ナレッジ共有プラットフォーム`
          }
        />
        {!session ? (
          <section className="mx-auto bg-n-50 py-12 text-center">
            <div className="mx-auto max-w-screen-md px-4 md:px-8">
              <h1 className="mb-7 text-4xl font-bold">議論&ナレッジ共有プラットフォーム</h1>
              <img
                className="mx-auto"
                alt="付箋を使ってミーティングをする女性二人と男性2人のフラットイラスト"
                src="/mtg.png"
                height="450"
                width="450"
              ></img>
              <p className="mb-6 text-xl text-maintext">
                <span className="font-medium">Next NJR Feedback</span>
                はN中等部の<span className="font-medium">生徒、メンター・TA</span>
                が使用できる議論&ナレッジ共有プラットフォームです。
              </p>
              <button
                onClick={() => signIn("google")}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-12 py-3 text-center text-xl font-bold text-gray-700 shadow-md shadow-gray-300"
              >
                <span className="mr-2 inline-flex items-center">
                  <Google width={22} height={22} />
                </span>
                Login With Google
              </button>
              <p className="mt-4 text-sm text-gray-500">
                ( <Link href="/guideline">ガイドライン</Link>と
                <Link href="/privacy">プライバシーポリシー</Link>に同意の上、
                <span className="font-medium">@n-jr.jp</span>
                または<span className="font-medium">@nnn.ac.jp</span>
                を含むアカウントでログインしてください )
              </p>
            </div>
          </section>
        ) : (
          <>
            <section className="bg-gray-50 py-12">
              <ContentWrapper>
                <h3 className="mb-7 text-2xl font-bold md:text-3xl">🚀 話題のディスカッション</h3>
                {props.discussion.length > 0 ? (
                  <div className="overflow-hidden rounded-lg border">
                    {props.discussion.map((discussion) => (
                      <DiscussionCard key={discussion.id} discussion={discussion} />
                    ))}
                  </div>
                ) : (
                  <>
                    <NotContent />
                  </>
                )}
                <div className="mt-6 text-center text-lg">
                  <Link href="/discussion">ディスカッションをもっと見る →</Link>
                </div>
              </ContentWrapper>
            </section>
            <section className="bg-white py-12">
              <ContentWrapper>
                <h3 className="mb-7 text-2xl font-bold md:text-3xl">📚 よく見られているナレッジ</h3>
                {props.knowledge.length > 0 ? (
                  <div className="overflow-hidden rounded-lg border">
                    {props.knowledge.map((knowledge) => (
                      <Knowledge knowledge={knowledge} key={knowledge.id} />
                    ))}
                  </div>
                ) : (
                  <NotContent />
                )}
                <div className="mt-6 text-center text-lg">
                  <Link href="/knowledge">ナレッジをもっと見る →</Link>
                </div>
              </ContentWrapper>
            </section>
            <section className="bg-gray-100 py-12">
              <ContentWrapper>
                <h3 className="mb-7 text-2xl font-bold md:text-3xl">🔖 人気のタグ</h3>
                {props.tag.length > 0 ? (
                  <div className="mt-10 grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-6">
                    {props.tag.map((tag) => (
                      <>
                        <Link className="text-center" href={getTagPath(tag.id)}>
                          {tag.icon ? (
                            <img
                              className="mx-auto aspect-square rounded-full bg-white object-cover"
                              src={tag.icon}
                              height={100}
                              width={100}
                              alt={tag.icon}
                            ></img>
                          ) : (
                            <div className="mx-auto flex h-[100px] w-[100px] items-center justify-center rounded-full bg-white">
                              <AiFillTag size={50} color="#ee7800" className="mx-auto" />
                            </div>
                          )}
                          <div className="mt-2 overflow-hidden text-ellipsis whitespace-nowrap text-gray-800">
                            {tag.name}
                          </div>
                        </Link>
                      </>
                    ))}
                  </div>
                ) : (
                  <NotContent />
                )}
                <div className="mt-6 text-center text-lg">
                  <Link href="/tags">タグをもっと見る →</Link>
                </div>
              </ContentWrapper>
            </section>
          </>
        )}
        <section className="bg-gray-50 py-12">
          <ContentWrapper>
            <h2 className="mb-5 text-center text-4xl font-bold">See more.</h2>
            <p className="mx-auto mb-5 table text-lg text-gray-600">
              2023年のN中等部の
              <a
                href="https://nnn.ed.jp/course/commute_programming/curriculum/lt/"
                className="text-gray-700 underline"
              >
                LT大会
              </a>
              で発表したスライドです。
            </p>
            <div className="mx-auto max-w-3xl">
              <div className="relative w-full pb-slide pt-slidet">
                <iframe
                  src="https://docs.google.com/presentation/d/e/2PACX-1vSMHhi4FRH5gS5WdOjvgNR_JqI8YKqHSef1IeOL2WfYn9lDcr5uArdTuOOUfzVeKSZd38raU8DjJzzq/embed?start=false&loop=false&delayms=30000"
                  allowFullScreen={true}
                  title={config.siteMeta.title + "  議論&ナレッジ共有プラットフォームの開発"}
                  className="absolute inset-y-0 h-full w-full border-0"
                />
              </div>
            </div>
          </ContentWrapper>
        </section>
      </>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return { props: {} }
  }

  const discussion = await prisma.discussion.findMany({
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
    orderBy: {
      views: "desc",
    },
    take: 10,
    where: {
      archive: false,
    },
  })

  const knowledge = await prisma.knowledge.findMany({
    orderBy: {
      views: "desc",
    },
    select: {
      id: true,
      title: true,
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
      emoji: true,
      published: true,
      updated_at: true,
    },
    take: 10,
    where: {
      archive: false,
      published: true,
    },
  })

  const tag = await prisma.tag.findMany({
    orderBy: [
      {
        knowledge: {
          _count: "desc",
        },
      },
      {
        users: {
          _count: "desc",
        },
      },
    ],
    select: {
      id: true,
      name: true,
      icon: true,
    },
    take: 18,
  })

  return {
    props: {
      discussion: JSON.parse(JSON.stringify(discussion)),
      knowledge: JSON.parse(JSON.stringify(knowledge)),
      tag: JSON.parse(JSON.stringify(tag)),
    },
  }
}

export default Page
