import { config } from "@site.config"
import slack from "@src/lib/api/report"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { HttpMethod } from "@src/types"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { z } from "zod"

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

  if (req.method !== HttpMethod.POST) {
    res.setHeader("Allow", [HttpMethod.POST])
    return res.status(405).json({
      error: {
        code: 405,
        message: `${req.method}メソッドはサポートされていません。`,
      },
    })
  }

  const { content, slackname, url } = req.body

  if (!content || !slackname || !url)
    return res.status(400).json({
      error: { code: 400, message: "必須項目が入力されていません" },
    })

  if (!z.string().url().safeParse(url).success) {
    return res.status(400).json({ error: { message: "httpsから始まるURLを入力してください" } })
  }

  const message = `<${config.siteRoot}/users/${session?.user.handle}|${session?.user.displayname}>さん (Slack名: ${slackname})によって違反報告が行われました。\n\n\違反報告者のメールアドレス:\n${session.user.email}\n\n詳細:\n${content}\n\n違反が確認されるURL:\n${url}`

  await slack.sendToSlack(message)
  res.writeHead(201).end("Created")
}
