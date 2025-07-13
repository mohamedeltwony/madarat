import { NextResponse } from 'next/server';

// Site is in maintenance mode - redirect all traffic to coming soon page
export function middleware(req) {
  const { pathname } = req.nextUrl;
  
  // Allow access to the coming soon page itself to prevent redirect loops
  if (pathname === '/coming-soon') {
    return NextResponse.next();
  }
  
  // Allow access to static files, API routes, and Next.js internal routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/documents') ||
    pathname.startsWith('/public') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.map') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.gif') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.ico')
  ) {
    return NextResponse.next();
  }
  
  // Redirect all other requests to the coming soon page
  const comingSoonUrl = new URL('/coming-soon', req.url);
  return NextResponse.redirect(comingSoonUrl);
}

// Apply middleware to all routes except static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
