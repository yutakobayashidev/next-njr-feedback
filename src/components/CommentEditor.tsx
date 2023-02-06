import { HttpMethod } from "@src/types"
import { CommentProps } from "@src/types/comment"
import router from "next/router"
import { useEffect, useState } from "react"
import TextareaAutosize from "react-textarea-autosize"

export const CommentEditor: React.FC<{ comment: CommentProps; setEditForm: Function }> = ({
  comment,
  setEditForm,
}) => {
  const [content, setContent] = useState<string>("")

  async function handlecomment() {
    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        body: JSON.stringify({
          content: content.toString(),
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: HttpMethod.PUT,
      })
    } catch (error) {
      console.error(error)
    } finally {
      setEditForm(false)
      router.replace(router.asPath)
    }
  }

  useEffect(() => {
    // Set initial value to no-prefix and comment's content.
    if (comment) setContent(comment.content)
  }, [comment])

  function cancel() {
    setEditForm(false)

    setContent(comment.content)
  }

  return (
    <>
      <TextareaAutosize
        name="content"
        minRows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full resize-none rounded-xl border-2 border-gray-100 bg-gray-50 p-2"
      />
      <div className="text-right">
        <button
          onClick={() => {
            cancel()
          }}
          className="mr-6 text-gray-600"
        >
          キャンセル
        </button>
        <button
          disabled={!content}
          className="my-4 inline-flex h-12 w-36 items-center justify-center rounded-md bg-primary text-center font-bold text-white hover:enabled:hover:bg-blue-500 disabled:bg-gray-300 disabled:opacity-90"
          onClick={async () => {
            await handlecomment()
          }}
        >
          更新する
        </button>
      </div>
    </>
  )
}
