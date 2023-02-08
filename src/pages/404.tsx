import { config } from "@site.config"
import { Layout } from "@src/components/Layout"
import { LinkBackHome } from "@src/components/LinkBackHome"
import { MyPageSeo } from "@src/components/MyPageSeo"
import type { NextPageWithLayout } from "@src/pages/_app"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

const Page: NextPageWithLayout = () => {
  const router = useRouter()

  const { data: session } = useSession()

  return (
    <>
      <MyPageSeo path={router.pathname} noindex={true} title="見つかりませんでした" />
      <div className="my-10 text-center">
        <div className="mx-auto max-w-screen-lg px-4 md:px-8">
          <div className="font-inter text-9xl font-bold">404</div>
          <h1 className="my-8 text-left text-lg font-bold text-gray-500 md:text-center md:text-xl">
            このページが見つかりませんでした。何か問題があれば
            {session ? (
              <a className="text-gray-600 hover:underline" href={config.siteMeta.slack}>
                #next_njr_feedback
              </a>
            ) : (
              <a
                className="text-gray-600 hover:underline"
                href={config.siteMeta.repository + "/issues/new"}
              >
                GitHub
              </a>
            )}
            までご報告ください。
          </h1>
          <div className="text-center">
            <img className="mx-auto pb-8" src="/404.svg" alt="404" width="500" />
          </div>
          <LinkBackHome />
        </div>
      </div>
    </>
  )
}

Page.getLayout = (page) => <Layout>{page}</Layout>

export default Page
