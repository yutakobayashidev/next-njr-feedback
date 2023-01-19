import prisma from "@src/lib/prisma"
import { HttpMethod } from "@src/types"
import initEmojiRegex from "emoji-regex"
import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"

const pickRandomEmoji = () => {
  // prettier-ignore
  const emojiList =["🚀","😺","📘","📚","📑","😊","😎","👻","🤖","😸","😽","💨","💬","💭","👋", "👌","👏","🙌","🙆","🐕","🐈","🦁","🐷","🦔","🐥","🐡","🐙","🍣","🕌","🌟","🔥","🌊","🎃","✨","🎉","⛳","🔖","📝","🗂","📌"]
  return emojiList[Math.floor(Math.random() * emojiList.length)]
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { title, content } = req.body

  const emojiRegex = initEmojiRegex()
  const matches = pickRandomEmoji().match(emojiRegex)

  const session = await getSession({ req })

  if (!session || !matches || !matches[0] || matches[1])
    return res.status(401).json({
      message: "ログインされていないか、リクエストパラメータに不足・不備がある可能性があります。",
    })

  if (!session.user.id)
    return res
      .status(500)
      .json({ error: { messsage: "サーバーがセッションユーザーIDの取得に失敗しました" } })

  if (req.method === HttpMethod.POST) {
    try {
      const result = await prisma.knowledge.create({
        data: {
          title: title,
          content: content,
          contributors: { connect: { id: session.user.id } },
          course: 1,
          creator: { connect: { id: session.user.id } },
          emoji: pickRandomEmoji(),
        },
      })
      res.status(201).json(result)
    } catch (error) {
      console.error(error)
      return res.status(500).end(error)
    }
  } else {
    return res.status(400).json({
      error: {
        messsage: `${req.method}メソッドはサポートされていません。`,
      },
    })
  }
}
