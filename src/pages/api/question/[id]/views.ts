import prisma from "@src/lib/prisma"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { HttpMethod } from "@src/types"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  const { id } = req.query

  if (!id || typeof id !== "string" || !session?.user?.id) {
    return res.status(400).json({
      error: {
        code: 400,
        message: `クエスチョンIDまたはセッションが見つかりませんでした`,
      },
    })
  }

  const data = await prisma.question.findUnique({ where: { id } })

  if (req.method === HttpMethod.POST) {
    if (session.user.id == data?.userId) {
      return res.status(334).json({
        error: {
          code: 334,
          message: `この操作は許可されていません`,
        },
      })
    }

    const response = await prisma.question.update({
      data: { views: { increment: 1 } },
      where: { id: String(id) },
    })

    return res.status(200).json({
      total: response.views.toString(),
    })
  } else {
    res.setHeader("Allow", [HttpMethod.POST])
    return res.status(405).json({
      error: {
        code: 405,
        message: `${req.method}メソッドはサポートされていません。`,
      },
    })
  }
}
