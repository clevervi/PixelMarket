import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public routes (even though they match /vendor/:path*)
  if (path === '/vendor/apply' || path === '/vendor/status') {
    return NextResponse.next();
  }

  const user = getAuthUser(request);

  // Require auth for all matched routes
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Protect admin routes
  if (path.startsWith('/admin')) {
    if (user.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protect vendor routes
  if (path.startsWith('/vendor')) {
    if (user.role !== 'vendor' && user.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protected authenticated user routes
  if (path.startsWith('/my-account') || path.startsWith('/profile/orders')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/vendor/:path*', '/my-account/:path*', '/profile/orders/:path*'],
};
