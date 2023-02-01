import "dayjs/locale/ja"

import { ContentWrapper } from "@src/components/ContentWrapper"
import { Layout } from "@src/components/Layout"
import { MyPageSeo } from "@src/components/MyPageSeo"
import fetcher from "@src/lib/fetcher"
import { NextPageWithLayout } from "@src/pages/_app"
import { DiscussionProps } from "@src/types"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import Link from "next/link"
import { useRouter } from "next/router"
import { FaLock } from "react-icons/fa"
import { RiMessage2Fill } from "react-icons/ri"
import useSWR from "swr"

dayjs.extend(relativeTime)
dayjs.locale("ja")

const Page: NextPageWithLayout = () => {
  const router = useRouter()

  const { id: discussionId } = router.query

  const { data: discussion } = useSWR<DiscussionProps>(
    router.isReady && `/api/discussion/${discussionId}`,
    fetcher,
  )

  console.log(discussion)

  return (
    <>
      <MyPageSeo path={"/discussion/" + discussionId} title={discussion?.title} />
      <div className="py-16">
        <ContentWrapper>
          <h1 className="mb-4 text-4xl font-bold">{discussion?.title}</h1>
          <div className="block md:flex md:items-center">
            <div
              className={`${
                discussion?.status == false ? "bg-primary" : "bg-slate-400"
              }  mr-2 mb-4 inline-block rounded-full py-2 px-4 font-bold text-white md:mb-0`}
            >
              <span className="flex items-center">
                {discussion?.status == false ? (
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
              <Link href={"/users/" + discussion?.user?.handle}>
                <img
                  src={discussion?.user?.image}
                  alt={discussion?.user?.displayname}
                  className="mr-2 rounded-full"
                  height={35}
                  width={35}
                />
              </Link>
              <span>
                {dayjs(discussion?.updatedAt).fromNow()}
                に作成
              </span>
            </div>
          </div>
          <div className="my-4">{discussion?.content}</div>
        </ContentWrapper>
      </div>
    </>
  )
}

Page.getLayout = (page) => <Layout>{page}</Layout>

export default Page
