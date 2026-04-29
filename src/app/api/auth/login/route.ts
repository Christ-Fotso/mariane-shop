import { NextResponse } from 'next/server';
import { LoginAdminUseCase } from '@/core/application/use-cases/LoginAdminUseCase';
import { checkRateLimit } from '@/core/infrastructure/auth/rateLimiter';

export async function POST(request: Request) {
  try {
    // Rate limiting: identify by IP
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';

    const { allowed, retryAfterMs } = checkRateLimit(ip);
    if (!allowed) {
      const retryAfterSec = Math.ceil((retryAfterMs ?? 0) / 1000);
      return NextResponse.json(
        { error: `Trop de tentatives. Réessayez dans ${retryAfterSec} secondes.` },
        { status: 429, headers: { 'Retry-After': String(retryAfterSec) } }
      );
    }

    const body = await request.json();
    const { username, password } = body;

    // Basic input validation
    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Identifiants requis' }, { status: 400 });
    }

    if (username.length > 100 || password.length > 200) {
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 400 });
    }

    const useCase = new LoginAdminUseCase();
    const token = await useCase.execute(username.trim(), password);

    if (!token) {
      // Generic message to not reveal whether the user exists
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true }, { status: 200 });

    // Secure HTTP-only cookie
    response.cookies.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
