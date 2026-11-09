// SQLite → Supabase 전환
// 기존 node:sqlite는 제거. 모든 DB 접근은 lib/supabase.ts 경유.
export { supabase as db } from './supabase'
