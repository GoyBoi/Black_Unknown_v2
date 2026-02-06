// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Set South African timezone as default
  const response = NextResponse.next();
  response.headers.set('X-Timezone', 'Africa/Johannesburg');
  
  // Set country code header for South Africa
  response.headers.set('X-Country', 'ZA');
  
  // Set currency header for ZAR
  response.headers.set('X-Currency', 'ZAR');
  
  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}