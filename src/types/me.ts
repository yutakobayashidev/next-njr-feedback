import { Badge } from "@src/pages/users/[handle]"
import { KnowledgeProps } from "@src/types"

export type UserSettings = Pick<
  UserProps,
  "name" | "bio" | "displayname" | "handle" | "image" | "leave" | "n_course" | "email" | "role"
>

export type UserProps = {
  id: string
  name: string
  _count: {
    discussion: number
    knowledge: number
  }
  badges: Badge[]
  bio?: string
  contributor: boolean
  createdAt: string
  displayname: string
  email: string
  handle: string
  image: string
  knowledge: KnowledgeProps[]
  leave: boolean
  n_course: string
  role: string
}
