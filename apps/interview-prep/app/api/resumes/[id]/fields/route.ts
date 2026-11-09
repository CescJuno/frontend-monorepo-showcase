import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAuth } from '@/lib/api-auth'
import { extractResumeFields } from '@/lib/claude'

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { data: resume } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', userId)
    .single()

  if (!resume) return NextResponse.json({ error: '이력서를 찾을 수 없습니다.' }, { status: 404 })

  try {
    const fields = await extractResumeFields(resume.refined ?? resume.content)
    return NextResponse.json({ fields })
  } catch (e) {
    console.error('extractResumeFields 실패:', e)
    const message = e instanceof Error ? e.message : '필드 추출 실패'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
