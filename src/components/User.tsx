import { useSession } from "next-auth/react"
import { FaCode } from "react-icons/fa"
import { MdEmail } from "react-icons/md"

export const User: React.FC = () => {
  const { data: session } = useSession()

  return (
    <>
      {session && session.user && (
        <header>
          <div className="mx-auto max-w-screen-lg px-4 md:px-8">
            <div className="mt-10 md:flex">
              <div>
                {session.user.name && session.user.image && (
                  <img
                    className="rounded-full"
                    width="120"
                    height="120"
                    alt={session.user.name}
                    src={session.user.image}
                  ></img>
                )}
              </div>
              <div className="mt-7 ml-0 md:mt-0 md:ml-7">
                <div>
                  <h1 className="text-2xl font-bold">{session.user.name}</h1>
                </div>
                <div className="my-2 flex">
                  {session.user.email && (
                    <span className="mr-1 flex items-center font-medium">
                      <img
                        src="/n-school.png"
                        alt="N中等部"
                        width="20"
                        height="20"
                        className="mr-1"
                      ></img>
                      {session.user.email.endsWith("@n-jr.jp") ? "生徒" : "メンター / TA"}
                    </span>
                  )}
                  {session.user.email && (
                    <span className="mr-1 flex items-center font-medium">
                      <MdEmail size={20} color="#797979" className="m-2" />
                      <a href={`mailto:${session.user.email}`}>{session.user.email}</a>
                    </span>
                  )}
                  <span className="mr-1 flex items-center font-medium">
                    <FaCode size={20} color="#61bd8d" className="m-2" />
                    コントリビューター
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}
    </>
  )
}
