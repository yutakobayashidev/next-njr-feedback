import { NotContent } from "@src/components/NotContent"
import fetcher from "@src/lib/fetcher"
import { QuestionProps } from "@src/types/question"
import { getQuestionPath, getUserpagePath } from "@src/utils/helper"
import dayjs from "dayjs"
import Link from "next/link"
import { Session } from "next-auth"
import { AiOutlineCheck } from "react-icons/ai"
import { FaRegComment } from "react-icons/fa"
import useSWR from "swr"

export const CommentSidebar: React.FC<{
  archived: boolean
  archived_time?: string
  props: QuestionProps
  session: Session
  status: (archive: boolean) => void
}> = ({ archived, archived_time, props, session, status }) => {
  const { data: questions } = useSWR<Array<QuestionProps>>(
    session && `/api/question?archive=false`,
    fetcher,
  )

  return (
    <>
      <div className="flex-1">
        {props.user.id == session.user.id && (
          <>
            {archived ? (
              <div className="mb-4 flex items-center justify-between">
                {archived_time && (
                  <span className="mr-1">
                    {dayjs(archived_time).format("YYYY/MM/DD")}にアーカイブ
                  </span>
                )}
                <button
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-gray-50 py-2 px-4 text-center font-bold shadow-md"
                  onClick={() => {
                    status(false)
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
        <h4 className="text-2xl font-bold">新しく作成された質問</h4>
        <p className="my-2 text-gray-500">最近作成されたアーカイブされていない質問の一覧</p>
        <div className="my-4">
          {questions && questions.length > 0 ? (
            <>
              {questions.map((question) => (
                <div key={question.id}>
                  <div className="my-2 flex items-center">
                    <Link href={getUserpagePath(question.user.handle)}>
                      <img
                        src={question.user.image}
                        alt={question.user.displayname}
                        height={30}
                        width={30}
                        className="mr-1 aspect-square rounded-full object-cover"
                      />
                    </Link>
                    <Link href={getUserpagePath(question.user.handle)}>
                      <span className="mr-2 text-xs font-bold text-gray-800 ">
                        {question.user.displayname}
                      </span>
                    </Link>
                    <span className="text-xs font-bold text-gray-400">投稿</span>
                  </div>
                  <Link
                    href={getQuestionPath(question.id)}
                    className="text-base font-bold leading-7 text-gray-800 line-clamp-3"
                  >
                    {question.title}
                  </Link>
                  <span className="mt-2 flex items-center text-gray-600">
                    <FaRegComment className="mr-1" size={17} />
                    {question._count.comments} comments
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
