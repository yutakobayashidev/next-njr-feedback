export function getUserpagePath(handle: string) {
  return `/users/${encodeURIComponent(handle)}`
}

export function getKnowledgePath(id: string) {
  return `/knowledge/${encodeURIComponent(id)}`
}

export function getKnowledgeEditPath(id: string) {
  return `/knowledge/${encodeURIComponent(id)}/edit`
}

export function getDiscussionPath(id: string) {
  return `/discussion/${encodeURIComponent(id)}`
}