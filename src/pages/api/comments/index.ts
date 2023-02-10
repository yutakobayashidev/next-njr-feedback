import prisma from "@src/lib/prisma"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { HttpMethod } from "@src/types"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const { id, content } = req.body

  if (!session)
    return res.status(401).json({
      error: { code: 401, messsage: "ログインしてください" },
    })

  if (!session.user.id)
    return res.status(500).json({
      error: { code: 500, messsage: "サーバーがセッションユーザーIDの取得に失敗しました" },
    })

  if (req.method === HttpMethod.POST) {
    if (!content)
      return res.status(401).json({
        error: { code: 401, messsage: "クエリが不足しています" },
      })

    try {
      await prisma.discussion.update({
        data: { last_comment_created_at: new Date() },
        where: { id: id },
      })

      const result = await prisma.comment.create({
        data: {
          content,
          discussion: {
            connect: { id: id },
          },
          user: { connect: { id: session.user.id } },
        },
      })
      res.status(201).json(result)
    } catch (error) {
      console.error(error)
      return res.status(500).end(error)
    }
  } else {
    res.setHeader("Allow", [HttpMethod.POST])
    return res.status(405).json({
      error: {
        code: 405,
        messsage: `${req.method}メソッドはサポートされていません。`,
      },
    })
  }
}
