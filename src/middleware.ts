import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add routes that don't require authentication
const publicRoutes = ["/login"];

// Add routes that require authentication
const protectedRoutes = [
  "/bookings",
  "/settings",
  "/branches",
  "/users",
  "/categories"
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  // If the user is trying to access a protected route without being authenticated
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // If the user is authenticated and trying to access login page
  if (publicRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/bookings", request.url));
  }

  return NextResponse.next();
}

// Configure which routes should be handled by this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)"
  ]
};
