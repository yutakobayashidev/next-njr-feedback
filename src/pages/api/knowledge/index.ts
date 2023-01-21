import prisma from "@src/lib/prisma"
import { HttpMethod } from "@src/types"
import initEmojiRegex from "emoji-regex"
import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import { z } from "zod"

const pickRandomEmoji = () => {
  // prettier-ignore
  const emojiList =["🚀","😺","📘","📚","📑","😊","😎","👻","🤖","😸","😽","💨","💬","💭","👋", "👌","👏","🙌","🙆","🐕","🐈","🦁","🐷","🦔","🐥","🐡","🐙","🍣","🕌","🌟","🔥","🌊","🎃","✨","🎉","⛳","🔖","📝","🗂","📌"]
  return emojiList[Math.floor(Math.random() * emojiList.length)]
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session)
    return res.status(401).json({
      message: "ログインしてください",
    })

  if (!session.user.id)
    return res.status(500).json({
      error: { code: 500, messsage: "サーバーがセッションユーザーIDの取得に失敗しました" },
    })

  if (req.method === HttpMethod.POST) {
    const { title, content } = req.body

    const emojiRegex = initEmojiRegex()
    const matches = pickRandomEmoji().match(emojiRegex)

    if (!matches || !matches[0] || matches[1])
      return res.status(401).json({
        message: "リクエストパラメータに不足・不備がある可能性があります。",
      })

    try {
      const result = await prisma.knowledge.create({
        data: {
          title: title,
          content: content,
          contributors: { connect: { id: session.user.id } },
          course: { connect: { id: 1 } },
          creator: { connect: { id: session.user.id } },
          emoji: pickRandomEmoji(),
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

    const data = await prisma.knowledge.findMany({
      include: {
        contributors: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
      take: count,
      where: {
        archive: false,
        published: true,
      },
    })

    const knowledge = JSON.parse(JSON.stringify(data))

    res.status(201).json(knowledge)
  } else {
    return res.status(400).json({
      error: {
        code: 400,
        messsage: `${req.method}メソッドはサポートされていません。`,
      },
    })
  }
}
