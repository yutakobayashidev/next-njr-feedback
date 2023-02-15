import { KnowledgeProps } from "@src/types"
import { getUserpagePath } from "@src/utils/helper"
import Link from "next/link"

export const Contributors: React.FC<{ knowledge: KnowledgeProps }> = ({ knowledge }) => {
  return (
    <div className="hidden items-center md:flex">
      {knowledge.contributors &&
        knowledge.contributors.slice(0, 3).map((contributor, index) => (
          <Link
            key={`contributor-item-${index}`}
            href={getUserpagePath(contributor.handle)}
            style={index === 0 ? { zIndex: 3 } : { marginLeft: -15, zIndex: 3 - index }}
          >
            <img
              alt={contributor.displayname}
              className="rounded-full border object-cover aspect-square"
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
  )
}
