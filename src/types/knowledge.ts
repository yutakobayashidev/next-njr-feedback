export type KnowledgeProps = {
  id: string
  title?: string
  _count: {
    bookmarks: number
  }
  archive: boolean
  bookmarks: Bookmark[]
  content?: string
  contributors: Contributor[]
  course: Course[]
  createdAt: string
  creator: {
    id: string
    name: string
    displayname: string
    email: string
    handle: string
    image: string
  }
  emoji: string
  published: boolean
  publishedAt: string
  updatedAt: string
}

interface Bookmark {
  user: {
    id: string
  }
}

interface Course {
  id: number
  name: string
}

interface Contributor {
  id: string
  name: string
  displayname: string
  email: string
  handle: string
  image: string
}
