import { CommentProps } from "@src/types/comment"

export type DiscussionProps = {
  id: string
  title: string
  _count: {
    comments: number
  }
  archive: boolean
  archived_at: string
  comments: CommentProps[]
  content: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    displayname: string
    email: string
    handle: string
    image: string
  }
  views: number
}
