import "dayjs/locale/ja"

import { DiscussionProps } from "@src/types"
import { getDiscussionPath, getUserpagePath } from "@src/utils/helper"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import Link from "next/link"

dayjs.extend(relativeTime)
dayjs.locale("ja")

export const DiscussionCard: React.FC<{ discussion: DiscussionProps }> = ({ discussion }) => {
  return (
    <div className="flex items-center bg-white p-3 [&:not(:first-child)]:border-t">
      <div className="flex flex-1 items-center">
        <Link className="mr-4" href={getUserpagePath(discussion.user.handle)}>
          <img
            className="aspect-square rounded-full border object-cover"
            src={discussion.user.image}
            height={60}
            width={60}
            alt={discussion.user.displayname}
          ></img>
        </Link>
        <div className="flex-1">
          <Link
            className="block text-xl font-bold text-gray-800"
            href={getDiscussionPath(discussion.id)}
          >
            {discussion.title}
          </Link>
          <div className="mt-2 flex items-center text-xs md:text-base">
            <span className="mr-2 rounded-2xl bg-coursebg px-3 py-1 text-sm font-bold text-course">
              {discussion.archive ? "Archive" : "Open"}
            </span>
            <Link
              href={getUserpagePath(discussion.user.handle)}
              className="mr-2 text-gray-800 hover:underline"
            >
              {discussion.user.displayname}
            </Link>
            <span className="mr-2 flex items-center text-gray-500">
              {discussion.last_comment_created_at
                ? dayjs(discussion.last_comment_created_at).fromNow() + "に追加"
                : dayjs(discussion.createdAt).fromNow() + "に作成"}
            </span>
          </div>
        </div>
        <div className="hidden flex-1 justify-around md:flex">
          <span className="items-center text-gray-500">
            <span className="block text-center font-bold text-gray-800">
              {discussion._count.votes}
            </span>
            Votes
          </span>
          <span className="items-center text-gray-500">
            <span className="block text-center font-bold text-gray-800">
              {discussion._count.comments}
            </span>
            Comments
          </span>
        </div>
      </div>
    </div>
  )
}
