import NextAuth from 'next-auth'
import { getAuthOptions } from '@/lib/auth'

function handler(req: Request, ctx: { params: Record<string, string> }): Promise<Response> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- next-auth 핸들러 시그니처 어댑팅
  return NextAuth(req as any, ctx as any, getAuthOptions())
}

export { handler as GET, handler as POST }
