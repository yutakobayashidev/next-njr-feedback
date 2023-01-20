import { KnowledgeProps } from "@src/types"
import { getKnowledgePath } from "@src/utils/helper"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import Link from "next/link"
import React from "react"

dayjs.extend(relativeTime)
dayjs.locale("ja")

const Knowledge: React.FC<{ post: KnowledgeProps }> = ({ post }) => {
  return (
    <div key={post.id} className="flex items-center p-3 [&:not(:first-child)]:border-t">
      <div className="flex flex-1 items-start">
        <Link href={getKnowledgePath(post.id)} className="mr-2 text-5xl">
          {post.emoji}
        </Link>
        <div>
          <Link
            href={getKnowledgePath(post.id)}
            className="text-xl font-bold text-gray-800 line-clamp-1"
          >
            {post.title}
          </Link>
          <div className="mt-2 items-center">
            <span className="mr-2 rounded-2xl bg-coursebg px-3 py-1 text-sm font-bold text-course">
              ネット
            </span>
            <span className="mr-2 rounded-2xl bg-coursebg px-3 py-1 text-sm font-bold text-course">
              通学
            </span>
            <span className="text-gray-500">{dayjs(post.updatedAt).fromNow()}に更新</span>
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
