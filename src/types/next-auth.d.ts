import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      /**
       * The user's email address
       */
      id?: string | null

      name?: string | null

      bio?: string | null

      /**
       * The user's unique id number
       */
      displayname?: string | null

      /**
       * The users preferred avatar.
       * Usually provided by the user's OAuth provider of choice
       */
      email?: string | null

      /**
       * The user's full name
       */
      image?: string | null
    }
  }

  interface User {
    /**
     * The user's email address
     */
    id: string

    /**
     * The user's unique id number
     */
    name?: string | null
    bio?: string | null

    displayname?: string | null

    email?: string | null

    /**
     * The users preferred avatar.
     * Usually provided by the user's OAuth provider of choice
     */
    handle?: string | null

    /**
     * The user's full name
     */
    image?: string | null
  }
}
