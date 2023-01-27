import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      /**
       * The user's unique id number
       */
      id?: string | null

      /**
       * The user's full name
       */
      name?: string | null

      /**
       * The user's bio
       */
      bio?: string | null

      /**
       * The user's display name
       */
      displayname?: string | null

      /**
       * The user's email address
       */
      email?: string | null

      /**
       * The user's student id
       */
      handle?: string | null

      /**
       * The users preferred avatar.
       * Usually provided by the user's OAuth provider of choice
       */
      image?: string | null
    }
  }

  interface User {
    /**
     * The user's unique id number
     */
    id: string

    /**
     * The user's full name
     */
    name?: string | null

    /**
     * The user's bio
     */
    bio?: string | null

    /**
     * The user's display name
     */
    displayname?: string | null

    /**
     * The user's email address
     */
    email?: string | null

    /**
     * The users preferred avatar.
     * Usually provided by the user's OAuth provider of choice
     */
    email?: string | null

    /**
     * The user's student id
     */
    handle?: string | null

    /**
     * The users preferred avatar.
     * Usually provided by the user's OAuth provider of choice
     */
    image?: string | null
  }
}
