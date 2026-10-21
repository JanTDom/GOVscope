import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files, api auth, and login page
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname === '/login' ||
    pathname.includes('.') // images, favicons, static files
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get('govscope_session');

  if (!sessionCookie || !sessionCookie.value) {
    // For API calls, return JSON 401 instead of redirecting to login page
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Brak autoryzacji w systemie GOVscope. Wymagane hasło PDT2026.' },
        { status: 401 }
      );
    }

    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
