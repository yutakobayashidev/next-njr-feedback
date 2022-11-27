import { MyPageSeo } from "@src/components/MyPageSeo"
import { User } from "@src/components/User"
import { NextPage } from "next"
import { signIn, useSession } from "next-auth/react"

const Page: NextPage = () => {
  const { data: session } = useSession()

  if (session && session.user) {
    return (
      <>
        <MyPageSeo path="/" title={"ホーム"} noindex={true} />
        <User />
      </>
    )
  }
  return (
    <>
      <MyPageSeo
        path="/"
        title={"NJR Feedback | 議論&ナレッジ共有プラットフォーム"}
        noTitleTemplate={true}
        noindex={true}
      />
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
            <span className="font-medium">Next NJR Feedback (仮)</span>
            はN中等部のSlackに参加している生徒またはスタッフが <br />
            使用できる議論&ナレッジ共有プラットフォームです。
          </p>
          <button
            onClick={() => signIn("slack")}
            className="inline-block items-center justify-center rounded-xl bg-slack px-12 py-3 text-center text-xl font-bold text-white shadow"
          >
            <span className="mr-2 inline-flex items-center">
              <img src="/slack.png" alt="Slack" width="18 " height="18"></img>
            </span>
            Slackでサインイン
          </button>
          <p className="mt-4 text-lg text-gray-500">
            ( N中等部のSlackアカウントでサインインしてください )
          </p>
        </div>
      </section>
    </>
  )
}

export default Page
