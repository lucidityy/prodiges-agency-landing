import { NextRequest, NextResponse } from 'next/server';

// Temporary simplified middleware to get the app running
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Basic security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

// Apply middleware to all routes except static files
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|fonts|manifest.json|sw.js).*)',
  ],
};