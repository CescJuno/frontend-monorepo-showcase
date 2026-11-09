import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAuth } from '@/lib/api-auth'

interface QuestionRow {
  question_progress?: { done: boolean }[] | null
  [key: string]: unknown
}

export async function GET(req: Request): Promise<NextResponse> {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')

  let query = supabase
    .from('questions')
    .select(`*, question_progress!left(done)`)
    .eq('question_progress.user_id', userId)
    .order('id')

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, error: dbErr } = await query
  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })

  // done 필드를 flat하게 변환
  const rows = (data ?? []).map((q: QuestionRow) => ({
    ...q,
    done: q.question_progress?.[0]?.done ?? false,
    question_progress: undefined,
  }))

  return NextResponse.json(rows)
}
