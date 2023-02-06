export type CommentProps = {
  id: string
  _count: {
    votes: true
  }
  content: string
  createdAt: string
  updated_at?: string
  user: {
    id: string
    displayname: string
    email: string
    handle: string
    image: string
  }
}
