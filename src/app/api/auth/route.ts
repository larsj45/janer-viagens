import { NextResponse } from 'next/server';
import { getSessionCookieConfig } from '@/lib/auth';

export async function POST(request: Request) {
  const { password } = await request.json();
  const sitePassword = process.env.SITE_PASSWORD;

  if (!sitePassword) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  if (password !== sitePassword) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  const config = getSessionCookieConfig();
  response.cookies.set(config);
  return response;
}
