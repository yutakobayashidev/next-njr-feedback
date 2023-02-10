import { ContentWrapper } from "@src/components/ContentWrapper"
import { AlertProps } from "@src/types"
import { getKnowledgeEditPath } from "@src/utils/helper"
import Link from "next/link"
import React from "react"

export const Alert: React.FC<React.PropsWithChildren<AlertProps>> = (props) => {
  const { id } = props

  return (
    <div className="bg-gray-400">
      <ContentWrapper>
        <div className="py-4 text-center text-white">
          <span className="mr-3 text-base">{props.children}</span>
          {id && (
            <span>
              <Link
                className="my-3 rounded-md border-2 px-3 text-white"
                href={getKnowledgeEditPath(id)}
              >
                投稿を編集
              </Link>
            </span>
          )}
        </div>
      </ContentWrapper>
    </div>
  )
}

export default Alert
