import prisma from "@src/lib/prisma"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { HttpMethod } from "@src/types"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const { id, content } = req.body

  if (!session)
    return res.status(401).json({
      error: { code: 401, message: "ログインしてください" },
    })

  if (!session.user.id)
    return res.status(500).json({
      error: { code: 500, message: "サーバーがセッションユーザーIDの取得に失敗しました" },
    })

  if (req.method === HttpMethod.POST) {
    if (!content)
      return res.status(401).json({
        error: { code: 401, message: "クエリが不足しています" },
      })

    try {
      const result = await prisma.comment.create({
        data: {
          content,
          discussion: { connect: { id } },
          user: { connect: { id: session.user.id } },
        },
        include: {
          _count: { select: { votes: true } },
          user: { select: { id: true, displayname: true, handle: true, image: true, role: true } },
          votes: { select: { user: { select: { id: true } } } },
        },
      })

      if (result)
        await prisma.discussion.update({
          data: { last_comment_created_at: new Date() },
          where: { id: id },
        })
      res.status(201).json(result)
    } catch (error) {
      console.error(error)
      return res.status(500).end(error)
    }
  } else if (req.method === HttpMethod.GET) {
    const { handle } = req.query

    const comment = await prisma.comment.findMany({
      include: {
        discussion: true,
        user: {
          select: {
            displayname: true,
            handle: true,
            image: true,
            role: true,
          },
        },
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      where: {
        ...(handle && { user: { handle: String(handle) } }),
      },
    })

    res.status(201).json(comment)
  } else {
    res.setHeader("Allow", [HttpMethod.GET, HttpMethod.POST])
    return res.status(405).json({
      error: {
        code: 405,
        message: `${req.method}メソッドはサポートされていません。`,
      },
    })
  }
}
