import prisma from "@src/lib/prisma"
import { HttpMethod } from "@src/types"
import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session)
    return res.status(401).json({
      error: { code: 401, messsage: "ログインしてください" },
    })

  if (!session.user.id)
    return res.status(500).json({
      error: { code: 500, messsage: "サーバーがセッションユーザーIDの取得に失敗しました" },
    })

  switch (req.method) {
    case HttpMethod.POST:
      const { id } = req.query

      if (!id)
        return res.status(400).end("リクエストパラメータに不足・不備がある可能性があります。")

      const bookmark = await prisma.bookmark.findFirst({
        where: {
          knowledgeId: String(id),
          userId: session.user.id,
        },
      })

      if (!bookmark) {
        const response = await prisma.bookmark.upsert({
          create: {
            knowledge: { connect: { id: String(id) } },
            user: { connect: { id: session.user.id } },
          },
          update: {},
          where: {
            id: String(id),
          },
        })

        return res.status(200).json(response)
      }

      if (bookmark) {
        await prisma.bookmark.delete({
          where: {
            id: bookmark.id,
          },
        })
        return res.status(204).end()
      }
    default:
      res.setHeader("Allow", [HttpMethod.POST])
      return res.status(404).json({
        error: {
          messsage: `${req.method}メソッドはサポートされていません。`,
        },
      })
  }
}
