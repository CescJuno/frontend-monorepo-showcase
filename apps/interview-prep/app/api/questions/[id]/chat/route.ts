import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAuth } from '@/lib/api-auth'
import { chatAnswer } from '@/lib/claude'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { content } = await req.json()
  if (!content?.trim()) {
    return NextResponse.json({ error: 'content 필요' }, { status: 400 })
  }

  const { data: question } = await supabase
    .from('questions')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!question) return NextResponse.json({ error: '질문을 찾을 수 없습니다.' }, { status: 404 })

  await supabase.from('messages').insert({
    user_id: userId,
    question_id: params.id,
    role: 'user',
    content,
  })

  const { data: history } = await supabase
    .from('messages')
    .select('*')
    .eq('question_id', params.id)
    .eq('user_id', userId)
    .order('created_at')

  let answer: string
  try {
    answer = await chatAnswer(question.question, history ?? [])
  } catch (err) {
    console.error('[chat] chatAnswer 실패:', err)
    return NextResponse.json({ error: 'AI 응답 생성 실패' }, { status: 500 })
  }

  const { data: saved, error: insertError } = await supabase
    .from('messages')
    .insert({ user_id: userId, question_id: params.id, role: 'assistant', content: answer })
    .select()
    .single()

  if (insertError) {
    console.error('[chat] 메시지 저장 실패:', insertError)
    return NextResponse.json({ error: '메시지 저장 실패' }, { status: 500 })
  }

  return NextResponse.json(saved)
}
