import { config } from "@site.config"
import { GoogleLogin } from "@src/components/GoogleLogin"
import { Layout } from "@src/components/Layout"
import { LinkBackHome } from "@src/components/LinkBackHome"
import { MyPageSeo } from "@src/components/MyPageSeo"
import { NextPageWithLayout } from "@src/pages/_app"
import Link from "next/link"
import { useRouter } from "next/router"
import { FaGithub } from "react-icons/fa"

const Page: NextPageWithLayout = () => {
  const { query } = useRouter()

  return (
    <Layout>
      <>
        <MyPageSeo
          path={"/auth/error"}
          noindex={true}
          title={(query.error as string) || "問題が発生しました"}
        />
        <div className="my-14">
          <div className="mx-auto max-w-screen-md px-4 md:px-8">
            <div className="text-center">
              <div className="text-4xl font-bold md:text-5xl">問題が発生しました</div>
              <h1 className="my-8 text-lg font-bold text-gray-500 md:text-center md:text-xl">
                認証に失敗しました。もう一度お試しください
              </h1>
              <img src="/fixing-bugs.png" alt="Fixing bugs" className="mx-auto" width="500"></img>
            </div>
            {query.error == "AccessDenied" && (
              <>
                <h3 className="mt-4 text-xl font-bold">N中等部の生徒・メンター・TAの方</h3>
                <p className="my-4 text-base text-gray-500">
                  <span className="font-medium">@n-jr.jp</span>または
                  <span className="font-medium">@nnn.ac.jp</span>
                  を含むGoogle
                  WorkSpaceのアカウントを選択してログインしてください。それでもログインできない場合、Slackの
                  <Link
                    href={config.siteMeta.slack}
                    className="text-gray-600 underline hover:text-blue-400	hover:no-underline"
                  >
                    #next_njr_feedback
                  </Link>
                  チャンネルまでご連絡ください。
                </p>
                <div className="flex justify-center">
                  <GoogleLogin callbackUrl={"/"} />
                </div>
                <h3 className="mt-4 text-xl font-bold">N中等部の関係者ではない方</h3>
                <p className="my-4 text-base text-gray-500">
                  申し訳ございませんが、本サービスは、N中等部に在籍する生徒とメンター・TAの方だけが利用可能です。ただし、本サービスのソースコードはGitHubで公開されており、ライセンスに従って自由にご自身の環境でお使いいただけます。
                </p>
                <a
                  href={config.siteMeta.repository}
                  className="mb-4 flex items-center text-base text-gray-600"
                >
                  <FaGithub className="mr-2" size={20} />
                  <span className="font-bold">yutakobayashidev/next-njr-feedback</span>
                </a>
                <a className={config.siteMeta.repository}></a>
              </>
            )}
            <div className="text-center">
              {query.error == "AccessDenied" ? <LinkBackHome /> : <GoogleLogin callbackUrl={"/"} />}
            </div>
          </div>
        </div>
      </>
    </Layout>
  )
}

export default Page
