'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { InterviewSession, Resume } from '@/lib/types'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { fetchJson } from '@/lib/client-fetch'

const MODE_LABELS = { technical: '기술 면접', pressure: '압박 면접' }
const MODE_COLORS = { technical: '#0891b2', pressure: '#dc2626' }

export default function InterviewPage() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [sessions, setSessions] = useState<InterviewSession[]>([])
  const [resumes, setResumes] = useState<Resume[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [form, setForm] = useState({ mode: 'technical', experience_years: 0, resume_id: '' })
  const [creating, setCreating] = useState(false)

  async function deleteSession(e: React.MouseEvent, id: number) {
    e.stopPropagation()
    if (!confirm('이 면접 이력을 삭제할까요?')) return
    await fetch(`/api/interview/sessions/${id}`, { method: 'DELETE' })
    setSessions(prev => prev.filter(s => s.id !== id))
  }

  useEffect(() => {
    fetchJson<InterviewSession[]>('/api/interview/sessions')
      .then(setSessions)
      .catch(() => setSessions([]))
    fetchJson<Resume[]>('/api/resumes')
      .then(setResumes)
      .catch(() => setResumes([]))
  }, [])

  async function startSession() {
    setCreating(true)
    const res = await fetch('/api/interview/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: form.mode,
        experience_years: Number(form.experience_years),
        resume_id: form.resume_id ? Number(form.resume_id) : null,
      }),
    })
    const session: InterviewSession = await res.json()
    setCreating(false)
    setShowDialog(false)
    router.push(`/interview/${session.id}`)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>모의 면접</h1>
        <button
          onClick={() => setShowDialog(true)}
          style={{
            padding: '8px 18px',
            background: '#4f46e5',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          + 새 면접 시작
        </button>
      </div>

      {/* 세션 목록 */}
      {sessions.length === 0 ? (
        <p style={{ color: '#9ca3af', textAlign: 'center', marginTop: 40 }}>면접 이력이 없습니다.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sessions.map(s => (
            <div
              key={s.id}
              onClick={() => router.push(`/interview/${s.id}`)}
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 10,
                padding: '12px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: isMobile ? 'flex-start' : 'center',
                flexWrap: isMobile ? 'wrap' : 'nowrap',
                gap: 12,
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              <span style={{
                padding: '3px 10px',
                borderRadius: 12,
                background: MODE_COLORS[s.mode] + '18',
                color: MODE_COLORS[s.mode],
                fontSize: 12,
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {MODE_LABELS[s.mode]}
              </span>
              <span style={{ fontSize: 13, color: '#374151' }}>
                {s.experience_years === 0 ? '신입' : `경력 ${s.experience_years}년`}
              </span>
              <span style={{
                fontSize: 12,
                color: s.status === 'completed' ? '#059669' : '#f59e0b',
                fontWeight: 600,
              }}>
                {s.status === 'completed' ? '완료' : '진행 중'}
              </span>
              <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 'auto' }}>
                {new Date(s.created_at).toLocaleDateString('ko-KR')}
              </span>
              <button
                onClick={e => deleteSession(e, s.id)}
                style={{ padding: '3px 8px', borderRadius: 6, border: '1px solid #fca5a5', background: '#fff', color: '#dc2626', cursor: 'pointer', fontSize: 12, flexShrink: 0 }}
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 새 면접 다이얼로그 */}
      {showDialog && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }}
        onClick={e => { if (e.target === e.currentTarget) setShowDialog(false) }}
        >
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: isMobile ? 'calc(100vw - 32px)' : 380, maxWidth: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, marginTop: 0 }}>새 면접 설정</h2>

            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>면접 모드</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {(['technical', 'pressure'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setForm(f => ({ ...f, mode: m }))}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 8,
                    border: '2px solid',
                    borderColor: form.mode === m ? MODE_COLORS[m] : '#e5e7eb',
                    background: form.mode === m ? MODE_COLORS[m] + '10' : '#fff',
                    color: form.mode === m ? MODE_COLORS[m] : '#374151',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  {MODE_LABELS[m]}
                </button>
              ))}
            </div>

            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>연차 (0 = 신입)</label>
            <input
              type="number"
              min={0}
              max={20}
              value={form.experience_years}
              onChange={e => setForm(f => ({ ...f, experience_years: Number(e.target.value) }))}
              style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box', marginBottom: 16 }}
            />

            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>기준 이력서 (선택)</label>
            <select
              value={form.resume_id}
              onChange={e => setForm(f => ({ ...f, resume_id: e.target.value }))}
              style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box', marginBottom: 24 }}
            >
              <option value="">선택 안 함</option>
              {resumes.map(r => (
                <option key={r.id} value={r.id}>v{r.version}{r.note ? ` — ${r.note}` : ''}</option>
              ))}
            </select>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setShowDialog(false)}
                style={{ flex: 1, padding: '9px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 14 }}
              >
                취소
              </button>
              <button
                onClick={startSession}
                disabled={creating}
                style={{ flex: 2, padding: '9px', borderRadius: 8, border: 'none', background: '#4f46e5', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 14, opacity: creating ? 0.6 : 1 }}
              >
                {creating ? 'Claude 준비 중...' : '면접 시작'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
