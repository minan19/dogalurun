import { NextRequest, NextResponse } from 'next/server';

const ADMIN_COOKIE = 'hudai_admin_session';

export function checkAdminAuth(req: NextRequest): NextResponse | null {
  const session = req.cookies.get(ADMIN_COOKIE);
  if (!session || session.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
