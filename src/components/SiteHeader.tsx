import { Dialog, Menu, Transition } from "@headlessui/react"
import { config } from "@site.config"
import { ContentWrapper } from "@src/components/ContentWrapper"
import { getKnowledgeEditPath } from "@src/utils/helper"
import Link from "next/link"
import { useRouter } from "next/router"
import { signIn, signOut, useSession } from "next-auth/react"
import { Fragment, useState } from "react"
import { FaGithub, FaSlackHash } from "react-icons/fa"
import { FiSettings } from "react-icons/fi"
import { MdOutlineLogout } from "react-icons/md"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export const SiteHeader: React.FC = () => {
  const { data: session, status } = useSession()

  const [isOpen, setIsOpen] = useState(false)
  const [knowledge, setcreateKnowledge] = useState(false)

  const router = useRouter()

  async function createKnowledge() {
    setcreateKnowledge(true)
    try {
      const response = await fetch("/api/knowledge", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
      })

      if (response.ok) {
        setcreateKnowledge(false)
        const json = await response.json()
        await router.push(getKnowledgeEditPath(json.id))
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <header className="border-b border-gray-200 bg-white">
        <ContentWrapper>
          <div className="flex h-14 items-center justify-between">
            <Link href="/" className="font-inter font-bold text-n">
              {config.siteMeta.title}
            </Link>
            {status != "loading" && (
              <>
                <div className="flex items-center">
                  {session && session.user && session.user.name && session.user.image ? (
                    <>
                      <Menu as="div" className="relative">
                        <div>
                          <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
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
                                  href={"/users/" + session.user.handle}
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-gray-700",
                                  )}
                                >
                                  {session &&
                                    session.user &&
                                    session.user.name &&
                                    session.user.handle && (
                                      <>
                                        <div className="text-base font-medium">
                                          {session.user.displayname + "さん"}
                                        </div>
                                        <div className="text-sm text-gray-400 line-clamp-1">
                                          @{session.user.handle}
                                        </div>
                                      </>
                                    )}
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  href="/settings"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "flex items-center px-4 py-2 text-base text-gray-700 border-t-2 border-gray-100",
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
                                <a
                                  href={config.siteMeta.slack}
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "flex items-center px-4 py-2 text-base text-gray-700",
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
                        <button
                          onClick={async () => {
                            await createKnowledge()
                          }}
                          disabled={knowledge}
                          className="ml-4 rounded-md bg-n px-4 py-2 font-inter font-bold text-white shadow-sm hover:opacity-90"
                        >
                          {knowledge ? "作成中..." : "+ New"}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsOpen(true)}
                        className="rounded-md bg-n px-4 py-2 font-inter font-bold text-white shadow-sm hover:opacity-90"
                      >
                        Log in
                      </button>
                      <Transition appear show={isOpen} as={Fragment}>
                        <Dialog
                          as="div"
                          className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto"
                          onClose={() => setIsOpen(false)}
                        >
                          <div className="min-h-screen px-4">
                            <Transition.Child
                              as={Fragment}
                              enter="ease-out duration-300"
                              enterFrom="opacity-0"
                              enterTo="opacity-100"
                              leave="ease-in duration-200"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                            </Transition.Child>

                            <span className="inline-block h-screen align-middle" aria-hidden="true">
                              &#8203;
                            </span>
                            <Transition.Child
                              as={Fragment}
                              enter="ease-out duration-300"
                              enterFrom="opacity-0 scale-95"
                              enterTo="opacity-100 scale-100"
                              leave="ease-in duration-200"
                              leaveFrom="opacity-100 scale-100"
                              leaveTo="opacity-0 scale-95"
                            >
                              <div className="relative my-8 inline-block w-full max-w-md overflow-hidden rounded-xl bg-white p-6 align-middle shadow-xl transition-all">
                                <header>
                                  <h3 className="mb-6 text-center text-2xl font-bold text-n">
                                    {config.siteMeta.title}
                                  </h3>
                                  <div className="mx-auto">
                                    <p className="mb-3 text-gray-600">
                                      <span className="text-lg font-bold">Next NJR Feedback</span>
                                      はN中等部の生徒、メンター・TAが使用できる議論&ナレッジ共有プラットフォームです。
                                    </p>
                                  </div>
                                </header>
                                <div className="flex justify-center">
                                  <button
                                    onClick={() => signIn("google")}
                                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-12 py-3 text-center font-inter text-base font-bold text-gray-700 shadow-md shadow-gray-300"
                                  >
                                    <span className="mr-2 inline-flex items-center">
                                      <img src="/google.svg" alt="Slack" width="18" height="18" />
                                    </span>
                                    Login With Google
                                  </button>
                                </div>
                                <div className="mx-auto mb-4">
                                  <p className="mt-4 text-base text-gray-600">
                                    ( <Link href="/guideline">ガイドライン</Link>
                                    に同意の上、<span className="font-medium">@n-jr.jp</span>
                                    または<span className="font-medium">@nnn.ac.jp</span>
                                    を含むGoogleアカウントでログインしてください )
                                  </p>
                                </div>
                              </div>
                            </Transition.Child>
                          </div>
                        </Dialog>
                      </Transition>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </ContentWrapper>
      </header>
    </>
  )
}
