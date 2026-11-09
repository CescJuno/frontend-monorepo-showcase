'use client'

import { useState, useEffect } from 'react'
import type { Resume, ResumeFields } from '@/lib/types'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { fetchJson } from '@/lib/client-fetch'

type Tab = 'edit' | 'summary' | 'refine' | 'propagate'

export default function ResumePage() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selected, setSelected] = useState<Resume | null>(null)
  const [tab, setTab] = useState<Tab>('edit')
  const [editContent, setEditContent] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [summaryResult, setSummaryResult] = useState('')
  const [refineResult, setRefineResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [fields, setFields] = useState<ResumeFields | null>(null)
  const [fieldsLoading, setFieldsLoading] = useState(false)
  const [fieldsError, setFieldsError] = useState('')
  const isMobile = useIsMobile()

  useEffect(() => { fetchResumes() }, [])

  async function fetchResumes() {
    try {
      const data = await fetchJson<Resume[]>('/api/resumes')
      setResumes(data)
      if (data.length > 0 && !selected) {
        select(data[0])
      }
    } catch {
      setResumes([])
    }
  }

  function select(r: Resume) {
    setSelected(r)
    setEditContent(r.content)
    setNote(r.note ?? '')
    setSummaryResult(r.summary ?? '')
    setRefineResult(r.refined ?? '')
    setFields(null)
    setFieldsError('')
    setTab('edit')
  }

  async function saveNew() {
    if (!editContent.trim()) return
    setSaving(true)
    await fetch('/api/resumes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editContent, note }),
    })
    setSaving(false)
    setNote('')
    await fetchResumes()
  }

  async function requestSummary() {
    if (!selected) return
    setLoading(true)
    setSummaryResult('')
    const res = await fetch(`/api/resumes/${selected.id}/summarize`, { method: 'POST' })
    const data = await res.json()
    setSummaryResult(data.summary ?? data.error)
    setLoading(false)
  }

  async function requestRefine() {
    if (!selected) return
    setLoading(true)
    setRefineResult('')
    const res = await fetch(`/api/resumes/${selected.id}/refine`, { method: 'POST' })
    const data = await res.json()
    setRefineResult(data.refined ?? data.error)
    setLoading(false)
  }

  async function requestFields() {
    if (!selected) return
    setFieldsLoading(true)
    setFieldsError('')
    setFields(null)
    try {
      const res = await fetch(`/api/resumes/${selected.id}/fields`, { method: 'POST' })
      const data = await res.json().catch(() => null)
      if (data?.fields) setFields(data.fields)
      else setFieldsError(data?.error ?? `필드 추출 실패 (status ${res.status})`)
    } catch (e) {
      setFieldsError(e instanceof Error ? e.message : '필드 추출 실패')
    }
    setFieldsLoading(false)
  }

  function downloadFields() {
    if (!selected || !fields) return
    const blob = new Blob([JSON.stringify(fields, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `resume_v${selected.version}_fields.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function downloadMd() {
    if (!selected) return
    const blob = new Blob([selected.content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `resume_v${selected.version}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setParsing(true)
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/resumes/parse', { method: 'POST', body: form })
    const data = await res.json()
    if (data.text) setEditContent(data.text)
    else alert(data.error ?? '파일 파싱 실패')
    setParsing(false)
    e.target.value = ''
  }

  const TAB_LABELS: Record<Tab, string> = { edit: '편집', summary: '요약·분석', refine: '보강', propagate: '전파' }

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 16 }}>
      {/* 사이드바 */}
      <aside style={isMobile
        ? { display: 'flex', flexDirection: 'row', overflowX: 'auto', gap: 8, paddingBottom: 8 }
        : { width: 180, flexShrink: 0 }
      }>
        {!isMobile && (
          <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13, color: '#6b7280' }}>버전 목록</div>
        )}
        {resumes.length === 0 && (
          <div style={{ fontSize: 13, color: '#9ca3af' }}>저장된 이력서 없음</div>
        )}
        {resumes.map(r => (
          <div
            key={r.id}
            onClick={() => select(r)}
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              cursor: 'pointer',
              background: selected?.id === r.id ? '#e0e7ff' : 'transparent',
              marginBottom: isMobile ? 0 : 4,
              flexShrink: isMobile ? 0 : undefined,
              fontSize: 14,
              fontWeight: selected?.id === r.id ? 600 : 400,
              color: selected?.id === r.id ? '#4338ca' : '#374151',
              whiteSpace: isMobile ? 'nowrap' : undefined,
            }}
          >
            v{r.version}
            {r.note && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{r.note}</div>}
          </div>
        ))}
      </aside>

      {/* 메인 */}
      <div style={{ flex: 1 }}>
        {/* 탭 */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '1px solid #e5e7eb', paddingBottom: 0 }}>
          {(['edit', 'summary', 'refine', 'propagate'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '8px 16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: tab === t ? 700 : 400,
                color: tab === t ? '#4f46e5' : '#6b7280',
                borderBottom: tab === t ? '2px solid #4f46e5' : '2px solid transparent',
                marginBottom: -1,
                fontSize: 14,
              }}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        {/* 편집 탭 */}
        {tab === 'edit' && (
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 10,
              padding: '10px 14px',
              border: '1px dashed #d1d5db',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 13,
              color: '#6b7280',
              background: '#f9fafb',
            }}>
              <span style={{ fontSize: 18 }}>📄</span>
              {parsing ? '파싱 중...' : 'PDF / TXT / MD 파일 불러오기'}
              <input
                type="file"
                accept=".pdf,.txt,.md"
                onChange={handleFileUpload}
                disabled={parsing}
                style={{ display: 'none' }}
              />
            </label>
            <textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              placeholder="이력서 내용을 입력하거나 붙여넣으세요 (마크다운 지원)..."
              style={{
                width: '100%',
                minHeight: isMobile ? 250 : 420,
                padding: 12,
                borderRadius: 8,
                border: '1px solid #d1d5db',
                fontFamily: 'monospace',
                fontSize: 13,
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
              <input
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="메모 (선택)"
                style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13 }}
              />
              <button
                onClick={saveNew}
                disabled={saving || !editContent.trim()}
                style={{
                  padding: '7px 16px',
                  background: '#4f46e5',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 13,
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? '저장 중...' : '새 버전 저장'}
              </button>
              {selected && (
                <button
                  onClick={downloadMd}
                  style={{
                    padding: '7px 14px',
                    background: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 13,
                  }}
                >
                  .md 다운로드
                </button>
              )}
            </div>
          </div>
        )}

        {/* 요약 탭 */}
        {tab === 'summary' && (
          <div>
            {!selected ? (
              <p style={{ color: '#9ca3af' }}>먼저 이력서를 저장하세요.</p>
            ) : (
              <>
                <button
                  onClick={requestSummary}
                  disabled={loading}
                  style={{
                    padding: '8px 20px',
                    background: '#0891b2',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 14,
                    marginBottom: 16,
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? 'Claude 분석 중...' : 'Claude 요약 요청'}
                </button>
                {summaryResult && (
                  <div style={{
                    background: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    borderRadius: 10,
                    padding: 20,
                    whiteSpace: 'pre-wrap',
                    fontSize: 14,
                    lineHeight: 1.7,
                  }}>
                    {summaryResult}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* 보강 탭 */}
        {tab === 'refine' && (
          <div>
            {!selected ? (
              <p style={{ color: '#9ca3af' }}>먼저 이력서를 저장하세요.</p>
            ) : (
              <>
                <button
                  onClick={requestRefine}
                  disabled={loading}
                  style={{
                    padding: '8px 20px',
                    background: '#059669',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 14,
                    marginBottom: 16,
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? 'Claude 보강 중...' : 'Claude 보강 요청'}
                </button>
                {refineResult && (
                  <div style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: 10,
                    padding: 20,
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    fontSize: 13,
                    lineHeight: 1.7,
                  }}>
                    {refineResult}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* 전파 탭 */}
        {tab === 'propagate' && (
          <div>
            {!selected ? (
              <p style={{ color: '#9ca3af' }}>먼저 이력서를 저장하세요.</p>
            ) : (
              <>
                <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>
                  이력서를 원티드/사람인/리맴버 프로필 입력용 구조화 데이터로 변환합니다.
                  다운로드한 JSON은 <code>scripts/propagate/wanted.mjs</code>의 <code>fill</code>/<code>overwrite</code> 커맨드 인자로 그대로 사용할 수 있습니다.
                </p>
                <button
                  onClick={requestFields}
                  disabled={fieldsLoading}
                  style={{
                    padding: '8px 20px',
                    background: '#7c3aed',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 14,
                    marginBottom: 16,
                    opacity: fieldsLoading ? 0.6 : 1,
                  }}
                >
                  {fieldsLoading ? 'Claude 추출 중...' : '필드 추출'}
                </button>
                {fieldsError && (
                  <p style={{ color: '#dc2626', fontSize: 13 }}>{fieldsError}</p>
                )}
                {fields && (
                  <>
                    <div style={{
                      background: '#faf5ff',
                      border: '1px solid #e9d5ff',
                      borderRadius: 10,
                      padding: 20,
                      marginBottom: 12,
                    }}>
                      <pre style={{ margin: 0, fontSize: 12, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {JSON.stringify(fields, null, 2)}
                      </pre>
                    </div>
                    <button
                      onClick={downloadFields}
                      style={{
                        padding: '7px 14px',
                        background: '#f3f4f6',
                        color: '#374151',
                        border: '1px solid #e5e7eb',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: 13,
                      }}
                    >
                      fields.json 다운로드
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
