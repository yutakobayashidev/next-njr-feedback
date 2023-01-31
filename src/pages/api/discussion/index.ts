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
  } else {
    res.setHeader("Allow", [HttpMethod.POST, HttpMethod.GET])
    return res.status(400).json({
      error: {
        code: 400,
        messsage: `${req.method}メソッドはサポートされていません。`,
      },
    })
  }
}
