import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient | null = null

// 서버 전용 — service_role 키로 RLS bypass
// 클라이언트 컴포넌트에서 import 금지
export function getSupabase() {
  if (!_supabase) {
    const supabaseUrl = process.env.SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    _supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    })
  }
  return _supabase
}

// 하위 호환 — 기존 import 유지
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getSupabase() as any)[prop]
  },
})
