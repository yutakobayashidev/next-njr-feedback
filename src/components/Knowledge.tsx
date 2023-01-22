import { KnowledgeProps } from "@src/types"
import { getKnowledgePath } from "@src/utils/helper"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import Link from "next/link"
import React from "react"
import { TfiReload } from "react-icons/tfi"

dayjs.extend(relativeTime)
dayjs.locale("ja")

const Knowledge: React.FC<{ post: KnowledgeProps }> = ({ post }) => {
  return (
    <div
      key={post.id}
      className="flex items-center justify-between p-3 [&:not(:first-child)]:border-t"
    >
      <div className="flex flex-1 items-start">
        <Link
          href={getKnowledgePath(post.id)}
          className="mr-4 flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 text-4xl"
        >
          <span>{post.emoji}</span>
        </Link>
        <div className="w-[calc(100%-100px)]">
          <Link
            href={getKnowledgePath(post.id)}
            className="text-xl font-bold text-gray-800 line-clamp-2"
          >
            {post.title}
          </Link>
          <div className="mt-2 flex items-center">
            {post?.course.map((post) => (
              <>
                <span className="mr-2 rounded-2xl bg-coursebg px-3 py-1 text-sm font-bold text-course">
                  {post.name}
                </span>
              </>
            ))}
            <span className="flex items-center text-gray-500">
              <TfiReload className="mr-1" />
              {dayjs(post.updatedAt).fromNow()}
            </span>
          </div>
        </div>
      </div>
      <div className="hidden items-center md:flex">
        {post.contributors &&
          post.contributors.slice(0, 3).map((contributor, index) => (
            <span
              key={contributor?.id}
              style={index === 0 ? { zIndex: 3 } : { marginLeft: -15, zIndex: 3 - index }}
            >
              <img
                alt={contributor.name}
                className="rounded-full border"
                height="45"
                width="45"
                src={contributor.image}
              ></img>
            </span>
          ))}
        <span className="ml-2 text-gray-600">
          {post.contributors.length <= 3
            ? "さんらが貢献"
            : "+" + (post.contributors.length - 3) + "人が貢献"}
        </span>
      </div>
    </div>
  )
}

export default Knowledge
