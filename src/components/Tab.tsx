import Link from "next/link"

interface TabProps {
  title: string
  href: string
  isSelected: boolean
}

export default function Tab({ title, href, isSelected }: TabProps) {
  return (
    <Link
      href={href}
      className={`${
        isSelected
          ? " border-gray-700 text-gray-700"
          : "border-white text-gray-400 transition duration-100 hover:text-gray-600"
      } mr-5 border-b-2 py-2 text-sm font-bold md:text-base`}
    >
      {title}
    </Link>
  )
}
