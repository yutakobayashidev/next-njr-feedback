import { deletePost, getKnowledge, updatePost } from "@src/lib/api"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { HttpMethod } from "@src/types"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session)
    return res.status(401).json({
      error: { code: 401, messsage: "ログインしてください" },
    })

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
