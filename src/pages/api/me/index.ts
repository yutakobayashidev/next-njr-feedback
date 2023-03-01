import { Prisma } from "@prisma/client"
import prisma from "@src/lib/prisma"
import { withZod } from "@src/lib/withZod"
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
    const handlePut = withZod(
      z.object({
        body: z.object({
          bio: z
            .string({ invalid_type_error: "入力値に誤りがります" })
            .max(160, { message: "自己紹介は160文字以内で入力してください。" })
            .optional(),
          displayname: z.string().max(30, { message: "表示名は30文字以内で入力してください" }),
          handle: z
            .string({ invalid_type_error: "入力値に誤りがります", required_error: "必須項目です" })
            .regex(/^[a-zA-Z0-9]+$/, { message: "ハンドルは半角英数字で入力してください" })
            .min(4, { message: "ハンドルは４文字以上で入力してください。" })
            .max(30, { message: "ハンドルは30文字以内で入力してください。" }),
          image: z.string({
            invalid_type_error: "入力値に誤りがります",
            required_error: "必須項目です",
          }),
          leave: z.boolean({
            invalid_type_error: "入力値に誤りがります",
            required_error: "必須項目です",
          }),
          n_course: z.enum(["commute", "net", "nodata"]),
        }),
      }),
      async (req, res) => {
        try {
          const { bio, displayname, handle, image } = req.body
          const response = await prisma.user.update({
            data: {
              bio,
              displayname,
              handle,
              image,
            },
            where: {
              id: String(session.user.id),
            },
          })

          res.status(200).json(response)
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
        }
      },
    )

    return handlePut(req, res)
  }
}
