import { NextRequest, NextResponse } from 'next/server';

const ADMIN_COOKIE = 'hudai_admin_session';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || entry.resetAt < now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 5;
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Gecersiz istek' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Gecersiz istek' }, { status: 400 });
  }

  const { action, password } = body;

  if (typeof action !== 'string' || !['login', 'logout'].includes(action)) {
    return NextResponse.json({ error: 'Gecersiz islem' }, { status: 400 });
  }

  if (action === 'login') {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: 'Cok fazla deneme. 15 dakika bekleyin.' },
        { status: 429 }
      );
    }

    if (!ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: 'Sunucu yapilandirma hatasi' }, { status: 500 });
    }

    if (password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true });
      response.cookies.set(ADMIN_COOKIE, 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8,
        path: '/',
      });
      return response;
    }
    return NextResponse.json({ success: false, error: 'Sifre hatali' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete(ADMIN_COOKIE);
  return response;
}
