import { MyPageSeo } from "@src/components/MyPageSeo"
import { NextPage } from "next"
import { useRouter } from "next/router"

const Page: NextPage = () => {
  const router = useRouter()

  const { id: postId } = router.query

  const { data: post, isValidating } = useSWR<WithSitePost>(
    router.isReady && `/api/post?postId=${postId}`,
    fetcher,
    {
      dedupingInterval: 1000,
      onError: () => router.push("/"),
      revalidateOnFocus: false,
    },
  )

  return (
    <>
      <MyPageSeo title={"a"} path={"/"} />
    </>
  )
}

export default Page
