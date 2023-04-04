import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/'],
};

// BASIC 認証
export default async function middleware(req: NextRequest) {
  const authorizationHeader = req.headers.get('authorization')?.split(' ')[1];
  if (authorizationHeader) {
    const [user, pass] = atob(authorizationHeader).split(':');

    if (
      user === process.env.BASIC_AUTH_USER &&
      pass === process.env.BASIC_AUTH_PASS
    ) {
      return NextResponse.next();
    }
  }

  const url = req.nextUrl;
  url.pathname = '/api/unauthorized';

  return NextResponse.rewrite(url);
}
