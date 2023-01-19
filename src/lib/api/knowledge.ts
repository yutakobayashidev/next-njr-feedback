import prisma from "@src/lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"
import type { Session } from "next-auth"

/**
 * ナレッジの取得
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function getKnowledge(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
): Promise<void | NextApiResponse> {
  const { id } = req.query

  if (!id || typeof id !== "string" || !session?.user?.id) {
    return res.status(400).json({ error: "ナレッジIDまたはセッションが見つかりませんでした" })
  }

  try {
    const post = await prisma.knowledge.findFirst({
      include: {
        contributors: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        creator: {
          select: {
            id: true,
          },
        },
      },
      where: {
        id: id,
      },
    })
    if (post?.published == true || post?.creator.id == session.user.id) {
      return res.json(post)
    } else {
      return res.status(500).json({
        error: {
          messsage: `この操作は許可されていません`,
        },
      })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).end(error)
  }
}

/**
 * ナレッジの更新
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function updatePost(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
): Promise<void | NextApiResponse> {
  const { id } = req.query

  if (!id || typeof id !== "string" || !session?.user?.id) {
    return res.status(400).json({ error: "ナレッジIDまたはセッションが見つかりませんでした" })
  }

  try {
    const data = await prisma.knowledge.findUnique({ where: { id } })
    const publishedAt = data?.publishedAt ? null : new Date()
    const post = await prisma.knowledge.update({
      data: { published: true, publishedAt },
      where: { id },
    })
    return res.status(200).json(post)
  } catch (error) {
    console.error(error)
    return res.status(500).end(error)
  }
}

/**
 * ナレッジの削除
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function deletePost(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
): Promise<void | NextApiResponse> {
  const { id } = req.query

  if (!id || typeof id !== "string" || !session?.user?.id) {
    return res.status(400).json({ error: "ナレッジIDまたはセッションが見つかりませんでした" })
  }

  try {
    await prisma.knowledge.delete({
      where: { id: id },
    })
    return res.status(200).end()
  } catch (error) {
    console.error(error)
    return res.status(500).end(error)
  }
}
