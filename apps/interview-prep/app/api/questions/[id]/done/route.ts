import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAuth } from '@/lib/api-auth'

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { data: progress } = await supabase
    .from('question_progress')
    .select('done')
    .eq('user_id', userId)
    .eq('question_id', params.id)
    .single()

  const newDone = !(progress?.done ?? false)

  await supabase.from('question_progress').upsert({
    user_id: userId,
    question_id: params.id,
    done: newDone,
  })

  return NextResponse.json({ done: newDone })
}
