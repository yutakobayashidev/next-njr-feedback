import prisma from "@src/lib/prisma"
import { HttpMethod } from "@src/types"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function SaveSiteSettings(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== HttpMethod.POST) {
    res.setHeader("Allow", [HttpMethod.POST])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const data = JSON.parse(req.body)

  try {
    const response = await prisma.user.update({
      data: {
        name: data.name,
      },
      where: {
        id: data.id,
      },
    })

    res.status(200).json(response)
  } catch (error) {
    console.error(error)
    res.status(500).end(error)
  }
}
