import { Menu, Transition } from "@headlessui/react"
import { config } from "@site.config"
import { ContentWrapper } from "@src/components/ContentWrapper"
import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import { Fragment } from "react"
import { FaGithub, FaSlackHash } from "react-icons/fa"
import { FiSettings } from "react-icons/fi"
import { MdOutlineLogout } from "react-icons/md"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export const SiteHeader: React.FC = () => {
  const { data: session } = useSession()

  return (
    <header className="border-b border-gray-200 bg-white">
      <ContentWrapper>
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="font-inter font-bold text-n">
            {config.siteMeta.title}
          </Link>
          {session && session.user && session.user.name && session.user.image ? (
            <>
              <div className="flex items-center">
                <Menu as="div" className="relative">
                  <div>
                    <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={session.user.image}
                        alt="メニューを開く"
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 my-1 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-base font-medium text-gray-700",
                            )}
                          >
                            {session && session.user && session.user.name && (
                              <div>{session.user.name + "さん"}</div>
                            )}
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="https://n-jr.slack.com/archives/C04BQAHNVMM"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "flex border-t-2 border-gray-100 items-center px-4 py-2 text-base text-gray-700",
                            )}
                          >
                            <span className="mr-1">
                              <FaSlackHash color="#93a5b1" />
                            </span>
                            Slackチャンネルに参加
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href={config.siteMeta.repository}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "flex items-center px-4 py-2 text-base text-gray-700",
                            )}
                          >
                            <span className="mr-1">
                              <FaGithub color="#93a5b1" />
                            </span>
                            Githubで貢献
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "flex items-center px-4 py-2 text-base text-gray-700",
                            )}
                          >
                            <span className="mr-1">
                              <FiSettings color="#93a5b1" />
                            </span>
                            アカウント設定
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() =>
                              signOut({
                                callbackUrl: "/",
                              })
                            }
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "w-full flex border-t-2 border-gray-100 items-center px-4 py-2 text-base text-gray-700",
                            )}
                          >
                            <span className="mr-1">
                              <MdOutlineLogout color="#93a5b1" />
                            </span>
                            ログアウト
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
                <div>
                  <Link
                    href="/knowledge/new"
                    className="ml-4 rounded-md bg-n px-4 py-2 font-inter font-bold text-white shadow-sm hover:opacity-90"
                  >
                    + New
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="rounded-md bg-n px-4 py-2 font-bold text-white shadow-sm hover:opacity-90"
            >
              サインイン
            </button>
          )}
        </div>
      </ContentWrapper>
    </header>
  )
}
