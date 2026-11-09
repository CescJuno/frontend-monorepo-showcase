import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'

export async function POST(req: Request) {
  const { error } = await requireAuth()
  if (error) return error

  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'file 필요' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    const { default: pdfParse } = await import('pdf-parse')
    const result = await pdfParse(buffer)
    return NextResponse.json({ text: result.text.trim() })
  }

  if (
    file.type === 'text/plain' ||
    file.name.endsWith('.txt') ||
    file.name.endsWith('.md')
  ) {
    return NextResponse.json({ text: buffer.toString('utf-8').trim() })
  }

  return NextResponse.json({ error: 'PDF 또는 TXT/MD 파일만 지원합니다.' }, { status: 400 })
}
