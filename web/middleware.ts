import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/connections", "/settings", "/profile", "/onboarding"];
const AUTH_ONLY = ["/login", "/register"];

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = request.nextUrl;

    const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
    const isAuthOnly = AUTH_ONLY.some((p) => pathname.startsWith(p));

    if (isProtected && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAuthOnly && token) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/connections/:path*", "/settings/:path*", "/profile/:path*", "/onboarding/:path*", "/login", "/register"],
};
