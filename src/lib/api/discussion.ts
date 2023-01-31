import prisma from "@src/lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"
import type { Session } from "next-auth"

/**
 * ナレッジの取得
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function getDiscussion(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
): Promise<void | NextApiResponse> {
  const { id } = req.query

  if (!id || typeof id !== "string" || !session?.user?.id) {
    return res.status(400).json({
      error: {
        code: 400,
        messsage: `ディスカッションIDまたはセッションが見つかりませんでした`,
      },
    })
  }

  try {
    const post = await prisma.discussion.findFirst({
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

    return res.status(200).json(post)
  } catch (error) {
    console.error(error)
    return res.status(500).end(error)
  }
}
