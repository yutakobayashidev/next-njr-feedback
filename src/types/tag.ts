import { UserProps } from "@src/types"

export type Tag = {
  id: string
  name: string
  _count: {
    knowledge: number
    users: number
  }
  description?: string
  icon?: string
  official?: string
  users: UserProps[]
}
