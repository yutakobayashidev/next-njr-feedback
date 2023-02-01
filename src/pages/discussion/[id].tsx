import "dayjs/locale/ja"

import { ContentWrapper } from "@src/components/ContentWrapper"
import { Layout } from "@src/components/Layout"
import { MyPageSeo } from "@src/components/MyPageSeo"
import prisma from "@src/lib/prisma"
import { NextPageWithLayout } from "@src/pages/_app"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { DiscussionProps } from "@src/types"
import { getDiscussionPath, getUserpagePath } from "@src/utils/helper"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { FaLock } from "react-icons/fa"
import { RiMessage2Fill } from "react-icons/ri"

dayjs.extend(relativeTime)
dayjs.locale("ja")

const Page: NextPageWithLayout<DiscussionProps> = (props) => {
  const { id, title, content, status, updatedAt, user, views } = props
  const { data: session } = useSession()

  useEffect(() => {
    const registerView = () =>
      fetch(`/api/discussion/${id}/views`, {
        method: "POST",
      })

    if (session) {
      registerView()
    }
  }, [id, session])

  return (
    <>
      <MyPageSeo path={getDiscussionPath(id)} title={title} />
      <div className="py-16">
        <ContentWrapper>
          <h1 className="mb-4 text-4xl font-bold">{title}</h1>
          <div className="block md:flex md:items-center">
            <div
              className={`${
                status == false ? "bg-primary" : "bg-slate-400"
              }  mr-2 mb-4 inline-block rounded-full py-2 px-4 font-bold text-white md:mb-0`}
            >
              <span className="flex items-center">
                {status == false ? (
                  <>
                    <RiMessage2Fill className="mr-2" />
                    Open
                  </>
                ) : (
                  <>
                    <FaLock className="mr-2" />
                    Close
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center">
              <Link href={getUserpagePath(user.handle)}>
                <img
                  src={user.image}
                  alt={user.displayname}
                  className="mr-2 rounded-full"
                  height={35}
                  width={35}
                />
              </Link>
              <span className="mr-2">
                {dayjs(updatedAt).fromNow()}
                に作成
              </span>
              <span>{views} View</span>
            </div>
          </div>
          <div className="my-4">{content}</div>
        </ContentWrapper>
      </div>
    </>
  )
}

Page.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.statusCode = 403
    return { props: { knowledge: [] } }
  }

  const data = await prisma.discussion.findFirst({
    include: {
      user: {
        select: {
          id: true,
          displayname: true,
          email: true,
          handle: true,
          image: true,
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

  const discussion = JSON.parse(JSON.stringify(data))

  return {
    props: discussion,
  }
}

export default Page
