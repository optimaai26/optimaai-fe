import { type NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/", "/login", "/signup"];

/**
 * Gate-check only: verifies the auth_token cookie is present and non-empty.
 * Full token validation (expiry, signature) is handled server-side by the
 * backend when AuthProvider calls GET /auth/me on mount.
 */
function hasAuthToken(token?: string): boolean {
	return !!token && token.length > 0;
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (
		publicRoutes.some((route) => pathname === route) ||
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api") ||
		pathname.includes(".")
	) {
		return NextResponse.next();
	}

	const token = request.cookies.get("auth_token")?.value;
	if (!hasAuthToken(token)) {
		const loginUrl = new URL("/login", request.url);
		loginUrl.searchParams.set("callbackUrl", pathname);
		const response = NextResponse.redirect(loginUrl);
		response.cookies.delete("auth_token");
		return response;
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
