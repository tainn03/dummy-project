import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes that require authentication
const protectedRoutes = ["/dashboard", "/tasks", "/profile"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Get token from cookies or header (for client-side, we'll handle this differently)
  // Note: In a real app with server-side authentication, you'd check cookies here
  // For this mock implementation, we'll let the client-side AuthGuard handle the protection

  if (isProtectedRoute) {
    // In a real implementation, you would check for authentication here
    // For now, we'll let the client-side handle it
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    // Match all routes except static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
