import { NextResponse } from 'next/server';
import { verifyToken, getAuthToken } from './lib/auth';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip auth check for public routes
  if (
    pathname.startsWith('/admin/login') ||
    pathname.startsWith('/api/auth/login') ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  // Check auth for all /admin routes
  if (pathname.startsWith('/admin')) {
    const token = getAuthToken(request);
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }

    // Attach userId to request headers for API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.userId);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Check auth for API routes (except login)
  if (pathname.startsWith('/api') && !pathname.startsWith('/api/auth/login')) {
    const token = getAuthToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.userId);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};

