import prisma from "@src/lib/prisma"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { HttpMethod } from "@src/types"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  const { title, content, selectedCourses } = req.body

  if (!session)
    return res.status(401).json({
      error: { code: 401, message: "ログインしてください" },
    })

  if (!session.user.id)
    return res.status(500).json({
      error: { code: 500, message: "サーバーがセッションユーザーIDの取得に失敗しました" },
    })

  if (req.method === HttpMethod.POST) {
    if (!title || !content)
      return res.status(401).json({
        error: { code: 401, message: "クエリが不足しています" },
      })

    if (title?.length > 160) {
      return res.status(400).json({
        error: {
          code: 400,
          message: "タイトルは160文字以内で入力してください",
        },
      })
    }

    const courses = selectedCourses.map((id: string) => parseInt(id))

    try {
      const result = await prisma.discussion.create({
        data: {
          title: title,
          content: content,
          course: { connect: courses.map((id: number) => ({ id })) },
          user: { connect: { id: session.user.id } },
        },
      })
      res.status(201).json(result)
    } catch (error) {
      console.error(error)
      return res.status(500).end(error)
    }
  } else if (req.method === HttpMethod.GET) {
    const { archive, handle } = req.query

    const data = await prisma.discussion.findMany({
      include: {
        _count: {
          select: {
            comments: true,
            votes: true,
          },
        },
        user: {
          select: {
            displayname: true,
            handle: true,
            image: true,
          },
        },
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      where: {
        ...(archive == "false" && { archive: false }),
        ...(handle && { user: { handle: String(handle) } }),
      },
    })

    res.status(201).json(data)
  } else {
    res.setHeader("Allow", [HttpMethod.POST, HttpMethod.GET])
    return res.status(405).json({
      error: {
        code: 405,
        message: `${req.method}メソッドはサポートされていません。`,
      },
    })
  }
}
