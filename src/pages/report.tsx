import { config } from "@site.config"
import { Layout } from "@src/components/Layout"
import { LinkBackHome } from "@src/components/LinkBackHome"
import { MyPageSeo } from "@src/components/MyPageSeo"
import { NextPageWithLayout } from "@src/pages/_app"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import TextareaAutosize from "react-textarea-autosize"

const Page: NextPageWithLayout = () => {
  const router = useRouter()

  const [url, setUrl] = useState("")
  const [slackname, setSlackName] = useState("")
  const [content, setContent] = useState("")
  const [publishing, setPublishing] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const { data: session } = useSession()

  useEffect(() => {
    if (router.query.path) setUrl(config.siteRoot + router.query.path)
  }, [router.query.path])

  useEffect(() => {
    if (!session && typeof session != "undefined") {
      router.push(`/`)
    }
  }, [session, router])

  if (!session) {
    return null
  }

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    setPublishing(true)
    try {
      const response = await fetch("/api/report", {
        body: JSON.stringify({ content, slackname, url }),
        credentials: "same-origin",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: "POST",
        mode: "same-origin",
      })
      if (response.ok) {
        setSubmitted(true)
      } else {
        const json = await response.json()
        toast.error(json.error.messsage)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setPublishing(false)
    }
  }

  return (
    <>
      <MyPageSeo path="/report" title="違反を報告" />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 10000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
      <div className="py-12">
        <div className="mx-auto max-w-screen-sm px-4 md:px-8">
          {submitted ? (
            <>
              <h1 className="mb-4 text-center text-4xl font-bold">送信に成功しました</h1>
              <p className="mb-6 leading-7 text-gray-500">
                報告いただきありがとうございます。運営チームは、適切な対応を行います。なお、対応に関して返信に時間がかかる場合や返信ができない場合がありますので、ご了承いただけますようお願い申し上げます。返信内容は、あなたのメールアドレス
                ({session?.user.email}) にお送りいたします。
              </p>
              <img src="/alert.png" alt="Alert" />
              <div className="mt-4 text-center">
                <LinkBackHome />
              </div>
            </>
          ) : (
            <>
              <h1 className="mb-4 text-center font-inter text-4xl font-bold">Report</h1>
              <p className="mb-6 text-gray-500">
                <Link href="/guideline" className="leading-7 text-gray-600 underline">
                  ガイドライン
                </Link>
                に違反するコンテンツを見つけた・安全が脅かされると感じる場面などに遭遇した場合はこちらのフォームでご報告ください。なお、機能リクエストやバグ報告は
                <Link className="text-gray-600 underline" href={config.siteMeta.repository}>
                  Github
                </Link>
                またはSlackの
                <Link className="text-gray-600 underline" href={config.siteMeta.slack}>
                  #next_njr_feedback
                </Link>
                チャンネルまでお願いします。
              </p>
              <form onSubmit={submitData}>
                <label className="my-2 flex items-center text-base font-medium">
                  あなたのSlack名
                </label>
                <input
                  name="title"
                  className="w-full resize-none rounded-xl border-2 border-gray-100 bg-gray-50 p-2"
                  placeholder={session?.user.displayname || "N中太郎"}
                  onChange={(e) => setSlackName(e.target.value)}
                />
                <label className="my-2 flex items-center text-base font-medium">詳細</label>
                <TextareaAutosize
                  name="title"
                  minRows={6}
                  className="w-full resize-none rounded-xl border-2 border-gray-100 bg-gray-50 p-2"
                  placeholder="詳細を入力してください"
                  onChange={(e) => setContent(e.target.value)}
                />
                <label className="my-2 flex items-center text-base font-medium">
                  違反が確認されるURL
                </label>
                <input
                  name="title"
                  className="w-full resize-none rounded-xl border-2 border-gray-100 bg-gray-50 p-2"
                  placeholder={config.siteRoot + "/..."}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <div className="my-6 text-center">
                  <button
                    type="submit"
                    disabled={!slackname || !url || !content}
                    className="inline-flex h-12 w-36 items-center justify-center rounded-md bg-primary text-center font-bold text-white hover:enabled:hover:bg-blue-500 disabled:bg-gray-300 disabled:opacity-90"
                  >
                    {publishing ? "送信中..." : "送信する"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  )
}

Page.getLayout = (page) => <Layout>{page}</Layout>

export default Page
