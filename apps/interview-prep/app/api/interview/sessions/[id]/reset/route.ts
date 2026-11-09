import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAuth } from '@/lib/api-auth'
import { conductInterview } from '@/lib/claude'

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

  await supabase
    .from('interview_messages')
    .delete()
    .eq('session_id', params.id)
    .eq('user_id', userId)

  await supabase
    .from('interview_sessions')
    .update({ status: 'active', analysis: null })
    .eq('id', params.id)
    .eq('user_id', userId)

  let resumeContent = ''
  if (session.resume_id) {
    const { data: r } = await supabase
      .from('resumes')
      .select('content, refined')
      .eq('id', session.resume_id)
      .eq('user_id', userId)
      .single()
    resumeContent = r?.refined ?? r?.content ?? ''
  }

  const firstMessage = await conductInterview(session.mode, session.experience_years, resumeContent, [])

  const { data: saved } = await supabase
    .from('interview_messages')
    .insert({ user_id: userId, session_id: params.id, role: 'assistant', content: firstMessage })
    .select()
    .single()

  return NextResponse.json({ message: saved })
}
