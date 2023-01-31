import { getDiscussion } from "@src/lib/api"
import { HttpMethod } from "@src/types"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"

import { authOptions } from "../auth/[...nextauth]"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(400).json({ error: { messsage: "ログインしてください" } })

  switch (req.method) {
    case HttpMethod.GET:
      return getDiscussion(req, res, session)
    default:
      res.setHeader("Allow", [HttpMethod.GET])
      return res.status(404).json({
        error: {
          messsage: `${req.method}メソッドはサポートされていません。`,
        },
      })
  }
}
