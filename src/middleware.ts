import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('janer-session');
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isApi = request.nextUrl.pathname.startsWith('/api');

  if (isApi) return NextResponse.next();

  if (!session || session.value !== 'authenticated') {
    if (!isLoginPage) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  if (isLoginPage) {
    return NextResponse.redirect(new URL('/viagens', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
