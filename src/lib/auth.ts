import { cookies } from 'next/headers';

const COOKIE_NAME = 'janer-session';
const SESSION_VALUE = 'authenticated';

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === SESSION_VALUE;
}

export function getSessionCookieConfig() {
  return {
    name: COOKIE_NAME,
    value: SESSION_VALUE,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
  };
}
