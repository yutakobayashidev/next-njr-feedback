import { DiscussionProps } from "./discussion"

export type CommentProps = {
  id: string
  _count: {
    votes: true
  }
  content: string
  createdAt: string
  discussion: DiscussionProps
  updated_at?: string
  user: {
    id: string
    displayname: string
    handle: string
    image: string
    role: string
  }
  votes: Votes[]
}

type Votes = {
  user: {
    id: string
  }
}
