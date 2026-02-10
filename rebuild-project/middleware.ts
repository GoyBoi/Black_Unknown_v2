// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Handle robots.txt
  if (request.nextUrl.pathname === '/robots.txt') {
    const robotsTxt = `
User-agent: *
Allow: /
Sitemap: https://mmwafrika.com/sitemap.xml
    `.trim();

    return new NextResponse(robotsTxt, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  // Handle humans.txt
  if (request.nextUrl.pathname === '/humans.txt') {
    const humansTxt = `
/* TEAM */
Developer: MMWAFRIKA PRIDE
Site: https://mmwafrika.com
Twitter: @mmwafrika
Location: South Africa

/* THANKS */
Next.js, Tailwind CSS, React

/* SITE */
Last update: ${new Date().toISOString().split('T')[0]}
Standards: HTML5, CSS3, ES2015
Components: React, TypeScript
Software: VS Code, Figma
    `.trim();

    return new NextResponse(humansTxt, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

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
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|humans.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}