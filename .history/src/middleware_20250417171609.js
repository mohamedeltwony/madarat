import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server' // Remove type import

// Define the paths that should NOT be redirected
const ALLOWED_PATHS = [
  '/london-scotland-trip', // The target page itself
  '/thank-you-citizen',
  '/thank-you-resident',
];

// Define paths/patterns to exclude from the middleware altogether (e.g., static assets, API routes)
// This helps avoid unnecessary middleware execution.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Also exclude paths containing a dot (.), which are likely static files.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};

export function middleware(request) {
  // Brace on new line
  // Remove type annotation
  const { pathname } = request.nextUrl;

  // Check if the current path is the target or one of the allowed thank you pages
  if (ALLOWED_PATHS.includes(pathname)) {
    // If it's an allowed path, do nothing and let the request proceed
    return NextResponse.next();
  }

  // If it's not an allowed path, redirect to the london-scotland-trip page
  const redirectUrl = new URL('/london-scotland-trip', request.url);

  console.log(`Redirecting from ${pathname} to ${redirectUrl.toString()}`); // Added blank line above
  return NextResponse.redirect(redirectUrl);
}
