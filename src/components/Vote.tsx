import { HttpMethod } from "@src/types"
import { CommentProps } from "@src/types/comment"
import { useRouter } from "next/router"
import { IoTriangle } from "react-icons/io5"

export const Vote: React.FC<{ comment: CommentProps }> = ({ comment }) => {
  const router = useRouter()

  async function votes(id: string) {
    const response = await fetch(`/api/votes/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: HttpMethod.POST,
    })
    router.replace(router.asPath)
  }

  return (
    <div>
      <div className="flex flex-col text-center">
        <button
          onClick={async () => {
            await votes(comment.id as string)
          }}
        >
          <IoTriangle className="text-gray-600 hover:text-primary" aria-hidden="true" />
        </button>
        <div className="my-3 text-gray-600">{comment._count.votes}</div>
      </div>
    </div>
  )
}
