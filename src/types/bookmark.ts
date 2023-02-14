import { KnowledgeProps } from "@src/types"

export type BookmarksProps = {
  id: string
  createdAt: string
  knowledge: KnowledgeProps
  knowledgeId: string
  userId: string
}
