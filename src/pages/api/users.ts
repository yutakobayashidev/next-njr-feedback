import prisma from "@src/lib/prisma"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { HttpMethod } from "@src/types"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session)
    return res.status(401).json({
      error: { code: 401, message: "ログインしてください" },
    })

  const { knowledge } = req.query

  if (!knowledge)
    return res.status(401).json({
      error: { code: 401, message: "クエリが不正です" },
    })

  if (req.method === HttpMethod.GET) {
    const users = await prisma.user.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        displayname: true,
        handle: true,
        image: true,
      },
      where: {
        ...(knowledge && {
          badges: {
            some: {
              id: String(knowledge),
            },
          },
        }),
      },
    })

    res.status(200).json(users)
  }
}
