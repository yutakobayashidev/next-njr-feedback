export type DiscussionProps = {
  id: string
  title: string
  content: string
  createdAt: string
  status: boolean
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
