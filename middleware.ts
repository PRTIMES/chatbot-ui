import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/'],
};

// IP制限を行うミドルウェア
export default async function middleware(req: NextRequest) {
  // 開発環境でスキップ
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  const ipWhitelistEnv = process.env.IP_WHITELIST?.split(',');
  // IPホワイトリストの環境変数が設定されいていなければスキップ
  if (!ipWhitelistEnv) {
    return NextResponse.next();
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',');
  // XFFのうちホワイトリストに含まれるIPと一致するものが一つもなければ 403
  if (!ip || !ip.some((i) => ipWhitelistEnv.includes(i))) {
    return NextResponse.json({
      message: '403 Forbidden',
      headers: req.headers.get('x-forwarded-for'),
      ip,
    });
  }

  return NextResponse.next();
}
