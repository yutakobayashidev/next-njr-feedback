import "dayjs/locale/ja"

import { KnowledgeProps } from "@src/types"
import { getKnowledgePath, getUserpagePath } from "@src/utils/helper"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import Link from "next/link"
import React from "react"
import { TfiReload } from "react-icons/tfi"

dayjs.extend(relativeTime)
dayjs.locale("ja")

export const Knowledge: React.FC<{ knowledge: KnowledgeProps }> = ({ knowledge }) => {
  return (
    <div className="flex items-center justify-between bg-white p-3 [&:not(:first-child)]:border-t">
      <div className="flex flex-1 items-start">
        <Link
          href={getKnowledgePath(knowledge.id)}
          className="mr-4 flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 text-4xl"
        >
          <span>{knowledge.emoji}</span>
        </Link>
        <div className="w-[calc(100%-100px)]">
          <Link
            href={getKnowledgePath(knowledge.id)}
            className="text-xl font-bold text-gray-800 line-clamp-2"
          >
            {knowledge.title ? knowledge.title : "無題のナレッジ"}
            {!knowledge.published && " (非公開)"}
          </Link>
          <div className="mt-2 flex items-center">
            {knowledge?.course.map((course) => (
              <span
                key={course.id}
                className="mr-2 rounded-2xl bg-coursebg px-3 py-1 text-sm font-bold text-course"
              >
                {course.name}
              </span>
            ))}
            <span className="flex items-center text-gray-500">
              <TfiReload className="mr-1" />
              {dayjs(knowledge.updatedAt).fromNow()}
            </span>
          </div>
        </div>
      </div>
      <div className="hidden items-center md:flex">
        {knowledge.contributors &&
          knowledge.contributors.slice(0, 3).map((contributor, index) => (
            <Link
              key={`knowledge-item-${index}`}
              href={getUserpagePath(contributor.handle)}
              style={index === 0 ? { zIndex: 3 } : { marginLeft: -15, zIndex: 3 - index }}
            >
              <img
                alt={contributor.displayname}
                className="rounded-full border"
                height="45"
                width="45"
                src={contributor.image}
              ></img>
            </Link>
          ))}
        <span className="ml-2 text-gray-600">
          {knowledge.contributors.length <= 3
            ? "さんらが貢献"
            : "+" + (knowledge.contributors.length - 3) + "人が貢献"}
        </span>
      </div>
    </div>
  )
}
