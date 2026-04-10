import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
// import { routing } from './src/i18n/routing';
import { routing } from './i18n/routing';

const nextIntlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  // Handle admin routes separately
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip auth check for login page and API routes
    if (
      request.nextUrl.pathname === '/admin/login' ||
      request.nextUrl.pathname.startsWith('/admin/login/') ||
      request.nextUrl.pathname.startsWith('/api/')
    ) {
      return NextResponse.next();
    }

    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Basic token validation (full validation happens server-side)
    try {
      // Just check if token exists and has some content
      if (token.length < 10) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return NextResponse.next();
  }

  // Handle i18n routing for regular pages
  return nextIntlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/admin/:path*'],
};
