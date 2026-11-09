import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAuth } from '@/lib/api-auth'

export async function GET() {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { data, error: dbErr } = await supabase
    .from('portfolio_projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { title, period, role, tech_stack, description } = await req.json()
  if (!title?.trim()) {
    return NextResponse.json({ error: 'title 필요' }, { status: 400 })
  }

  const { data, error: dbErr } = await supabase
    .from('portfolio_projects')
    .insert({
      user_id: userId,
      title,
      period: period ?? null,
      role: role ?? null,
      tech_stack: tech_stack ?? null,
      description: description ?? null,
    })
    .select()
    .single()

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
