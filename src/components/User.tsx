import { signOut, useSession } from "next-auth/react"
import { FaCode } from "react-icons/fa"

export const User: React.FC = () => {
  const { data: session, status } = useSession()

  return (
    <>
      {session && session.user ? (
        <>
          <header>
            <div className="mx-auto max-w-screen-lg px-4 md:px-8">
              <div className="mt-10 md:flex">
                <div>
                  {session.user.image && (
                    <img
                      className="rounded-full"
                      width="120"
                      height="120"
                      alt="アイコン"
                      src={session.user.image}
                    ></img>
                  )}
                </div>
                <div className="mt-7 ml-0 md:mt-0 md:ml-7">
                  <div>
                    <h1 className="text-2xl font-bold">{session.user.name}</h1>
                  </div>
                  <div className="my-2 flex">
                    <span className="mr-1 flex items-center font-medium">
                      <img
                        src="/n-school.png"
                        alt="N中等部"
                        width="20"
                        height="20"
                        className="mr-1"
                      ></img>
                      N中等部 {/* TODO: メールアドレスから判定 */}
                    </span>
                    <span className="mr-1 flex items-center font-medium">
                      <FaCode size={20} className="m-2" />
                      コントリビューター
                    </span>
                  </div>
                  <button onClick={() => signOut()}>ログアウト</button>
                </div>
              </div>
            </div>
          </header>
        </>
      ) : (
        <></>
      )}
    </>
  )
}
