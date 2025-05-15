import { NextResponse } from 'next/server';

// Define paths for routing middleware if needed
const ALLOWED_PATHS = [
  '/london-scotland-trip',
  '/thank-you-citizen',
  '/thank-you-resident',
  '/cruise-italy-spain-france',
  '/turkey-trip',
  '/georgia-trip',
  '/bosnia-trip',
  '/trabzon-wider-north-turkey',
  '/italy-trip',
  '/poland-trip',
  '/azerbaijan-trip',
  '/',
  '/schengen-visa-trip',
  '/international-licence-trip',
  '/russia-trip',
];

// This middleware only handles routing, not CSRF protection
// CSRF protection is applied directly to API routes with the csrf wrapper
export function middleware(req) {
  // Basic middleware for any routing needs
  return NextResponse.next();
}

// Only apply middleware to frontend routes if needed
// CSRF protection is handled in the API routes directly
export const config = {
  matcher: [],
};
