import { NotContent } from "@src/components/NotContent"
import fetcher from "@src/lib/fetcher"
import { DiscussionProps, HttpMethod } from "@src/types"
import { getDiscussionPath, getUserpagePath } from "@src/utils/helper"
import dayjs from "dayjs"
import Link from "next/link"
import { useRouter } from "next/router"
import { Session } from "next-auth"
import toast from "react-hot-toast"
import { AiOutlineCheck } from "react-icons/ai"
import { FaRegComment } from "react-icons/fa"
import useSWR from "swr"

export const CommentSidebar: React.FC<{
  props: DiscussionProps
  session: Session
}> = ({ props, session }) => {
  const router = useRouter()

  async function status(archive: boolean) {
    try {
      const response = await fetch(`/api/discussion/${props.id}`, {
        body: JSON.stringify({
          archive: archive,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: HttpMethod.PUT,
      })

      if (response.status !== 200) {
        const paas = await response.json()

        toast.error(paas.error.messsage)
      } else {
        router.replace(router.asPath)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const { data: discussions } = useSWR<Array<DiscussionProps>>(
    session && `/api/discussion`,
    fetcher,
  )

  return (
    <>
      <div className="flex-1 p-4">
        {props.user.id == session.user.id && (
          <>
            {props.archive ? (
              <div className="mb-4 flex items-center justify-between">
                {props.archived_at && (
                  <span className="mr-1">
                    {dayjs(props.archived_at).format("YYYY/MM/DD")}にアーカイブ
                  </span>
                )}
                <button
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-gray-50 py-2 px-4 text-center font-bold shadow-md"
                  onClick={async () => {
                    await status(false)
                  }}
                >
                  <AiOutlineCheck className="mr-2 text-gray-600" />
                  再オープン
                </button>
              </div>
            ) : (
              <button
                className="mb-4 inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-gray-50 py-3 px-6 text-center font-bold shadow-md"
                onClick={async () => {
                  await status(true)
                }}
              >
                <AiOutlineCheck className="mr-2 text-gray-600" />
                アーカイブする
              </button>
            )}
          </>
        )}
        <h4 className="text-2xl font-bold">新しく作成された議論</h4>
        <p className="my-2 text-gray-500">最近作成されたアーカイブされていない議論の一覧</p>
        <div className="my-4">
          {discussions && discussions.length > 0 ? (
            <>
              {discussions.map((discussion) => (
                <div key={discussion.id}>
                  <div className="my-2 flex items-center">
                    <Link href={getUserpagePath(discussion.user.handle)}>
                      <img
                        src={discussion.user.image}
                        alt={discussion.user.displayname}
                        height={30}
                        width={30}
                        className="mr-1 rounded-full"
                      />
                    </Link>
                    <Link href={getUserpagePath(discussion.user.handle)}>
                      <span className="mr-2 text-xs font-bold text-gray-800 ">
                        {discussion.user.displayname}
                      </span>
                    </Link>
                    <span className="text-xs font-bold text-gray-400">投稿</span>
                  </div>
                  <Link
                    href={getDiscussionPath(discussion.id)}
                    className="text-base font-bold leading-7 text-gray-800 line-clamp-3"
                  >
                    {discussion.title}
                  </Link>
                  <span className="mt-2 flex items-center text-gray-600">
                    <FaRegComment className="mr-1" size={17} />
                    {discussion._count.comments} comments
                  </span>
                </div>
              ))}
            </>
          ) : (
            <NotContent />
          )}
        </div>
      </div>
    </>
  )
}
