import { ContentWrapper } from "@src/components/ContentWrapper"
import { DashboardSidebar } from "@src/components/DashboardSidebar"
import { Knowledge } from "@src/components/Knowledge"
import { Layout } from "@src/components/Layout"
import { UserLoader } from "@src/components/Loader"
import { MyPageSeo } from "@src/components/MyPageSeo"
import { NotContent } from "@src/components/NotContent"
import fetcher from "@src/lib/fetcher"
import useRequireAuth from "@src/lib/useRequireAuth"
import { NextPageWithLayout } from "@src/pages/_app"
import { BookmarksProps } from "@src/types"
import useSWR from "swr"

const Page: NextPageWithLayout = () => {
  const session = useRequireAuth()

  const { data: bookmarks, isValidating } = useSWR<Array<BookmarksProps>>(
    session && `/api/me/bookmarks`,
    fetcher,
  )

  return (
    <Layout>
      <>
        <MyPageSeo path="/dashboard" title="ブックマーク" />
        <ContentWrapper>
          <div className="my-10 block items-start md:flex">
            <DashboardSidebar />
            <div className="ml-auto max-w-4xl flex-1">
              <h1 className="text-4xl font-bold">ブックマーク</h1>
              <div className="min-h-screen">
                <p className="my-6 text-gray-600">あなたがブックマークしたナレッジの一覧です。</p>
                {isValidating ? (
                  <UserLoader />
                ) : (
                  <>
                    {bookmarks && bookmarks.length > 0 ? (
                      <>
                        <div className="overflow-hidden rounded-lg border">
                          {bookmarks.map((post) => (
                            <Knowledge knowledge={post.knowledge} key={post.id} />
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <NotContent />
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </ContentWrapper>
      </>
    </Layout>
  )
}

export default Page
