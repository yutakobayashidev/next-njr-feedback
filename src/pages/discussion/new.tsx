import { Layout } from "@src/components/Layout"
import Loader from "@src/components/Loader"
import { MyPageSeo } from "@src/components/MyPageSeo"
import useRequireAuth from "@src/hooks/useRequireAuth"
import { NextPageWithLayout } from "@src/pages/_app"
import { useRouter } from "next/router"
import { useState } from "react"
import toast from "react-hot-toast"
import TextareaAutosize from "react-textarea-autosize"

const Page: NextPageWithLayout = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isChecked, setIsChecked] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])

  const router = useRouter()

  const handleCourseSelection = (id: string) => {
    if (selectedCourses.includes(id)) {
      setSelectedCourses(selectedCourses.filter((courseId) => courseId !== id))
    } else {
      setSelectedCourses([...selectedCourses, id])
    }
  }

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    setPublishing(true)
    try {
      const body = { title, content, selectedCourses }
      const response = await fetch("/api/discussion", {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      })

      if (response.ok) {
        setPublishing(false)
        const json = await response.json()
        await router.push(`/discussion/${json.id}`)
      } else {
        setPublishing(false)
        const json = await response.json()
        toast.error(json.error.message)
      }
    } catch (error) {
      setPublishing(false)
      console.error(error)
    }
  }

  const session = useRequireAuth()
  if (!session) return <Loader />

  return (
    <Layout>
      <>
        <MyPageSeo
          path="/discussion/new"
          title="ディスカッションを作成"
          description="ディスカッションは、N中等部内の様々なシステムや制度などに関して議論するスペースです。"
        />
        <div className="py-12">
          <div className="mx-auto max-w-screen-sm px-4 md:px-8">
            <h1 className="mb-4 text-center text-4xl font-bold">Discussion</h1>
            <p className="mb-6 text-center text-lg text-gray-500">
              ディスカッションは、N中等部内の様々なシステムや制度などに関して
              <br className="hidden md:block" />
              議論するスペースです。
            </p>
            <img src="/discussion.svg" alt="Voting" width="350" className="mx-auto pb-8"></img>
            <form onSubmit={submitData}>
              <label className="my-2 flex items-center text-base font-medium">タイトル</label>
              <TextareaAutosize
                name="title"
                className="w-full resize-none rounded-xl border-2 border-gray-100 bg-gray-50 p-2"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                placeholder="タイトル"
              />
              <label className="my-2 flex items-center text-base font-medium">コースを選択</label>
              <p className="mt-2 text-sm text-gray-500">
                この議論に関連するコースを選択してください。
              </p>
              <div>
                <div className="mt-2">
                  <input
                    type="checkbox"
                    checked={selectedCourses.includes("1")}
                    onChange={() => handleCourseSelection("1")}
                    className="h-4 w-4 rounded border-0 bg-gray-100 text-primary focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-200 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                  />
                  <label className="mx-2 text-sm font-medium text-gray-600">通学コース</label>
                  <input
                    type="checkbox"
                    checked={selectedCourses.includes("2")}
                    onChange={() => handleCourseSelection("2")}
                    className="h-4 w-4 rounded border-0 bg-gray-100 text-primary focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-200 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-600">ネットコース</label>
                </div>
              </div>
              <label className="my-2 flex items-center text-base font-medium">概要</label>
              <TextareaAutosize
                name="title"
                minRows={3}
                className="w-full resize-none rounded-xl border-2 border-gray-100 bg-gray-50 p-2"
                onChange={(e) => setContent(e.target.value)}
                value={content}
                placeholder="ディスカッションの概要を入力"
              />
              <div className="my-3 flex items-center">
                <input
                  type="checkbox"
                  name="agree"
                  id="agreeCheck"
                  className="h-4 w-4 rounded border-0 bg-gray-100 text-primary focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-200 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                  onChange={() => setIsChecked(!isChecked)}
                />
                <label htmlFor="agreeCheck" className="ml-2 text-sm font-medium text-gray-600">
                  重複したディスカッションがないことを確認しました
                </label>
              </div>
              <div className="text-center">
                <button
                  disabled={!isChecked || !title || !content}
                  type="submit"
                  className="inline-flex h-12 w-36 items-center justify-center rounded-md bg-primary text-center font-bold text-white hover:enabled:hover:bg-blue-500 disabled:bg-gray-300 disabled:opacity-90"
                >
                  {publishing ? "作成中..." : "+ 議論を作成"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    </Layout>
  )
}

export default Page
