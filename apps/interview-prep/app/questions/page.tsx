'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Question } from '@/lib/types'
import { fetchJson } from '@/lib/client-fetch'

const CATEGORIES = ['all', 'javascript', 'react', 'typescript', 'network', 'cs', 'coding'] as const
const CATEGORY_LABELS: Record<string, string> = {
  all: '전체', javascript: 'JavaScript', react: 'React', typescript: 'TypeScript',
  network: '네트워크', cs: 'CS 기초', coding: '코딩',
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [category, setCategory] = useState('all')

  useEffect(() => {
    fetchJson<Question[]>(`/api/questions?category=${category}`)
      .then(setQuestions)
      .catch(() => setQuestions([]))
  }, [category])

  const doneCount = questions.filter(q => q.done).length

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>질문 학습</h1>
        <span style={{ fontSize: 13, color: '#6b7280' }}>
          완료 {doneCount} / {questions.length}
        </span>
      </div>

      {/* 진행률 바 */}
      {questions.length > 0 && (
        <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3, marginBottom: 16, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${(doneCount / questions.length) * 100}%`,
            background: '#4f46e5',
            borderRadius: 3,
            transition: 'width 0.3s',
          }} />
        </div>
      )}

      {/* 카테고리 탭 */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: '5px 12px',
              borderRadius: 20,
              border: '1px solid',
              borderColor: category === cat ? '#4f46e5' : '#e5e7eb',
              background: category === cat ? '#4f46e5' : '#fff',
              color: category === cat ? '#fff' : '#374151',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: category === cat ? 600 : 400,
            }}
          >
            {CATEGORY_LABELS[cat] ?? cat}
          </button>
        ))}
      </div>

      {/* 질문 목록 */}
      {questions.length === 0 ? (
        <p style={{ color: '#9ca3af', textAlign: 'center', marginTop: 40 }}>
          질문이 없습니다. <code>pnpm db:seed</code>으로 seed 데이터를 추가하세요.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {questions.map(q => (
            <Link key={q.id} href={`/questions/${q.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 10,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
                transition: 'box-shadow 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
              >
                <span style={{ fontSize: 18 }}>{q.done ? '✅' : '⬜'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: '#111827', fontWeight: 500 }}>{q.question}</div>
                  <span style={{
                    fontSize: 11,
                    color: '#6b7280',
                    background: '#f3f4f6',
                    padding: '2px 6px',
                    borderRadius: 4,
                    marginTop: 4,
                    display: 'inline-block',
                  }}>
                    {CATEGORY_LABELS[q.category] ?? q.category}
                  </span>
                </div>
                <span style={{ color: '#d1d5db', fontSize: 16 }}>→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
