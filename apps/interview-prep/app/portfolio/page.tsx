'use client'

import { useState, useEffect } from 'react'
import type { PortfolioProject } from '@/lib/types'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { fetchJson } from '@/lib/client-fetch'

const EMPTY_FORM = { title: '', period: '', role: '', tech_stack: '', description: '' }

export default function PortfolioPage() {
  const isMobile = useIsMobile()
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState<number | null>(null)

  useEffect(() => { fetchProjects() }, [])

  async function fetchProjects() {
    try {
      setProjects(await fetchJson<PortfolioProject[]>('/api/portfolio'))
    } catch {
      setProjects([])
    }
  }

  async function addProject() {
    if (!form.title.trim()) return
    setSaving(true)
    await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setForm(EMPTY_FORM)
    setSaving(false)
    await fetchProjects()
  }

  async function generateAi(id: number) {
    setGenerating(id)
    const res = await fetch(`/api/portfolio/${id}/generate`, { method: 'POST' })
    const { ai_content } = await res.json()
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ai_content } : p))
    setGenerating(null)
  }

  function exportAll() {
    window.open('/api/portfolio/export', '_blank')
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>포트폴리오</h1>
        <button
          onClick={exportAll}
          style={{
            padding: '7px 14px',
            background: '#f3f4f6',
            color: '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          전체 .md 내보내기
        </button>
      </div>

      {/* 프로젝트 추가 폼 */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14, color: '#374151' }}>프로젝트 추가</div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <input
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="프로젝트명 *"
            style={inputStyle}
          />
          <input
            value={form.period}
            onChange={e => setForm(f => ({ ...f, period: e.target.value }))}
            placeholder="기간 (예: 2024.01 ~ 2024.06)"
            style={inputStyle}
          />
          <input
            value={form.role}
            onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
            placeholder="역할 (예: 백엔드 개발자)"
            style={inputStyle}
          />
          <input
            value={form.tech_stack}
            onChange={e => setForm(f => ({ ...f, tech_stack: e.target.value }))}
            placeholder="기술스택 (예: React, Node.js, PostgreSQL)"
            style={inputStyle}
          />
        </div>
        <textarea
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="프로젝트 설명 (주요 기능, 기여 내용, 성과 등)"
          rows={3}
          style={{ ...inputStyle, width: '100%', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
        />
        <button
          onClick={addProject}
          disabled={saving || !form.title.trim()}
          style={{
            marginTop: 10,
            padding: '8px 20px',
            background: '#059669',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 14,
            opacity: saving || !form.title.trim() ? 0.6 : 1,
          }}
        >
          {saving ? '추가 중...' : '프로젝트 추가'}
        </button>
      </div>

      {/* 프로젝트 목록 */}
      {projects.length === 0 ? (
        <p style={{ color: '#9ca3af', textAlign: 'center', marginTop: 40 }}>프로젝트를 추가하세요.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {projects.map(p => (
            <div key={p.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: isMobile ? 14 : 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                    {[p.period, p.role].filter(Boolean).join(' · ')}
                  </div>
                  {p.tech_stack && (
                    <div style={{ fontSize: 12, color: '#4f46e5', marginTop: 4 }}>{p.tech_stack}</div>
                  )}
                </div>
                <button
                  onClick={() => generateAi(p.id)}
                  disabled={generating === p.id}
                  style={{
                    padding: '6px 12px',
                    background: '#4f46e5',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                    opacity: generating === p.id ? 0.6 : 1,
                    flexShrink: 0,
                  }}
                >
                  {generating === p.id ? 'Claude 생성 중...' : 'Claude 문구 생성'}
                </button>
              </div>

              {p.description && !p.ai_content && (
                <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, marginTop: 8 }}>{p.description}</div>
              )}

              {p.ai_content && (
                <div style={{
                  marginTop: 12,
                  background: '#f5f3ff',
                  border: '1px solid #ddd6fe',
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 13,
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  color: '#1f2937',
                }}>
                  <div style={{ fontSize: 11, color: '#7c3aed', fontWeight: 700, marginBottom: 6 }}>Claude 생성 문구</div>
                  {p.ai_content}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '8px 10px',
  borderRadius: 8,
  border: '1px solid #d1d5db',
  fontSize: 13,
  width: '100%',
  boxSizing: 'border-box',
}
