import { config } from "@site.config"
import { Layout } from "@src/components/Layout"
import { MyPageSeo } from "@src/components/MyPageSeo"
import type { NextPageWithLayout } from "@src/pages/_app"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { FaHome } from "react-icons/fa"

const Page: NextPageWithLayout = () => {
  const router = useRouter()

  const { data: session } = useSession()

  return (
    <>
      <MyPageSeo path={router.pathname} noindex={true} title={"404 not found"} />
      <div className="my-10 text-center">
        <div className="mx-auto max-w-screen-lg px-4 md:px-8">
          <div className="font-inter text-9xl font-bold">404</div>
          <h1 className="my-8 text-left text-lg font-bold text-gray-500 md:text-center md:text-xl">
            ページが見つかりませんでした。何か問題があれば
            {session ? (
              <a className="text-gray-600 hover:underline" href={config.siteMeta.slack}>
                #next_njr_feedback
              </a>
            ) : (
              <a
                className="text-gray-600 hover:underline"
                href={config.siteMeta.repository + "/issues/new"}
              >
                Github
              </a>
            )}
            までご報告ください。
          </h1>
          <div className="text-center">
            <img className="mx-auto pb-8" src="/404.svg" alt="404" width="500" />
          </div>
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-primary px-6 py-3 font-bold text-white"
          >
            <FaHome className="mr-2" />
            ホームに戻る
          </Link>
        </div>
      </div>
    </>
  )
}

Page.getLayout = (page) => <Layout>{page}</Layout>

export default Page
