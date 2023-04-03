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
  const result = {};
  // @ts-ignore
  req.headers.forEach((v, k) => (result[k] = v));
  // XFFのうちホワイトリストに含まれるIPと一致するものが一つもなければ 403
  if (!ip || !ip.some((i) => ipWhitelistEnv.includes(i))) {
    return NextResponse.json({
      message: '403 Forbidden',
      headers: result,
      ip,
    });
  }

  return NextResponse.next();
}
