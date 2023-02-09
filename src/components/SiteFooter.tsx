import { config } from "@site.config"
import Link from "next/link"
import { FaGithub, FaSlack } from "react-icons/fa"

export const SiteFooter: React.FC = () => {
  return (
    <div className="border-t bg-white">
      <footer className="mx-auto">
        <div className="flex flex-col items-center pt-6">
          <nav className="mb-4 flex flex-col flex-wrap justify-center gap-x-4 gap-y-2 text-center md:flex-row md:justify-start md:gap-6 md:text-left">
            {config.footerLinks.map((link, i) => {
              const key = `footer-link-${i}`
              if (link.href.startsWith("/")) {
                return (
                  <Link key={key} href={link.href} className="text-gray-700 hover:underline">
                    {link.title}
                  </Link>
                )
              }
              return (
                <a key={key} href={link.href} className="text-gray-700 hover:underline">
                  {link.title}
                </a>
              )
            })}
          </nav>
          <div className="flex gap-4">
            <a
              href={config.siteMeta.slack}
              className="text-gray-400 transition duration-100 hover:text-gray-500"
            >
              <FaSlack size={24} aria-label="Slack" />
            </a>
            <a
              href={config.siteMeta.repository}
              className="text-gray-400 transition duration-100 hover:text-gray-500"
            >
              <FaGithub size={24} aria-label="GitHub" />
            </a>
          </div>
        </div>
        <div className="py-4 text-center text-sm text-gray-400">© 2023 {config.siteMeta.title} Team</div>
      </footer>
    </div>
  )
}
