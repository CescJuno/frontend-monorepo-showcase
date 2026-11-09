import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const DATA_DIR = path.resolve(__dirname, '../data')

const CATEGORY_MAP: Record<string, string> = {
  'javascript-basics': 'javascript',
  'react-frontend': 'react',
  'typescript-fundamentals': 'typescript',
  'cs-fundamentals': 'cs',
  'network': 'network',
  'coding-problems': 'coding',
  'olive-young': 'olive-young',
}

function parseMarkdown(content: string): { question: string; answer: string }[] {
  const results: { question: string; answer: string }[] = []
  const lines = content.split('\n')
  let currentQuestion: string | null = null
  let answerLines: string[] = []

  for (const line of lines) {
    if (line.startsWith('### ')) {
      if (currentQuestion) {
        results.push({ question: currentQuestion, answer: answerLines.join('\n').trim() })
      }
      currentQuestion = line.replace('### ', '').trim()
      answerLines = []
    } else if (currentQuestion) {
      answerLines.push(line)
    }
  }
  if (currentQuestion) {
    results.push({ question: currentQuestion, answer: answerLines.join('\n').trim() })
  }
  return results
}

async function seed() {
  if (!fs.existsSync(DATA_DIR)) {
    console.log(`data/ 폴더가 없습니다: ${DATA_DIR}`)
    return
  }

  const files = fs.readdirSync(DATA_DIR).filter((f: string) => f.endsWith('.md'))
  if (files.length === 0) {
    console.log('data/ 폴더에 .md 파일이 없습니다.')
    return
  }

  let total = 0
  for (const file of files) {
    const category = CATEGORY_MAP[path.basename(file, '.md')] ?? path.basename(file, '.md')
    const items = parseMarkdown(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8'))

    const rows = items.map(item => ({ category, question: item.question, answer: item.answer }))
    const { error } = await supabase.from('questions').upsert(rows, { onConflict: 'question' })

    if (error) console.error(`  ${file} 오류:`, error.message)
    else console.log(`  ${file} → ${items.length}개 (category: ${category})`)
    total += items.length
  }
  console.log(`\n총 ${total}개 질문 seed 완료`)
}

seed()
