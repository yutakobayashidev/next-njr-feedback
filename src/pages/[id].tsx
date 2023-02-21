import { config } from "@site.config"
import { Layout } from "@src/components/Layout"
import { MyPageSeo } from "@src/components/MyPageSeo"
import { getAllPostIds, getPostData } from "@src/lib/docs"
import type { NextPageWithLayout } from "@src/pages/_app"
import { GetStaticPaths, GetStaticProps } from "next"
import { FaGithub } from "react-icons/fa"

type Props = {
  postData: {
    id: string
    title: string
    contentHtml: string
  }
}

const Page: NextPageWithLayout<Props> = ({ postData }) => {
  return (
    <>
      <MyPageSeo path={"/" + postData.id} title={postData.title} />
      <div className="bg-slate-50 py-6 px-4 sm:py-8 lg:py-12">
        <article className="mx-auto max-w-screen-md rounded-xl bg-white px-4 py-12 md:px-8">
          <h1 className="pb-12 text-center text-3xl font-bold">{postData.title}</h1>
          <div
            className="prose max-w-none prose-a:font-medium prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
          />
          <a
            href={`${config.siteMeta.repository}/edit/main/docs/${postData.id}.md`}
            className="mt-5 flex items-center text-base text-gray-500 hover:text-gray-600"
          >
            <FaGithub className="mr-2" />
            GitHubで編集を提案
          </a>
        </article>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params?.id as string)

  return {
    props: {
      postData,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds()
  return {
    fallback: false,
    paths,
  }
}

Page.getLayout = (page) => <Layout>{page}</Layout>

export default Page
