import Link from "next/link"
import { FaHome } from "react-icons/fa"

export const LinkBackHome: React.FC = () => (
  <Link
    href="/"
    className="inline-flex items-center rounded-md bg-primary px-6 py-3 font-bold text-white hover:opacity-90"
  >
    <FaHome className="mr-2" />
    ホームに戻る
  </Link>
)
