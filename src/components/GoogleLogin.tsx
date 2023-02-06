import { signIn } from "next-auth/react"

export default function GoogleLogin() {
  return (
    <button
      onClick={() => signIn("google")}
      className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-12 py-3 text-center font-inter text-base font-bold text-gray-700 shadow-md shadow-gray-300"
    >
      <span className="mr-2 inline-flex items-center">
        <img src="/google.svg" alt="Google" width="18" height="18" />
      </span>
      Login With Google
    </button>
  )
}
