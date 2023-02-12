export default function Loader() {
  return (
    <div className="flex h-screen">
      <div className="m-auto flex">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    </div>
  )
}

export function UserLoader() {
  return (
    <div className="flex pt-6">
      <div className="m-auto flex">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    </div>
  )
}
