import prisma from "@src/lib/prisma"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { HttpMethod } from "@src/types"
import initEmojiRegex from "emoji-regex"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { z } from "zod"

const pickRandomEmoji = () => {
  // prettier-ignore
  const emojiList =["🚀","😺","📘","📚","📑","😊","😎","👻","🤖","😸","😽","💨","💬","💭","👋", "👌","👏","🙌","🙆","🐕","🐈","🦁","🐷","🦔","🐥","🐡","🐙","🍣","🕌","🌟","🔥","🌊","🎃","✨","🎉","⛳","🔖","📝","🗂","📌"]
  return emojiList[Math.floor(Math.random() * emojiList.length)]
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session)
    return res.status(401).json({
      error: { code: 401, messsage: "ログインしてください" },
    })

  if (!session.user.id)
    return res.status(500).json({
      error: { code: 500, messsage: "サーバーがセッションユーザーIDの取得に失敗しました" },
    })

  if (req.method === HttpMethod.POST) {
    const emojiRegex = initEmojiRegex()
    const matches = pickRandomEmoji().match(emojiRegex)

    if (!matches || !matches[0] || matches[1])
      return res.status(401).json({
        message: "リクエストパラメータに不足・不備がある可能性があります。",
      })

    try {
      const emoji = pickRandomEmoji()
      const result = await prisma.knowledge.create({
        data: {
          contributors: { connect: { id: session.user.id } },
          course: { connect: { id: 1 } },
          creator: { connect: { id: session.user.id } },
          emoji: emoji,
        },
      })

      await prisma.diff.create({
        data: {
          author: { connect: { id: session.user.id } },
          course: { connect: { id: 1 } },
          emoji: emoji,
          knowledge: { connect: { id: result.id } },
        },
      })
      res.status(201).json(result)
    } catch (error) {
      console.error(error)
      return res.status(500).end(error)
    }
  } else if (req.method === HttpMethod.GET) {
    const querySchema = z.object({
      count: z
        .string()
        .refine((v) => {
          return !isNaN(Number(v))
        })
        .transform((v) => Number(v)),
    })

    const result = querySchema.safeParse(req.query)

    if (!result.success) {
      return res.status(400).json({ error: { messsage: "クエリが不正です" } })
    }

    const { count } = result.data

    const { archive, handle } = req.query

    const data = await prisma.knowledge.findMany({
      include: {
        contributors: {
          select: {
            displayname: true,
            handle: true,
            image: true,
          },
          where: {
            ...(handle && { handle: String(handle) }),
          },
        },
        course: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: count,
      where: {
        ...(archive == "false" && { archive: false }),
        published: true,
      },
    })

    const knowledge = JSON.parse(JSON.stringify(data))

    res.status(201).json(knowledge)
  } else {
    res.setHeader("Allow", [HttpMethod.POST, HttpMethod.GET])
    return res.status(405).json({
      error: {
        code: 405,
        messsage: `${req.method}メソッドはサポートされていません。`,
      },
    })
  }
}
