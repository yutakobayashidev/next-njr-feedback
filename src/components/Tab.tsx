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
          ? "border-b-2 text-gray-700"
          : "text-gray-400 transition duration-100 hover:text-gray-600"
      } mr-5 border-gray-700 py-2 font-inter text-sm font-bold md:text-base`}
    >
      {title}
    </Link>
  )
}
