import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAuth } from '@/lib/api-auth'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { data: session } = await supabase
    .from('interview_sessions')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', userId)
    .single()

  if (!session) return NextResponse.json({ error: '세션을 찾을 수 없습니다.' }, { status: 404 })

  const { data: messages } = await supabase
    .from('interview_messages')
    .select('*')
    .eq('session_id', params.id)
    .eq('user_id', userId)
    .order('created_at')

  return NextResponse.json({ session, messages: messages ?? [] })
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { status } = await req.json()
  if (status !== 'completed') {
    return NextResponse.json({ error: 'status는 completed만 허용' }, { status: 400 })
  }

  await supabase
    .from('interview_sessions')
    .update({ status })
    .eq('id', params.id)
    .eq('user_id', userId)

  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { userId, error } = await requireAuth()
  if (error) return error

  await supabase
    .from('interview_sessions')
    .delete()
    .eq('id', params.id)
    .eq('user_id', userId)

  return NextResponse.json({ ok: true })
}
