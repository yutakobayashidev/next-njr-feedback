import prisma from "@src/lib/prisma"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { HttpMethod } from "@src/types"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  const { id } = req.query

  if (!session) return res.status(400).json({ error: { messsage: "ログインしてください" } })

  if (req.method === HttpMethod.POST) {
    const response = await prisma.discussion.update({
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
        messsage: `${req.method}メソッドはサポートされていません。`,
      },
    })
  }
}
