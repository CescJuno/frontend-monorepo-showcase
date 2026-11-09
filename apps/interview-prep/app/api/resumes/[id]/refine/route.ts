import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAuth } from '@/lib/api-auth'
import { refineResume } from '@/lib/claude'

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

  const refined = await refineResume(resume.content)

  await supabase.from('resumes').update({ refined }).eq('id', params.id)
  return NextResponse.json({ refined })
}
