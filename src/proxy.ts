import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

const ADMIN_COOKIE = 'hudai_admin_session';

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin rotaları için auth kontrolü
  if (pathname.startsWith('/admin')) {
    // Login sayfasına her zaman izin ver
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    const session = request.cookies.get(ADMIN_COOKIE);
    if (!session || session.value !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // Diğer tüm rotalar için next-intl
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/',
    '/(tr|en|ar|ru)/:path*',
  ],
};
