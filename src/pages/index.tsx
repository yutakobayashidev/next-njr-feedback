import { Layout } from "@src/components/Layout"
import { MyPageSeo } from "@src/components/MyPageSeo"
import { User } from "@src/components/User"
import type { NextPageWithLayout } from "@src/pages/_app"
import Link from "next/link"
import { signIn, useSession } from "next-auth/react"

const Page: NextPageWithLayout = () => {
  const { data: session } = useSession()

  if (session && session.user) {
    return (
      <>
        <MyPageSeo path="/" title="ホーム" />
        <User />
      </>
    )
  }
  return (
    <>
      <MyPageSeo path="/" title="NJR Feedback | 議論&ナレッジ共有プラットフォーム" />
      <section className="mx-auto bg-n-50 py-12 text-center">
        <div className="mx-auto max-w-screen-md px-4 md:px-8">
          <h1 className="mb-6 text-4xl font-bold">議論&ナレッジ共有プラットフォーム</h1>
          <img
            className="mx-auto"
            alt="付箋を使ってミーティングをする女性二人と男性2人のフラットイラスト"
            src="/mtg.png"
            height="450"
            width="450"
          ></img>
          <p className="mb-6 text-xl text-maintext">
            <span className="font-medium">Next NJR Feedback</span>
            はN中等部の<span className="font-medium">生徒またはメンター・TA</span>
            などが使用できる議論&ナレッジ共有プラットフォームです。
          </p>
          <button
            onClick={() => signIn("google")}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-12 py-3 text-center font-inter text-xl font-bold text-gray-700 shadow-md shadow-gray-300"
          >
            <span className="mr-2 inline-flex items-center">
              <img src="/google.svg" alt="Slack" width="22" height="22"></img>
            </span>
            Login With Google
          </button>
          <p className="mt-4 text-base text-gray-500">
            ( <Link href="/guideline">ガイドライン</Link>
            に同意の上、<span className="font-medium">@n-jr.jp</span>
            または<span className="font-medium">@nnn.ac.jp</span>
            を含むGoogleアカウントでログインしてください )
          </p>
        </div>
      </section>
    </>
  )
}

Page.getLayout = (page) => <Layout>{page}</Layout>

export default Page
