import { MyPageSeo } from "@src/components/MyPageSeo"
import { getAllPostIds, getPostData } from "@src/lib/posts"
import { GetStaticPaths, GetStaticProps } from "next"

export default function Post({
  postData,
}: {
  postData: {
    id: string
    title: string
    contentHtml: string
  }
}) {
  return (
    <>
      <MyPageSeo path={"/" + postData.id} title={postData.title} />
      <div className="bg-slate-50 py-6 sm:py-8 lg:py-12">
        <article className="mx-auto max-w-screen-md rounded-xl bg-white px-4 py-12 md:px-8">
          <h1 className="text-center font-bold text-3xl pb-12">{postData.title}</h1>
          <div className="markdown" dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
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
