import { Layout } from "@src/components/Layout"
import { MyPageSeo } from "@src/components/MyPageSeo"
import { NotContent } from "@src/components/NotContent"
import Tab from "@src/components/Tab"
import prisma from "@src/lib/prisma"
import { NextPageWithLayout } from "@src/pages/_app"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { getUserpagePath } from "@src/utils/helper"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { getServerSession } from "next-auth"
import { AiFillTag } from "react-icons/ai"

type Tag = {
  id: string
  name: string
  _count: {
    users: number
  }
  description?: string
  icon?: string
  users: UserProps[]
}

interface UserProps {
  id: string
  displayname: string
  handle: string
  image: string
}

const Page: NextPageWithLayout<Tag> = (props) => {
  const { id, name, _count, description, icon, users } = props

  const router = useRouter()

  return (
    <>
      <MyPageSeo path={"/tag/" + id} title={name} />
      <header>
        <div className="mx-auto max-w-screen-lg px-4 md:px-8">
          <div className="items-center justify-between py-10 md:flex">
            {icon ? (
              <div>
                <img
                  width={100}
                  height={100}
                  className="block rounded-full border p-2"
                  src={icon}
                  alt={name}
                />
              </div>
            ) : (
              <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full border">
                <AiFillTag size={50} color="#ee7800" className="mr-1" />
              </div>
            )}
            <div className="mt-7 ml-0 flex-1 md:mt-0 md:ml-7 ">
              <h1 className="mb-2 font-inter text-2xl font-bold md:text-3xl">{name}</h1>
              {description ? <p className="text-sm text-gray-600">{description}</p> : null}
            </div>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-screen-lg items-center px-4 md:px-8">
        <Tab href={`/tag/${id}`} title={"Users " + _count.users} isSelected={!router.query.tab} />
      </div>
      <div className="min-h-screen bg-gray-100 pt-16 pb-20">
        <div className="mx-auto max-w-screen-lg px-4 md:px-8">
          {users && users.length > 0 ? (
            <div className="overflow-hidden rounded-lg border">
              {users.map((user) => (
                <Link
                  key={user.id}
                  className="flex bg-white p-3 [&:not(:first-child)]:border-t"
                  href={getUserpagePath(user.handle)}
                >
                  <div className="flex text-gray-800">
                    <img
                      className="mr-4 rounded-full"
                      height={60}
                      width={60}
                      src={user.image}
                      alt={user.displayname}
                    ></img>
                    <div>
                      <div className="text-lg font-bold">{user.displayname}</div>
                      <div className="text-sm text-gray-400">@{user.handle}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <>
              <NotContent />
            </>
          )}
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return { props: { discussion: [], knowledge: [] } }
  }

  const tags = await prisma.tag.findUnique({
    include: {
      _count: {
        select: {
          users: true,
        },
      },
      users: {
        select: {
          id: true,
          displayname: true,
          handle: true,
          image: true,
        },
      },
    },
    where: {
      id: String(params?.id),
    },
  })

  if (!tags) {
    return {
      notFound: true,
    }
  }

  return {
    props: tags,
  }
}

Page.getLayout = (page) => <Layout>{page}</Layout>

export default Page
