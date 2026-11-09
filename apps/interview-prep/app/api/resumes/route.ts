import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAuth } from '@/lib/api-auth'

export async function GET() {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { data, error: dbErr } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', userId)
    .order('version', { ascending: false })

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { content, note } = await req.json()
  if (!content?.trim()) {
    return NextResponse.json({ error: 'content 필요' }, { status: 400 })
  }

  const { data: maxRow } = await supabase
    .from('resumes')
    .select('version')
    .eq('user_id', userId)
    .order('version', { ascending: false })
    .limit(1)
    .single()

  const version = (maxRow?.version ?? 0) + 1

  const { data, error: dbErr } = await supabase
    .from('resumes')
    .insert({ user_id: userId, content, version, note: note ?? null })
    .select()
    .single()

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
