import { type NextRequest, NextResponse } from 'next/server';

/**
 * Middleware – Edge-level route protection
 *
 * Redirects unauthenticated users to /login for all protected routes.
 * Currently uses a simple token check; replace with your actual auth mechanism.
 */

const publicRoutes = ['/', '/login', '/signup'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public routes and static assets
    if (
        publicRoutes.some((route) => pathname === route) ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Check for auth token (replace with your auth mechanism)
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
