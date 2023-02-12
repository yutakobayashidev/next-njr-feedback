import prisma from "@src/lib/prisma"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { HttpMethod } from "@src/types"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  const { title, content } = req.body

  if (!session)
    return res.status(401).json({
      error: { code: 401, messsage: "ログインしてください" },
    })

  if (title?.length > 160) {
    return res.status(400).json({
      error: {
        code: 400,
        messsage: "タイトルは160文字以内で入力してください",
      },
    })
  }

  if (!session.user.id)
    return res.status(500).json({
      error: { code: 500, messsage: "サーバーがセッションユーザーIDの取得に失敗しました" },
    })

  if (req.method === HttpMethod.POST) {
    if (!title || !content)
      return res.status(401).json({
        error: { code: 401, messsage: "クエリが不足しています" },
      })

    try {
      const result = await prisma.discussion.create({
        data: {
          title: title,
          content: content,
          user: { connect: { id: session.user.id } },
        },
      })
      res.status(201).json(result)
    } catch (error) {
      console.error(error)
      return res.status(500).end(error)
    }
  } else if (req.method === HttpMethod.GET) {
    const { handle } = req.query

    const data = await prisma.discussion.findMany({
      include: {
        _count: {
          select: {
            comments: true,
          },
        },
        user: true,
      },
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
      where: {
        archive: false,
        ...(handle && { user: { handle: String(handle) } }),
      },
    })

    res.status(201).json(data)
  } else {
    res.setHeader("Allow", [HttpMethod.POST, HttpMethod.GET])
    return res.status(405).json({
      error: {
        code: 405,
        messsage: `${req.method}メソッドはサポートされていません。`,
      },
    })
  }
}
