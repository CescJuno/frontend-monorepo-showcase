import { NextResponse } from 'next/server'
import { getAuthUserId } from './auth'

/** API Route 인증 헬퍼. user_id 반환 또는 401 Response 반환 */
export async function requireAuth(): Promise<
  { userId: string; error: null } | { userId: null; error: NextResponse }
> {
  const userId = await getAuthUserId()
  if (!userId) {
    return {
      userId: null,
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }
  return { userId, error: null }
}
