export function getKnowledgePath(id: string) {
  return `/knowledge/${encodeURIComponent(id)}`
}

export function getKnowledgeEditPath(id: string) {
  return `/knowledge/${encodeURIComponent(id)}/edit`
}
