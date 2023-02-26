import { Badge } from "@src/pages/users/[handle]"
import { KnowledgeProps } from "@src/types"
import type { User as NextAuthUser } from "next-auth"

export type UserSettings = Pick<
  NextAuthUser,
  "name" | "email" | "image" | "bio" | "displayname" | "handle" | "bio"
>

export type UserProps = {
  id: string
  _count: {
    discussion: number
    knowledge: number
  }
  badges: Badge[]
  bio: string
  contributor: boolean
  createdAt: string
  displayname: string
  handle: string
  image: string
  knowledge: KnowledgeProps[]
  n_course: string
  role: string
}
