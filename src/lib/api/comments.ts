import prisma from "@src/lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"
import type { Session } from "next-auth"

/**
 * コメントの更新
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function updateComment(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
): Promise<void | NextApiResponse> {
  const { id } = req.query
  const { content } = req.body

  if (!id || typeof id !== "string" || !session?.user?.id) {
    return res.status(400).json({
      error: {
        code: 400,
        message: `コメントIDまたはセッションが見つかりませんでした`,
      },
    })
  }

  if (!content) {
    return res.status(400).json({
      error: {
        code: 400,
        message: `コンテンツが不足しています`,
      },
    })
  }

  const data = await prisma.comment.findUnique({ where: { id } })

  if (data?.userId !== session.user.id) {
    return res.status(500).json({
      error: {
        code: 500,
        message: `この操作は許可されていません`,
      },
    })
  }

  try {
    const response = await prisma.comment.update({
      data: {
        content,
        updated_at: new Date(),
      },
      include: {
        _count: {
          select: {
            votes: true,
          },
        },
        user: {
          select: {
            id: true,
            displayname: true,
            handle: true,
            image: true,
            role: true,
          },
        },
        votes: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      where: { id },
    })
    return res.status(200).json(response)
  } catch (error) {
    console.error(error)
    return res.status(500).end(error)
  }
}

/**
 * コメントの削除
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function deleteComment(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
): Promise<void | NextApiResponse> {
  const { id } = req.query

  if (!id || typeof id !== "string" || !session?.user?.id) {
    return res.status(400).json({
      error: {
        code: 400,
        message: `コメントIDまたはセッションが見つかりませんでした`,
      },
    })
  }

  const data = await prisma.comment.findUnique({ where: { id } })

  if (data?.userId !== session.user.id) {
    return res.status(500).json({
      error: {
        code: 500,
        message: `この操作は許可されていません`,
      },
    })
  }

  try {
    await prisma.comment.delete({
      where: { id: id },
    })
    return res.status(200).end()
  } catch (error) {
    console.error(error)
    return res.status(500).end(error)
  }
}
