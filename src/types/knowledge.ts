export type KnowledgeProps = {
  id: string
  title?: string
  archive: boolean
  content?: string
  contributors: Contributor[]
  course: Course[]
  createdAt: string
  creator: {
    id: string
    name: string
    email: string
    image: string
  }
  emoji: string
  published: boolean
  publishedAt: string
  updatedAt: string
}

interface Course {
  id: number
  name: string
}

interface Contributor {
  id: string
  name: string
  email: string
  image: string
}
