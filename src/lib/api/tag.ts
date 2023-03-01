import prisma from "@src/lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"
import { Session } from "next-auth"
import { z } from "zod"

import { withZod } from "../withZod"

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
): Promise<unknown | NextApiResponse> {
  const handlePut = withZod(
    z.object({
      body: z.object({
        name: z.string({
          invalid_type_error: "入力値に誤りがります",
          required_error: "必須項目です",
        }),
        description: z
          .string({
            invalid_type_error: "入力値に誤りがります",
          })
          .optional(),
        icon: z
          .string({
            invalid_type_error: "入力値に誤りがります",
          })
          .optional(),
        official: z
          .string({
            invalid_type_error: "入力値に誤りがります",
          })
          .url({ message: "正しいURLを入力してください" })
          .optional(),
      }),
      query: z.object({
        id: z.string({
          invalid_type_error: "入力値に誤りがります",
          required_error: "必須項目です",
        }),
      }),
    }),
    async (req, res) => {
      try {
        const { name, description, icon, official } = req.body

        const response = await prisma.tag.update({
          data: {
            name,
            description,
            icon,
            official,
          },
          where: { id: req.query.id },
        })

        return res.status(200).json(response)
      } catch (error) {
        console.error(error)
        return res.status(500).end(error)
      }
    },
  )

  return handlePut(req, res)
}
