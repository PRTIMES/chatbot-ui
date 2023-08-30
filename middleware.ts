import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/'],
};

// IP ホワイトリストで検証 → 不正であれば BASIC 認証
export default async function middleware(req: NextRequest) {
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  // IP ホワイトリスト検証
  const ipWhitelist = process.env.IP_WHITELIST?.split(',');
  const reqIps = req.headers.get('x-forwarded-for')?.split(', ');
  if (ipWhitelist !== undefined && reqIps !== undefined) {
    // IP ホワイトリストに含まれていれば認証スキップ
    if (reqIps.some((ip) => ipWhitelist.includes(ip))) {
      return NextResponse.next();
    }
  }

  // BASIC 認証
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
