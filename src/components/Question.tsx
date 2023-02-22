import "dayjs/locale/ja"

import { QuestionProps } from "@src/types/question"
import { getQuestionPath, getUserpagePath } from "@src/utils/helper"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import Link from "next/link"

dayjs.extend(relativeTime)
dayjs.locale("ja")

export const QuestionCard: React.FC<{ question: QuestionProps }> = ({ question }) => {
  return (
    <div className="flex items-center bg-white p-3 [&:not(:first-child)]:border-t">
      <div className="flex flex-1 items-center">
        <Link className="mr-4" href={getUserpagePath(question.user.handle)}>
          <img
            className="aspect-square rounded-full border object-cover"
            src={question.user.image}
            height={60}
            width={60}
            alt={question.user.displayname}
          ></img>
        </Link>
        <div className="flex-1">
          <Link
            className="block text-xl font-bold text-gray-800"
            href={getQuestionPath(question.id)}
          >
            {question.title}
          </Link>
          <div className="mt-2 flex items-center text-xs md:text-base">
            <span className="mr-2 rounded-2xl bg-coursebg px-3 py-1 font-bold text-course">
              {question.archive ? "Resolved" : "Open"}
            </span>
            <Link
              href={getUserpagePath(question.user.handle)}
              className="mr-2 text-gray-800 hover:underline"
            >
              {question.user.displayname}
            </Link>
            <span className="mr-2 flex items-center text-gray-500">
              {question.last_comment_created_at
                ? dayjs(question.last_comment_created_at).fromNow() + "に追加"
                : dayjs(question.createdAt).fromNow() + "に作成"}
            </span>
          </div>
        </div>
        <div className="hidden flex-1 justify-around md:flex">
          <span className="items-center text-gray-500">
            <span className="block text-center font-bold text-gray-800">
              {question._count.votes}
            </span>
            Votes
          </span>
          <span className="items-center text-gray-500">
            <span className="block text-center font-bold text-gray-800">
              {question._count.comments}
            </span>
            Comments
          </span>
        </div>
      </div>
    </div>
  )
}
