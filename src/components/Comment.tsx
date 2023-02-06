import { Dialog, Menu, Transition } from "@headlessui/react"
import { config } from "@site.config"
import { CommentEditor } from "@src/components/CommentEditor"
import { Vote } from "@src/components/Vote"
import { HttpMethod } from "@src/types"
import { CommentProps } from "@src/types/comment"
import { getUserpagePath } from "@src/utils/helper"
import dayjs from "dayjs"
import Link from "next/link"
import router from "next/router"
import { Session } from "next-auth"
import { Fragment, useState } from "react"
import toast from "react-hot-toast"
import { BiChevronDown, BiLinkAlt } from "react-icons/bi"
import { BsPencil } from "react-icons/bs"
import { HiOutlineTrash } from "react-icons/hi"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

function copyTextToClipboard(text: string) {
  navigator.clipboard.writeText(text)

  toast.success("クリップボードにコピーしました")
}

export const CommentCard: React.FC<{ comment: CommentProps; session: Session }> = ({
  comment,
  session,
}) => {
  const [showEditForm, setEditForm] = useState(false)

  async function deletecomment(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: HttpMethod.DELETE,
      })

      if (response.ok) {
        toast.success("コメントを削除しました")
      } else {
        const json = await response.json()
        toast.error(json.error.messsage)
      }
    } catch (error) {
      console.error(error)
    } finally {
      router.replace(router.asPath)
    }
  }

  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
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
              <div className="relative my-8 inline-block w-full max-w-xs overflow-hidden rounded-xl bg-white p-6 align-middle shadow-xl transition-all">
                <header>
                  <h3 className="mb-6 text-center text-2xl font-bold text-gray-800">
                    本当に削除しますか？
                  </h3>
                  <div className="mx-auto">
                    <p className="mb-3 text-gray-500">
                      本当にコメントを削除しますか？この操作は元に戻せません
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="rounded-md border border-gray-200 bg-gray-50 py-2 px-6 text-center font-bold shadow-xl"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={() => {
                        deletecomment(comment.id as string)
                      }}
                      className="rounded-md border border-gray-200 bg-gray-50 py-2 px-6 text-center font-bold text-red-500 shadow-xl"
                    >
                      削除する
                    </button>
                  </div>
                </header>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      <div className="flex pb-4" id={"comment-" + comment.id}>
        <div className="w-full">
          <div className="flex items-center">
            <div className="relative">
              <Link href={getUserpagePath(comment.user.handle)}>
                <img
                  className="mr-3 rounded-full"
                  height={46}
                  width={46}
                  src={comment.user.image}
                  alt={comment.user.displayname}
                ></img>
              </Link>
              {comment.user.email.endsWith("@n-jr.jp") == false && (
                <span className="absolute -bottom-1  right-3">
                  <img
                    className="h-5 w-5 rounded-md border"
                    src="https://nnn.ed.jp/assets/img/touch_icon.png"
                    alt="角川ドワンゴ学園職員"
                  ></img>
                </span>
              )}
            </div>
            <div className="flex">
              <Link
                href={getUserpagePath(comment.user.handle)}
                className="mr-2 font-inter font-bold text-gray-800"
              >
                {comment.user.displayname}{" "}
                {comment.user.email.endsWith("@n-jr.jp") ? "(生徒)" : "(メンター / TA)"}
              </Link>
              <time className="text-sm text-gray-500" dateTime={comment.createdAt}>
                {comment.updated_at
                  ? dayjs(comment.updated_at).fromNow() + "に更新"
                  : dayjs(comment.createdAt).fromNow()}
              </time>
              <Menu as="div" className="relative ml-auto  inline-block">
                <Menu.Button>
                  <BiChevronDown
                    color="#acbcc7"
                    className="-mr-1 ml-2 h-5 w-5"
                    aria-hidden="true"
                  />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={classNames(
                              active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                              "flex border-b-2 border-gray-100 items-center text-base px-4 py-2 w-full",
                            )}
                            onClick={() =>
                              copyTextToClipboard(
                                config.siteRoot +
                                  "/discussion/" +
                                  router.query.id +
                                  "#comment-" +
                                  comment.id,
                              )
                            }
                          >
                            <BiLinkAlt className="mr-1" />
                            URLをコピー
                          </button>
                        )}
                      </Menu.Item>
                      {session.user.id == comment.user.id && (
                        <>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => setEditForm(true)}
                                className={classNames(
                                  active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                  "flex w-full items-center px-4 py-2 text-base",
                                )}
                              >
                                <BsPencil className="mr-1" />
                                編集
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => setIsOpen(true)}
                                className={classNames(
                                  active ? "bg-gray-100 text-red-900" : "text-red-700",
                                  "flex w-full items-center px-4 py-2 text-base",
                                )}
                              >
                                <HiOutlineTrash className="mr-1" />
                                削除
                              </button>
                            )}
                          </Menu.Item>
                        </>
                      )}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
          <div className="mt-6 font-inter leading-7 text-gray-800">
            {showEditForm ? (
              <CommentEditor setEditForm={setEditForm} comment={comment} />
            ) : (
              <>{comment.content}</>
            )}
          </div>
        </div>
        <Vote comment={comment} />
      </div>
    </>
  )
}