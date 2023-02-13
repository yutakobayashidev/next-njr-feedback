import { ContentWrapper } from "@src/components/ContentWrapper"
import { DashboardSidebar } from "@src/components/DashboardSidebar"
import { Knowledge } from "@src/components/Knowledge"
import { Layout } from "@src/components/Layout"
import { UserLoader } from "@src/components/Loader"
import { MyPageSeo } from "@src/components/MyPageSeo"
import { NotContent } from "@src/components/NotContent"
import fetcher from "@src/lib/fetcher"
import { NextPageWithLayout } from "@src/pages/_app"
import { KnowledgeProps } from "@src/types"
import { getKnowledgeEditPath } from "@src/utils/helper"
import router from "next/router"
import { useSession } from "next-auth/react"
import { useState } from "react"
import useSWR from "swr"

const Page: NextPageWithLayout = () => {
  const session = useSession()

  const [onknowledge, setcreateKnowledge] = useState(false)

  const { data: knowledge, isValidating } = useSWR<Array<KnowledgeProps>>(
    session && `/api/me/knowledge`,
    fetcher,
  )

  async function createKnowledge() {
    setcreateKnowledge(true)
    try {
      const response = await fetch("/api/knowledge", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
      })

      if (response.ok) {
        setcreateKnowledge(false)
        const json = await response.json()
        await router.push(getKnowledgeEditPath(json.id))
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <MyPageSeo path="/dashboard" title="下書きの管理" />
      <ContentWrapper>
        <div className="my-10 block items-start md:flex">
          <DashboardSidebar />
          <div className="ml-auto max-w-4xl flex-1">
            <h1 className="text-4xl font-bold">下書きの管理</h1>
            <div className="min-h-screen">
              <p className="my-6 text-gray-600">
                このページではまだ公開していないあなたのナレッジが表示されます。
              </p>
              {isValidating ? (
                <UserLoader />
              ) : (
                <>
                  {knowledge && knowledge.length > 0 ? (
                    <>
                      <div className="overflow-hidden rounded-lg border">
                        {knowledge.map((post) => (
                          <Knowledge knowledge={post} key={post.id} />
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <NotContent />
                      <div className="mt-9 text-center">
                        <button
                          onClick={async () => {
                            await createKnowledge()
                          }}
                          className="my-4 inline-block rounded-md bg-primary py-3 px-6 font-bold text-white hover:opacity-90"
                        >
                          {onknowledge ? "作成中..." : "+ ナレッジを作成"}
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </ContentWrapper>
    </>
  )
}

Page.getLayout = (page) => <Layout>{page}</Layout>

export default Page
