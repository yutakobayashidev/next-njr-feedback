export const NotContent: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <>
      <div className="text-center">
        <p className="text-xl font-bold text-gray-400">{message || "コンテンツが存在しません"}</p>
        <p className="mt-10">
          <img className="mx-auto" width="300" height="243" src="/not-content.svg" alt={"My App"} />
        </p>
      </div>
    </>
  )
}
