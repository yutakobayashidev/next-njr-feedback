import { deletePost, getKnowledge, updatePost } from "@src/lib/api/knowledge"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { HttpMethod } from "@src/types"
import { NextApiRequest, NextApiResponse } from "next"
import { unstable_getServerSession } from "next-auth"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) return res.status(400).json({ error: { messsage: "ログインしてください" } })

  if (req.method === HttpMethod.DELETE) {
    return deletePost(req, res, session)
  } else if (req.method === HttpMethod.GET) {
    return getKnowledge(req, res, session)
  } else if (req.method === HttpMethod.PUT) {
    return updatePost(req, res, session)
  } else {
    return res.status(404).json({
      error: {
        messsage: `${req.method}メソッドはサポートされていません。`,
      },
    })
  }
}
