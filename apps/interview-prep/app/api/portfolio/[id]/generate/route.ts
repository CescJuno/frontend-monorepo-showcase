import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAuth } from '@/lib/api-auth'
import { generatePortfolio } from '@/lib/claude'

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { data: project } = await supabase
    .from('portfolio_projects')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', userId)
    .single()

  if (!project) return NextResponse.json({ error: '프로젝트를 찾을 수 없습니다.' }, { status: 404 })

  const aiContent = await generatePortfolio({
    title: project.title,
    period: project.period ?? undefined,
    role: project.role ?? undefined,
    tech_stack: project.tech_stack ?? undefined,
    description: project.description ?? undefined,
  })

  await supabase
    .from('portfolio_projects')
    .update({ ai_content: aiContent })
    .eq('id', params.id)
    .eq('user_id', userId)

  return NextResponse.json({ ai_content: aiContent })
}
