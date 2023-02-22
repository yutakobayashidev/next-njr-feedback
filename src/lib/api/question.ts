import prisma from "@src/lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"
import type { Session } from "next-auth"

/**
 * ディスカッションの取得
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function getQuestion(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
): Promise<void | NextApiResponse> {
  const { id } = req.query

  if (!id || typeof id !== "string" || !session?.user?.id) {
    return res.status(400).json({
      error: {
        code: 400,
        message: `クエスチョンIDまたはセッションが見つかりませんでした`,
      },
    })
  }

  try {
    const question = await prisma.question.findFirst({
      include: {
        user: {
          select: {
            id: true,
            displayname: true,
            handle: true,
            image: true,
          },
        },
      },
      where: {
        id: id,
      },
    })

    return res.status(200).json(question)
  } catch (error) {
    console.error(error)
    return res.status(500).end(error)
  }
}

/**
 * ディスカッションの更新
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function updateQuestion(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
): Promise<void | NextApiResponse> {
  const { id } = req.query
  const { title, archive } = req.body

  if (!id || typeof id !== "string" || !session?.user?.id) {
    return res.status(400).json({
      error: {
        code: 400,
        message: `ディスカッションIDまたはセッションが見つかりませんでした`,
      },
    })
  }

  const archived_at = new Date()

  const data = await prisma.question.findUnique({ where: { id } })

  if (session.user.id !== data?.userId) {
    return res.status(500).json({
      error: {
        code: 500,
        message: `この操作は許可されていません`,
      },
    })
  }
  try {
    const post = await prisma.question.update({
      data: {
        title,
        archive,
        ...(archive && { archived_at }),
      },
      where: { id },
    })
    return res.status(200).json(post)
  } catch (error) {
    console.error(error)
    return res.status(500).end(error)
  }
}
