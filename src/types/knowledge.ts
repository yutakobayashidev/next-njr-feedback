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
  diff: Diff[]
  emoji: string
  published: boolean
  publishedAt: string
  updated_at: string
  updatedAt: string
}

export type Diff = {
  id: string
  title: string
  author: {
    id: string
    displayname: string
    handle: string
    image: string
  }
  content: string
  course: Course[]
  createdAt: string
  emoji: string
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
