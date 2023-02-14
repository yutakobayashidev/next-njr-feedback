import Link from "next/link"
import { useRouter } from "next/router"
import { BsBookmark } from "react-icons/bs"
import { FiSettings } from "react-icons/fi"
import { HiOutlineBookOpen } from "react-icons/hi"

const links = [
  {
    href: "/dashboard",
    icon: <HiOutlineBookOpen className="mx-auto md:mx-0" color="#93a5b1" />,
    label: "下書きの管理",
  },
  {
    href: "/dashboard/bookmarks",
    icon: <BsBookmark className="mx-auto md:mx-0" color="#93a5b1" />,
    label: "ブックマーク",
  },
  {
    href: "/dashboard/settings",
    icon: <FiSettings className="mx-auto" color="#93a5b1" />,
    label: "アカウント設定",
  },
]

export const DashboardSidebar: React.FC = () => {
  const router = useRouter()

  return (
    <div className="mr-36 flex md:block">
      {links.map(({ href, icon, label }) =>
        href.startsWith("/") ? (
          <Link
            href={href}
            key={href}
            className={`${
              router.pathname === href ? "bg-coursebg text-course" : "text-gray-400"
            } mb-4 block  items-center rounded-md  p-2 text-center text-xs font-bold  md:flex md:rounded-full md:py-3 md:px-8 md:text-base `}
          >
            {icon}
            <span className="ml-2">{label}</span>
          </Link>
        ) : (
          <a
            href={href}
            className="mb-4 block items-center  rounded-md py-3 px-8 text-center text-xs  font-bold text-gray-400 md:flex md:rounded-full md:text-base"
            key={href}
          >
            {icon}
            <span className="ml-2">{label}</span>
          </a>
        ),
      )}
    </div>
  )
}
