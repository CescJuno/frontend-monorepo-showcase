import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAuth } from '@/lib/api-auth'
import { conductInterview } from '@/lib/claude'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { content } = await req.json()
  if (!content?.trim()) {
    return NextResponse.json({ error: 'content 필요' }, { status: 400 })
  }

  const { data: session } = await supabase
    .from('interview_sessions')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', userId)
    .single()

  if (!session) return NextResponse.json({ error: '세션을 찾을 수 없습니다.' }, { status: 404 })
  if (session.status === 'completed') {
    return NextResponse.json({ error: '완료된 세션입니다.' }, { status: 400 })
  }

  await supabase.from('interview_messages').insert({
    user_id: userId,
    session_id: params.id,
    role: 'user',
    content,
  })

  const { data: history } = await supabase
    .from('interview_messages')
    .select('*')
    .eq('session_id', params.id)
    .eq('user_id', userId)
    .order('created_at')

  let resumeContent = ''
  if (session.resume_id) {
    const { data: r } = await supabase
      .from('resumes')
      .select('content')
      .eq('id', session.resume_id)
      .single()
    resumeContent = r?.content ?? ''
  }

  const answer = await conductInterview(session.mode, session.experience_years, resumeContent, history ?? [])

  const { data: saved } = await supabase
    .from('interview_messages')
    .insert({ user_id: userId, session_id: params.id, role: 'assistant', content: answer })
    .select()
    .single()

  return NextResponse.json(saved)
}
