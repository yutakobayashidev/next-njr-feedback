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
    return res.status(400).json({
      error: {
        code: 400,
        messsage: `ナレッジIDまたはセッションが見つかりませんでした`,
      },
    })
  }

  try {
    const post = await prisma.knowledge.findFirst({
      include: {
        contributors: {
          include: {
            user: {
              select: {
                id: true,
                displayname: true,
                email: true,
                image: true,
              },
            },
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

    if (session.user.id !== post?.creatorId && post?.published == false) {
      return res.status(500).json({
        error: {
          code: 500,
          messsage: `この操作は許可されていません`,
        },
      })
    }

    return res.status(200).json(post)
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
export async function updateKnowledge(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
): Promise<void | NextApiResponse> {
  const { id } = req.query
  const { title, archive, content, emoji, published } = req.body

  if (!id || typeof id !== "string" || !session?.user?.id) {
    return res.status(400).json({
      error: {
        code: 400,
        messsage: `ナレッジIDまたはセッションが見つかりませんでした`,
      },
    })
  }

  if (published && (!title || !content)) {
    return res.status(400).json({
      error: {
        code: 400,
        messsage: `公開するにはタイトルと本文が必要です。`,
      },
    })
  }

  try {
    const data = await prisma.knowledge.findUnique({ where: { id } })

    if (session.user.id !== data?.creatorId && data?.published == false) {
      return res.status(500).json({
        error: {
          code: 500,
          messsage: `この操作は許可されていません`,
        },
      })
    }

    let publishedAt = new Date()

    await prisma.diff.create({
      data: {
        title,
        author: { connect: { id: session.user.id } },
        content,
        course: { connect: { id: 1 } },
        emoji,
        knowledge: { connect: { id: id } },
      },
    })

    const contributors = await prisma.contributors.findFirst({
      where: {
        knowledgeId: id,
        userId: session.user.id,
      },
    })

    if (!contributors) {
      await prisma.contributors.create({
        data: {
          knowledge: { connect: { id: id } },
          user: { connect: { id: session.user.id } },
        },
      })
    }

    const post = await prisma.knowledge.update({
      data: {
        title,
        archive,
        content,
        emoji,
        published,
        updated_at: new Date(),
        ...(published && !data?.publishedAt && { publishedAt }),
      },
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
export async function deleteKnowledge(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
): Promise<void | NextApiResponse> {
  const { id } = req.query

  if (!id || typeof id !== "string" || !session?.user?.id) {
    return res.status(400).json({
      error: {
        code: 400,
        messsage: `ナレッジIDまたはセッションが見つかりませんでした`,
      },
    })
  }

  const data = await prisma.knowledge.findUnique({ where: { id } })

  if (session.user.id !== data?.creatorId && data?.published == false) {
    return res.status(500).json({
      error: {
        code: 500,
        messsage: `この操作は許可されていません`,
      },
    })
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
