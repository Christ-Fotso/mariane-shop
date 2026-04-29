import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { readFileSync } from 'fs';

function getJwtSecret(): string {
  // Try Docker secret file first, then env var for local dev
  try {
    return readFileSync('/run/secrets/JWT_SECRET', 'utf-8').trim();
  } catch {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not configured');
    return secret;
  }
}

/**
 * Next.js 16 Proxy (formerly middleware).
 * Fully verifies the JWT signature using jose before granting access to /admin routes.
 */
export async function proxy(request: NextRequest) {
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';

  if (!isAdminPath || isLoginPage) {
    return NextResponse.next();
  }

  const token = request.cookies.get('admin_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  try {
    const secret = new TextEncoder().encode(getJwtSecret());
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    // Token invalid or expired — clear cookie and redirect
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.delete('admin_token');
    return response;
  }
}

export const config = {
  matcher: '/admin/:path*',
};
