import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAuth } from '@/lib/api-auth'
import { analyzeInterview } from '@/lib/claude'

export async function POST(_req: Request, { params }: { params: { id: string } }) {
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

  if (!messages || messages.length < 2) {
    return NextResponse.json({ error: '분석할 대화 내용이 부족합니다.' }, { status: 400 })
  }

  const analysis = await analyzeInterview(session.mode, messages)

  await supabase
    .from('interview_sessions')
    .update({ analysis })
    .eq('id', params.id)
    .eq('user_id', userId)

  return NextResponse.json({ analysis })
}
