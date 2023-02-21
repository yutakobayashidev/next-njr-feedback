import router from "next/router"

export function getUserpagePath(handle: string) {
  return `/users/${encodeURIComponent(handle)}`
}

export function getKnowledgePath(id: string) {
  return `/knowledge/${encodeURIComponent(id)}`
}

export function getReportPath() {
  return `/report?path=${router.asPath}`
}

export function getKnowledgeEditPath(id: string) {
  return `/knowledge/${encodeURIComponent(id)}/edit`
}

export function getDiscussionPath(id: string) {
  return `/discussion/${encodeURIComponent(id)}`
}

export function getQuestionPath(id: string) {
  return `/question/${encodeURIComponent(id)}`
}
