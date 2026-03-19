import NextAuth from "next-auth"

// The JWT now lives in an HttpOnly cookie managed by the API, not in the
// NextAuth session. These augmentations retain the default NextAuth types.
declare module "next-auth" {
    interface User {
        id: string
    }
}
