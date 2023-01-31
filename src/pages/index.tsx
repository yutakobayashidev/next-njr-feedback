import { ContentWrapper } from "@src/components/ContentWrapper"
import { Layout } from "@src/components/Layout"
import { MyPageSeo } from "@src/components/MyPageSeo"
import type { NextPageWithLayout } from "@src/pages/_app"
import Link from "next/link"
import { useRouter } from "next/router"
import { signIn, useSession } from "next-auth/react"
import { useEffect } from "react"

const Page: NextPageWithLayout = () => {
  const { data: session } = useSession()

  const router = useRouter()

  useEffect(() => {
    if (session && session.user) {
      router.push(`/knowledge`)
    }
  }, [session, router])

  return (
    <>
      <MyPageSeo path="/" title="NJR Feedback | 議論&ナレッジ共有プラットフォーム" />
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
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-12 py-3 text-center font-inter text-xl font-bold text-gray-700 shadow-md shadow-gray-300"
          >
            <span className="mr-2 inline-flex items-center">
              <img src="/google.svg" alt="Google" width="22" height="22"></img>
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
      <section className="bg-gray-50 py-12">
        <ContentWrapper>
          <h2 className="mb-5 text-center font-inter text-4xl font-bold">See more.</h2>
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
                className="absolute inset-y-0 h-full w-full border-0"
              />
            </div>
          </div>
        </ContentWrapper>
      </section>
    </>
  )
}

Page.getLayout = (page) => <Layout>{page}</Layout>

export default Page
