import { config } from "@site.config"
import { ContentWrapper } from "@src/components/ContentWrapper"
import Link from "next/link"
import { signIn, useSession } from "next-auth/react"

export const SiteHeader: React.FC = () => {
  const { data: session } = useSession()

  return (
    <header className="border-b border-gray-200">
      <ContentWrapper>
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="font-bold text-n">
            {config.siteMeta.title}
          </Link>
          {session && session.user && session.user.image ? (
            <button>
              <img
                src={session.user.image}
                width={40}
                height={40}
                className="rounded-full"
                alt="メニュー"
              ></img>
            </button>
          ) : (
            <button
              onClick={() => signIn("slack")}
              className="rounded-md bg-n px-4 py-2 font-bold text-white shadow-sm hover:opacity-90 "
            >
              サインイン
            </button>
          )}
        </div>
      </ContentWrapper>
    </header>
  )
}
