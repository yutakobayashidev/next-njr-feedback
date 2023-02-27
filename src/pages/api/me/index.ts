import { Prisma } from "@prisma/client"
import prisma from "@src/lib/prisma"
import { authOptions } from "@src/pages/api/auth/[...nextauth]"
import { HttpMethod } from "@src/types"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session)
    return res.status(401).json({
      error: { code: 401, message: "ログインしてください" },
    })

  if (req.method === HttpMethod.GET) {
    const users = await prisma.user.findFirst({
      select: {
        id: true,
        name: true,
        bio: true,
        displayname: true,
        email: true,
        handle: true,
        image: true,
        leave: true,
        n_course: true,
        role: true,
      },
      where: {
        id: String(session.user.id),
      },
    })

    res.status(200).json(users)
  } else if (req.method === HttpMethod.PUT) {
    const { id, bio, displayname, handle, image, leave, n_course } = JSON.parse(req.body)

    if (!id || typeof id !== "string" || !displayname || !handle || !n_course || !image) {
      return res.status(400).json({
        error: {
          code: 400,
          message: `必須項目が入力されていません`,
        },
      })
    }

    if (handle.length < 4 || handle.length > 30) {
      return res.status(400).json({
        error: {
          code: 400,
          message: "ハンドルは4文字以上30文字以下で入力してください",
        },
      })
    }

    if (displayname.length > 30) {
      return res.status(400).json({
        error: {
          code: 400,
          message: "表示名は30文字以内で入力してください",
        },
      })
    }

    if (bio?.length > 160) {
      return res.status(400).json({
        error: {
          code: 400,
          message: "自己紹介は160文字以内で入力してください",
        },
      })
    }

    if (n_course !== "commute" && n_course !== "net" && n_course !== "nodata") {
      return res.status(400).json({
        error: {
          code: 400,
          message: "クエリが不正です",
        },
      })
    }

    const handleRegExp = /^[a-zA-Z0-9]+$/
    if (!handleRegExp.test(handle)) {
      return res.status(400).json({
        error: {
          code: 400,
          message: `ハンドルにはアルファベットと数字のみが使用できます`,
        },
      })
    }

    try {
      const response = await prisma.user.update({
        data: {
          bio,
          displayname,
          handle,
          image,
          leave,
          n_course,
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
              message: `このハンドルは既に使用されています。`,
            },
          })
        }

      console.error(error)
      return res.status(500).json({
        error: {
          code: 500,
          message: `不明なエラーが発生しました`,
        },
      })
    }
  }
}
