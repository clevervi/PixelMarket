import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Rutas públicas
  if (
    path.startsWith('/api/auth') ||
    path === '/login' ||
    path === '/' ||
    path === '/register' ||
    path === '/vendor/apply' || // allow public vendor application page
    path.startsWith('/products') ||
    path.startsWith('/shop')
  ) {
    return NextResponse.next();
  }

  // Proteger rutas de admin
  if (path.startsWith('/admin')) {
    const user = request.cookies.get('user')?.value;
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    try {
      const userData = JSON.parse(user);
      if (userData.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Proteger rutas de vendor
  if (path.startsWith('/vendor')) {
    const user = request.cookies.get('user')?.value;
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    try {
      const userData = JSON.parse(user);
      if (userData.role !== 'vendor' && userData.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Proteger rutas de usuario autenticado
  if (path.startsWith('/my-account') || path.startsWith('/profile/orders')) {
    const user = request.cookies.get('user')?.value;
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/vendor/:path*', '/my-account/:path*', '/profile/orders/:path*'],
};
