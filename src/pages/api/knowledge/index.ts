import prisma from "@src/lib/prisma"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { HttpMethod } from "@src/types"
import initEmojiRegex from "emoji-regex"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"

const pickRandomEmoji = () => {
  // prettier-ignore
  const emojiList =["🚀","😺","📘","📚","📑","😊","😎","👻","🤖","😸","😽","💨","💬","💭","👋", "👌","👏","🙌","🙆","🐕","🐈","🦁","🐷","🦔","🐥","🐡","🐙","🍣","🕌","🌟","🔥","🌊","🎃","✨","🎉","⛳","🔖","📝","🗂","📌"]
  return emojiList[Math.floor(Math.random() * emojiList.length)]
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session)
    return res.status(401).json({
      error: { code: 401, message: "ログインしてください" },
    })

  if (!session.user.id)
    return res.status(500).json({
      error: { code: 500, message: "サーバーがセッションユーザーIDの取得に失敗しました" },
    })

  if (req.method === HttpMethod.GET) {
    const { archive, handle, tag } = req.query

    const data = await prisma.knowledge.findMany({
      orderBy: {
        publishedAt: "desc",
      },
      select: {
        id: true,
        title: true,
        contributors: {
          include: {
            user: {
              select: {
                displayname: true,
                handle: true,
                image: true,
              },
            },
          },
        },
        course: true,
        emoji: true,
        published: true,
        updated_at: true,
      },
      where: {
        ...(handle && {
          contributors: {
            some: {
              user: {
                handle: String(handle),
              },
            },
          },
        }),
        published: true,
        ...(archive == "false" && { archive: false }),
        ...(tag && {
          tags: {
            some: {
              id: String(tag),
            },
          },
        }),
      },
    })

    res.status(201).json(JSON.parse(JSON.stringify(data)))
  } else if (req.method === HttpMethod.POST) {
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
          contributors: {
            create: { user: { connect: { id: session.user.id } } },
          },
          creator: { connect: { id: session.user.id } },
          emoji: emoji,
          lastEditor: { connect: { id: session.user.id } },
          updated_at: new Date(),
        },
      })

      await prisma.diff.create({
        data: {
          author: { connect: { id: session.user.id } },
          emoji: emoji,
          knowledge: { connect: { id: result.id } },
        },
      })
      res.status(201).json(result)
    } catch (error) {
      console.error(error)
      return res.status(500).end(error)
    }
  } else {
    res.setHeader("Allow", [HttpMethod.GET, HttpMethod.POST])
    return res.status(405).json({
      error: {
        code: 405,
        message: `${req.method}メソッドはサポートされていません。`,
      },
    })
  }
}
