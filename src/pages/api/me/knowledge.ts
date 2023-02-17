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

  if (!session.user.id)
    return res.status(500).json({
      error: { code: 500, message: "サーバーがセッションユーザーIDの取得に失敗しました" },
    })

  if (req.method !== HttpMethod.GET) {
    res.setHeader("Allow", [HttpMethod.GET])
    return res.status(405).end(`${req.method}メソッドはサポートされていません。`)
  }

  if (req.method === HttpMethod.GET) {
    const data = await prisma.knowledge.findMany({
      include: {
        contributors: {
          include: {
            user: {
              select: {
                displayname: true,
                handle: true,
                image: true,
              },
            },
          },
        },
        course: true,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
        {
          publishedAt: "desc",
        },
      ],
      where: {
        creator: {
          id: String(session.user.id),
        },
        published: false,
      },
    })

    const knowledge = JSON.parse(JSON.stringify(data))

    res.status(201).json(knowledge)
  }
}
