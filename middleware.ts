import { type NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/', '/login', '/signup'];

function isValidMockToken(token?: string): boolean {
    if (!token) return false;
    return /^mock\.[a-zA-Z0-9-]+\.signature$/.test(token);
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (publicRoutes.some((route) => pathname === route) || pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
        return NextResponse.next();
    }

    const token = request.cookies.get('auth_token')?.value;
    if (!isValidMockToken(token)) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('auth_token');
        return response;
    }

    return NextResponse.next();
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
