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

  if (req.method !== HttpMethod.POST) {
    res.setHeader("Allow", [HttpMethod.POST])
    return res.status(405).json({
      error: {
        code: 405,
        message: `${req.method}メソッドはサポートされていません。`,
      },
    })
  }

  const { id } = req.query

  if (!id)
    return res.status(400).json({
      error: { code: 400, message: "必須項目が入力されていません" },
    })

  const vote = await prisma.questionVote.findFirst({
    where: {
      questionId: String(id),
      userId: session.user.id,
    },
  })

  if (!vote) {
    const response = await prisma.questionVote.upsert({
      create: {
        question: { connect: { id: String(id) } },
        user: { connect: { id: session.user.id } },
      },
      update: {},
      where: {
        id: String(id),
      },
    })

    return res.status(200).json(response)
  }

  if (vote) {
    await prisma.questionVote.delete({
      where: {
        id: vote.id,
      },
    })
    return res.status(204).end()
  }
}
