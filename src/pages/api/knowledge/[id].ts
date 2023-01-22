import { deletePost, getKnowledge, updatePost } from "@src/lib/api/knowledge"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { HttpMethod } from "@src/types"
import { NextApiRequest, NextApiResponse } from "next"
import { unstable_getServerSession } from "next-auth"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) return res.status(400).json({ error: { messsage: "ログインしてください" } })

  switch (req.method) {
    case HttpMethod.GET:
      return getKnowledge(req, res, session)
    case HttpMethod.DELETE:
      return deletePost(req, res, session)
    case HttpMethod.PUT:
      return updatePost(req, res, session)
    default:
      res.setHeader("Allow", [HttpMethod.GET, HttpMethod.DELETE, HttpMethod.PUT])
      return res.status(404).json({
        error: {
          messsage: `${req.method}メソッドはサポートされていません。`,
        },
      })
  }
}
