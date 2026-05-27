import { NextRequest, NextResponse } from 'next/server';

const ADMIN_COOKIE = 'hudai_admin_session';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'hudaisifa2026';

export async function POST(request: NextRequest) {
  const { action, password } = await request.json();

  if (action === 'login') {
    if (password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true });
      response.cookies.set(ADMIN_COOKIE, 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8, // 8 saat
        path: '/',
      });
      return response;
    }
    return NextResponse.json({ success: false, error: 'Şifre hatalı' }, { status: 401 });
  }

  if (action === 'logout') {
    const response = NextResponse.json({ success: true });
    response.cookies.delete(ADMIN_COOKIE);
    return response;
  }

  return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 });
}
