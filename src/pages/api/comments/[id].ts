import { deleteComment, updateComment } from "@src/lib/api/comments"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { HttpMethod } from "@src/types"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session)
    return res.status(401).json({
      error: { code: 401, messsage: "ログインしてください" },
    })

  if (req.method === HttpMethod.DELETE) {
    return deleteComment(req, res, session)
  } else if (req.method === HttpMethod.PUT) {
    return updateComment(req, res, session)
  } else {
    res.setHeader("Allow", [HttpMethod.PUT, HttpMethod.DELETE])
    return res.status(405).json({
      error: {
        code: 405,
        messsage: `${req.method}メソッドはサポートされていません。`,
      },
    })
  }
}
