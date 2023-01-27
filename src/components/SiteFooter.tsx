import { config } from "@site.config"
import { FaGithub, FaSlack } from "react-icons/fa"

export const SiteFooter: React.FC = () => {
  return (
    <div className="border-t bg-white">
      <footer className="mx-auto">
        <div className="flex flex-col items-center pt-6">
          <div className="flex gap-4">
            <a
              href={config.siteMeta.slack}
              className="text-gray-400 transition duration-100 hover:text-gray-500"
            >
              <FaSlack size={24} />
            </a>
            <a
              href={config.siteMeta.repository}
              className="text-gray-400 transition duration-100 hover:text-gray-500"
            >
              <FaGithub size={24} />
            </a>
          </div>
        </div>
        <div className="py-4 text-center text-sm text-gray-400">© {config.siteMeta.title} Team</div>
      </footer>
    </div>
  )
}
