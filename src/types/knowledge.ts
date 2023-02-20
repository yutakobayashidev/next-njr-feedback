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
    handle: string
    image: string
  }
  diff: Diff[]
  emoji: string
  lastEditor: {
    displayname: string
    handle: string
    image: string
  }
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
  createdAt: string
  user: {
    id: string
    name: string
    badge_gsuite: number
    badge_illustrator: number
    badge_js: number
    badge_linux: number
    badge_macos: number
    badge_minecraft: number
    badge_monopassport: number
    badge_photoshop: number
    badge_premierepro: number
    badge_shell: number
    badge_slack: number
    badge_windows: number
    contributor: boolean
    displayname: string
    handle: string
    image: string
    n_course: string
    role: string
  }
}
