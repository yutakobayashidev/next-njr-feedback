import prisma from "@src/lib/prisma"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { HttpMethod } from "@src/types"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session)
    return res.status(401).json({
      error: { code: 401, messsage: "ログインしてください" },
    })

  if (!session.user.id)
    return res.status(500).json({
      error: { code: 500, messsage: "サーバーがセッションユーザーIDの取得に失敗しました" },
    })

  if (req.method !== HttpMethod.GET) {
    res.setHeader("Allow", [HttpMethod.GET])
    return res.status(405).end(`${req.method}メソッドはサポートされていません。`)
  }

  if (req.method === HttpMethod.GET) {
    const bookmarks = await prisma.bookmark.findMany({
      include: {
        knowledge: {
          select: {
            id: true,
            title: true,
            contributors: {
              select: {
                displayname: true,
                handle: true,
                image: true,
              },
            },
            course: true,
            emoji: true,
          },
        },
        user: {
          select: {
            displayname: true,
            handle: true,
            image: true,
          },
        },
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      where: {
        user: {
          id: String(session.user.id),
        },
      },
    })

    res.status(201).json(bookmarks)
  }
}
