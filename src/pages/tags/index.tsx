import { Layout } from "@src/components/Layout"
import { MyPageSeo } from "@src/components/MyPageSeo"
import prisma from "@src/lib/prisma"
import { NextPageWithLayout } from "@src/pages/_app"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { getTagPath } from "@src/utils/helper"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { AiFillTag } from "react-icons/ai"

interface tag {
  id: string
  name: string
  icon?: string
}

type Props = {
  tags: tag[]
}

const Page: NextPageWithLayout<Props> = (props) => {
  return (
    <>
      <MyPageSeo path="/" title="タグ" />
      <section className="min-h-screen py-12">
        <div className="mx-auto max-w-screen-lg px-4 md:px-8">
          <h1 className="text-center font-inter text-4xl font-bold">Popular tag</h1>
          <div className="mt-10 grid grid-cols-3 gap-x-3 md:grid-cols-6	md:gap-x-6">
            {props.tags.map((tag) => (
              <Link
                href={getTagPath(tag.id)}
                key={tag.id}
                className="flex flex-wrap	justify-center rounded-lg border p-4 text-center hover:bg-gray-50"
              >
                {tag.icon ? (
                  <div>
                    <img
                      className="text-center"
                      src={tag.icon}
                      height={40}
                      width={40}
                      alt={tag.name}
                    />
                  </div>
                ) : (
                  <AiFillTag className="mx-auto text-center" size={40} color="#ee7800" />
                )}
                <div className="mt-2 w-full overflow-hidden	text-ellipsis whitespace-nowrap text-gray-800">
                  {tag.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return { props: { discussion: [], knowledge: [] } }
  }

  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: {
          knowledge: true,
          users: true,
        },
      },
    },
  })

  return {
    props: { tags },
  }
}

Page.getLayout = (page) => <Layout>{page}</Layout>

export default Page
