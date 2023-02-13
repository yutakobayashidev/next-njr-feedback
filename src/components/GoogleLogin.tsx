import Google from "@public/google.svg"
import { signIn } from "next-auth/react"

export const GoogleLogin: React.FC<{ callbackUrl?: string }> = ({ callbackUrl }) => {
  return (
    <>
      <button
        onClick={() => signIn("google", { callbackUrl: callbackUrl })}
        className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-12 py-3 text-center font-inter text-base font-bold text-gray-700 shadow-md shadow-gray-300"
      >
        <span className="mr-2 inline-flex items-center">
          <Google width={18} height={18} />
        </span>
        Login With Google
      </button>
    </>
  )
}
