import { Diff, KnowledgeProps } from "@src/types"
import { getKnowledgeEditPath, getUserpagePath } from "@src/utils/helper"
import dayjs from "dayjs"
import Link from "next/link"

export const KnowledgePage: React.FC<{ diff: Diff; knowledge: KnowledgeProps }> = ({
  diff,
  knowledge,
}) => {
  return (
    <>
      <header className="mb-8">
        <div>
          <div className="flex justify-center text-8xl">
            <span>{diff.emoji}</span>
          </div>
          <h1 className="mt-10 text-center text-3xl font-bold lg:text-5xl lg:leading-normal">
            <span>{diff.title ? diff.title : "無題のナレッジ"}</span>
          </h1>
          <div className="flex items-center justify-center pt-5">
            <div className="flex items-center">
              <span className="flex items-center">
                {knowledge.publishedAt ? (
                  <>
                    <Link href={getUserpagePath(diff.author.handle)}>
                      <img
                        src={diff.author.image}
                        height={45}
                        width={45}
                        className="mr-2 aspect-square rounded-full object-cover"
                        alt={diff.author.image}
                      ></img>
                    </Link>
                    <time
                      dateTime={dayjs(knowledge.publishedAt).toISOString()}
                      className="mr-3 text-sm text-gray-700  lg:text-lg"
                    >
                      {dayjs(knowledge.publishedAt).isSame(dayjs(knowledge.updatedAt), "day")
                        ? `${dayjs(knowledge.publishedAt).format("YYYY/MM/DD")}に公開 `
                        : `${dayjs(knowledge.updatedAt).fromNow()}に更新`}
                    </time>
                  </>
                ) : (
                  <>
                    <Link href={getUserpagePath(knowledge.creator.handle)}>
                      <img
                        src={knowledge.creator.image}
                        height={45}
                        width={45}
                        className="mr-2 aspect-square rounded-full object-cover"
                        alt={knowledge.creator.displayname}
                      ></img>
                    </Link>
                    <span className="mr-3 text-sm text-gray-700  lg:text-lg">非公開</span>
                  </>
                )}
              </span>
              {diff.course.map((post) => (
                <>
                  <span className="mr-3 rounded-2xl bg-coursebg py-1 px-2 text-sm font-bold text-course lg:px-4 lg:text-lg">
                    {post.name}
                  </span>
                </>
              ))}
            </div>
          </div>
        </div>
      </header>
      <div>
        {diff.content ? (
          <div
            className="prose max-w-none break-words prose-h2:text-3xl prose-h3:text-2xl prose-p:text-lg prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{
              __html: diff.content,
            }}
          />
        ) : (
          <div className="text-center text-gray-600">
            <p>
              コンテンツがありません。
              <Link href={getKnowledgeEditPath(knowledge.id)}>ナレッジを編集</Link>してみませんか？
            </p>
          </div>
        )}
      </div>
    </>
  )
}
