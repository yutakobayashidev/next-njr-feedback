import prisma from "@src/lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"
import { Session } from "next-auth"
import { z } from "zod"

/**
 * タグの取得
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function getTag(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
): Promise<void | NextApiResponse> {
  const { id } = req.query

  if (!id || typeof id !== "string" || !session?.user?.id) {
    return res.status(400).json({
      error: {
        code: 400,
        message: `タグIDまたはセッションが見つかりませんでした`,
      },
    })
  }

  try {
    const tag = await prisma.tag.findFirst({
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        official: true,
      },
      where: {
        id: String(id),
      },
    })

    return res.status(200).json(tag)
  } catch (error) {
    console.error(error)
    return res.status(500).end(error)
  }
}

/**
 * タグの更新
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function updateTag(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
): Promise<void | NextApiResponse> {
  const { id } = req.query
  const { name, description, icon, official } = JSON.parse(req.body)

  if (!id || typeof id !== "string" || !session?.user?.id) {
    return res.status(400).json({
      error: {
        code: 400,
        message: `タグIDまたはセッションが見つかりませんでした`,
      },
    })
  }

  if (!name) {
    return res.status(400).json({
      error: {
        code: 400,
        message: `表示名が入力されていません`,
      },
    })
  }

  if (official && !z.string().url().safeParse(official).success) {
    return res.status(400).json({ error: { message: "httpsから始まるURLを入力してください" } })
  }

  try {
    const tag = await prisma.tag.update({
      data: {
        name,
        description,
        icon,
        official,
      },
      where: { id },
    })

    return res.status(200).json(tag)
  } catch (error) {
    console.error(error)
    return res.status(500).end(error)
  }
}
