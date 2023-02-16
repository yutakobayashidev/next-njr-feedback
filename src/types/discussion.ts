import { CommentProps } from "@src/types/comment"

export type DiscussionProps = {
  id: string
  title: string
  _count: {
    comments: number
    votes: number
  }
  archive: boolean
  archived_at: string
  comments: CommentProps[]
  content: string
  course: Course[]
  createdAt: string
  last_comment_created_at: string
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
  votes: Votes[]
}

interface Course {
  id: number
  name: string
}

type Votes = {
  user: {
    id: string
  }
}
