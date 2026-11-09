import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAuth } from '@/lib/api-auth'
import { conductInterview } from '@/lib/claude'

export async function GET() {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { data, error: dbErr } = await supabase
    .from('interview_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { mode, experience_years, resume_id } = await req.json()
  if (!mode || experience_years == null) {
    return NextResponse.json({ error: 'mode, experience_years 필요' }, { status: 400 })
  }

  const { data: session, error: dbErr } = await supabase
    .from('interview_sessions')
    .insert({ user_id: userId, mode, experience_years, resume_id: resume_id ?? null })
    .select()
    .single()

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })

  let resumeContent = ''
  if (resume_id) {
    const { data: r } = await supabase
      .from('resumes')
      .select('content, refined')
      .eq('id', resume_id)
      .eq('user_id', userId)
      .single()
    resumeContent = r?.refined ?? r?.content ?? ''
  }

  const firstMessage = await conductInterview(mode, experience_years, resumeContent, [])
  await supabase.from('interview_messages').insert({
    user_id: userId,
    session_id: session.id,
    role: 'assistant',
    content: firstMessage,
  })

  return NextResponse.json(session, { status: 201 })
}
