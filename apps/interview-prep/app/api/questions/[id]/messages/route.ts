import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAuth } from '@/lib/api-auth'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { data, error: dbErr } = await supabase
    .from('messages')
    .select('*')
    .eq('question_id', params.id)
    .eq('user_id', userId)
    .order('created_at')

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { userId, error } = await requireAuth()
  if (error) return error

  await supabase
    .from('messages')
    .delete()
    .eq('question_id', params.id)
    .eq('user_id', userId)

  return NextResponse.json({ ok: true })
}
