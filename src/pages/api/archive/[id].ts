import prisma from "@src/lib/prisma"
import { HttpMethod } from "@src/types"
import { NextApiRequest, NextApiResponse } from "next"
import { unstable_getServerSession } from "next-auth"

import { authOptions } from "../auth/[...nextauth]"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) return res.status(400).json({ error: { messsage: "ログインしてください" } })

  const postId = req.query.id as string

  if (req.method === HttpMethod.PUT) {
    try {
      const post = await prisma.knowledge.update({
        data: { archive: true },
        where: { id: postId },
      })
      res.json(post)
    } catch (error) {
      console.error(error)
      return res.status(500).end(error)
    }
  } else {
    return res.status(400).json({
      error: {
        messsage: `${req.method}メソッドはサポートされていません。`,
      },
    })
  }
}
