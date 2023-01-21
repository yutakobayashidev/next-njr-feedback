import "dayjs/locale/ja"

import { Alert } from "@src/components/Alert"
import { ContentWrapper } from "@src/components/ContentWrapper"
import { MyPageSeo } from "@src/components/MyPageSeo"
import prisma from "@src/lib/prisma"
import { HttpMethod, KnowledgeProps } from "@src/types"
import { getKnowledgeEditPath, getKnowledgePath } from "@src/utils/helper"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { GetServerSideProps, NextPage } from "next"
import Link from "next/link"
import Router, { useRouter } from "next/router"
import { getSession, useSession } from "next-auth/react"
import { useEffect, useRef, useState } from "react"
import { remark } from "remark"
import html from "remark-html"

dayjs.extend(relativeTime)
dayjs.locale("ja")

/*
import data from "@emoji-mart/data"
import i18n from "@emoji-mart/data/i18n/ja.json"
import Picker from "@emoji-mart/react"
*/

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  const session = await getSession({ req })

  if (!session) {
    res.statusCode = 403
    return { props: { knowledge: [] } }
  }

  const data = await prisma.knowledge.findFirst({
    include: {
      contributors: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      creator: {
        select: {
          id: true,
          image: true,
        },
      },
    },
    where: {
      id: String(params?.id),
    },
  })

  if (data?.published === false && data.creator.id != session.user.id) {
    res.statusCode = 403
    return { props: { knowledge: [] } }
  }

  const knowledge = JSON.parse(JSON.stringify(data))

  const htmlBody = await remark().use(html).process(knowledge.content)
  const contentHtml = htmlBody.toString()
  knowledge.content = contentHtml

  return {
    props: knowledge,
  }
}

async function publishPost(id: string): Promise<void> {
  await fetch(`/api/knowledge/${id}`, {
    body: JSON.stringify({
      published: true,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: HttpMethod.PUT,
  })
  await Router.reload()
}

async function restorearchivePost(id: string): Promise<void> {
  await fetch(`/api/knowledge/${id}`, {
    body: JSON.stringify({
      archive: false,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: HttpMethod.PUT,
  })
  await Router.reload()
}

const Page: NextPage<KnowledgeProps> = (props) => {
  const {
    id,
    title,
    archive,
    content,
    contributors,
    creator,
    emoji,
    published,
    publishedAt,
    updatedAt,
  } = props

  const { data: session } = useSession()

  const userHasValidSession = Boolean(session)

  const [open, setOpen] = useState(false)

  const cancelButtonRef = useRef(null)

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
      <MyPageSeo path={getKnowledgePath(id)} title={title} />
      {!published && (
        <Alert id={id} edit={true}>
          💡 このナレッジは非公開です。有益な知識は積極的に公開しましょう
        </Alert>
      )}
      {published && !archive && dayjs(updatedAt).diff(dayjs(), "month") < -6 && (
        <>
          <Alert id={id} edit={true}>
            💡
            更新から半年以上が経過しています。情報が古い場合更新するか、不要な情報はアーカイブしましょう
          </Alert>
        </>
      )}
      {archive === true && (
        <div className="bg-gray-400">
          <ContentWrapper>
            <div className="py-4 text-center text-white">
              <span className="mr-3">🗑 このナレッジはアーカイブされています</span>
              <span>
                <button
                  onClick={() => restorearchivePost(id)}
                  className="rounded-md border-2 px-3 text-white"
                >
                  アーカイブを取り消す
                </button>
              </span>
            </div>
          </ContentWrapper>
        </div>
      )}
      <div className="mx-auto max-w-screen-lg px-4 md:px-8">
        <article className="py-16">
          <header className="mb-8">
            <div>
              <div className="flex justify-center text-8xl">
                <span>{emoji}</span>
              </div>
              <h1 className="mt-10 text-center text-3xl font-bold lg:text-5xl lg:leading-normal">
                <span>{title}</span>
              </h1>
              <div className="flex items-center justify-center pt-5">
                <div className="flex items-center">
                  <span className="flex items-center">
                    {publishedAt ? (
                      <>
                        <img
                          src={creator.image}
                          height={45}
                          width={45}
                          className="mr-2 rounded-full"
                          alt={creator.name}
                        ></img>
                        <time
                          dateTime={dayjs(publishedAt).toISOString()}
                          className="mr-3 text-sm text-gray-700  lg:text-lg"
                        >
                          {dayjs(publishedAt).isSame(dayjs(updatedAt), "day")
                            ? `${dayjs(publishedAt).format("YYYY/MM/DD")}に公開 `
                            : `${dayjs(updatedAt).fromNow()}に更新`}
                        </time>
                      </>
                    ) : (
                      <>
                        <img
                          src={creator.image}
                          height={45}
                          width={45}
                          className="mr-2 rounded-full"
                          alt={creator.name}
                        ></img>
                        <span className="mr-3 text-sm text-gray-700  lg:text-lg">非公開</span>
                      </>
                    )}
                  </span>
                  <span className="mr-3 rounded-2xl bg-coursebg py-1 px-2 text-sm font-bold text-course lg:px-4 lg:text-lg">
                    通学
                  </span>
                  <span className="mr-3 rounded-2xl bg-coursebg py-1 px-2 text-sm font-bold  text-course lg:px-4 lg:text-lg">
                    ネット
                  </span>
                </div>
              </div>
            </div>
          </header>
          <div
            className="prose max-w-none prose-h2:text-3xl prose-h3:text-2xl prose-p:text-lg"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          {/*
          <Picker
            i18n={i18n}
            locale={"ja"}
            theme={"light"}
            data={data}
            onEmojiSelect={console.log}
          />
          */}
          <aside className="mt-5 border-t-2 pt-5">
            <h2 className="mb-5 text-2xl font-bold">
              🎉 このナレッジの貢献者 ({contributors.length}人)
            </h2>
            <p className="mb-4 text-base text-gray-600">
              ✨ 情報が古い場合や問題点を見つけた場合は
              <Link href={getKnowledgeEditPath(id)}>編集</Link>
              してみましょう。より良いナレッジを作成するための助けになります。
            </p>
            <div className="rounded-2xl border">
              {contributors &&
                contributors.map((contributor) => (
                  <div
                    key={contributor?.id}
                    className="flex items-start p-4 [&:not(:first-child)]:border-t-2"
                  >
                    <div>
                      <img
                        className="rounded-full border"
                        src={contributor.image}
                        height={"65"}
                        width={"65"}
                        alt={contributor.name}
                      ></img>
                    </div>
                    <div className="ml-5">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800 line-clamp-1">
                          {contributor.name}
                          {contributor.email === session?.user?.email && " (あなた)"}
                        </h2>
                      </div>
                      <div className="mt-2">
                        <span className="mr-2 rounded-2xl bg-coursebg px-3 py-1 text-sm font-bold text-course">
                          {contributor.email.endsWith("@n-jr.jp") ? "生徒" : "メンター / TA"}
                        </span>
                        {contributor.id === creator?.id && (
                          <span className="mr-2 rounded-2xl bg-coursebg px-3 py-1 text-sm font-bold text-course">
                            ページ作成者
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </aside>
        </article>
      </div>
    </>
  )
}

export default Page
