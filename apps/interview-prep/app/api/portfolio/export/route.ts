import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAuth } from '@/lib/api-auth'

interface PortfolioProjectRow {
  title: string
  period?: string
  role?: string
  tech_stack?: string
  ai_content?: string
  description?: string
}

export async function GET(): Promise<NextResponse> {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { data: projects } = await supabase
    .from('portfolio_projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at')

  const md = (projects ?? []).map((p: PortfolioProjectRow) => {
    const lines = [`## ${p.title}`]
    if (p.period) lines.push(`**기간:** ${p.period}`)
    if (p.role) lines.push(`**역할:** ${p.role}`)
    if (p.tech_stack) lines.push(`**기술스택:** ${p.tech_stack}`)
    if (p.ai_content) {
      lines.push('', p.ai_content)
    } else if (p.description) {
      lines.push('', p.description)
    }
    return lines.join('\n')
  }).join('\n\n---\n\n')

  return new NextResponse(md, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'attachment; filename="portfolio.md"',
    },
  })
}
