import axios from "axios";
import NextAuth from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials){
                try{
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, credentials)

                    if (!response.data || response.status !== 200){
                        return null
                    }
                    return {
                        id: '1',
                        token: response.data.token
                    }
                }catch(err){
                    throw new Error("Something went wrong")
                }
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login'
    },
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({token, user}){
            if (user) token.jwt = user.token
            return token
        },
        async session({session,token}){
            session.user.token = token.jwt
            return session
        }
    }
})

export {handler as GET, handler as POST}