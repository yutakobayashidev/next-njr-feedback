import { Prisma } from "@prisma/client"
import prisma from "@src/lib/prisma"
import { HttpMethod } from "@src/types"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function SaveSiteSettings(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== HttpMethod.POST) {
    res.setHeader("Allow", [HttpMethod.POST])
    return res.status(405).end(`${req.method}メソッドはサポートされていません。`)
  }

  const data = JSON.parse(req.body)

  const { id, bio, displayname, handle } = data

  if (!id || typeof id !== "string" || !displayname || !handle) {
    return res.status(400).json({
      error: {
        code: 400,
        messsage: `必須項目が入力されていません`,
      },
    })
  }

  const handleRegExp = /^[a-zA-Z0-9]+$/
  if (!handleRegExp.test(handle)) {
    return res.status(400).json({
      error: {
        code: 400,
        messsage: `ハンドルはアルファベットと数字のみが使用できます`,
      },
    })
  }

  try {
    const response = await prisma.user.update({
      data: {
        bio,
        displayname,
        handle,
      },
      where: {
        id: id,
      },
    })

    return res.status(200).json(response)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError)
      if (error.code === "P2002") {
        return res.status(400).json({
          error: {
            code: 400,
            messsage: `この生徒番号は既に使用されています。`,
          },
        })
      }

    console.error(error)
    return res.status(500).json({
      error: {
        code: 500,
        messsage: `不明なエラーが発生しました`,
      },
    })
  }
}
