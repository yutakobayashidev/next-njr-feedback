import type { User as NextAuthUser } from "next-auth"

export type UserSettings = Pick<
  NextAuthUser,
  "name" | "email" | "image" | "bio" | "displayname" | "handle" | "bio"
>

export enum HttpMethod {
  CONNECT = "CONNECT",
  DELETE = "DELETE",
  GET = "GET",
  HEAD = "HEAD",
  OPTIONS = "OPTIONS",
  PATCH = "PATCH",
  POST = "POST",
  PUT = "PUT",
  TRACE = "TRACE",
}
