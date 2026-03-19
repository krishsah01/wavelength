import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const response = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
                        credentials,
                        // withCredentials forwards the Set-Cookie from the API
                        // so the browser receives the HttpOnly token cookie
                        { withCredentials: true }
                    )

                    if (!response.data || response.status !== 200) {
                        return null
                    }

                    // Return a minimal user object — the JWT lives in the API cookie,
                    // not in the NextAuth session, so no token is stored here.
                    return { id: '1' }
                } catch {
                    return null
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token }) {
            return token
        },
        async session({ session }) {
            return session
        },
    },
})

export { handler as GET, handler as POST }
