'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import type { InterviewSession, InterviewMessage } from '@/lib/types'
import { ChatWindow } from '@/components/ChatWindow'
import { ChatInput } from '@/components/ChatInput'
import { VoiceButton } from '@/components/VoiceButton'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { fetchJson } from '@/lib/client-fetch'

const MODE_LABELS = { technical: '기술 면접', pressure: '압박 면접' }
const MODE_COLORS = { technical: '#0891b2', pressure: '#dc2626' }

export default function InterviewSessionPage() {
  const params = useParams<{ id: string }>()
  const id = params.id

  const [session, setSession] = useState<InterviewSession | null>(null)
  const [messages, setMessages] = useState<InterviewMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [voiceInput, setVoiceInput] = useState('')
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)

  const isMobile = useIsMobile()

  const { enabled: ttsEnabled, speak, toggle: toggleTts } = useSpeechSynthesis()

  const handleVoiceResult = useCallback((t: string) => setVoiceInput(t), [])
  const { listening, supported: sttSupported, toggle: toggleStt } = useSpeechRecognition({ onResult: handleVoiceResult })

  useEffect(() => {
    fetchJson<{ session: InterviewSession; messages: InterviewMessage[] }>(`/api/interview/sessions/${id}`)
      .then(({ session: s, messages: m }) => {
        setSession(s)
        setMessages(m ?? [])
        if (s?.analysis) setAnalysis(s.analysis)
      })
      .catch(() => {})
  }, [id])

  useEffect(() => {
    if (messages.length === 0) return
    const last = messages[messages.length - 1]
    if (last.role === 'assistant') speak(last.content)
  }, [messages, speak])

  async function handleSend(content: string) {
    setVoiceInput('')
    setLoading(true)
    const tempUser: InterviewMessage = { id: Date.now(), session_id: Number(id), role: 'user', content, created_at: new Date().toISOString() }
    setMessages(prev => [...prev, tempUser])

    const res = await fetch(`/api/interview/sessions/${id}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })
    const assistant: InterviewMessage = await res.json()
    setMessages(prev => [...prev.filter(m => m.id !== tempUser.id), tempUser, assistant])
    setLoading(false)
  }

  async function endInterview() {
    if (!confirm('면접을 종료하시겠습니까?')) return
    await fetch(`/api/interview/sessions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' }),
    })
    setSession(prev => prev ? { ...prev, status: 'completed' } : prev)
    setAnalyzing(true)
    const res = await fetch(`/api/interview/sessions/${id}/analyze`, { method: 'POST' })
    const data = await res.json()
    setAnalysis(data.analysis ?? data.error)
    setAnalyzing(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: isMobile ? 'auto' : 'calc(100vh - 100px)' }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
        <Link href="/interview" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none', flexShrink: 0 }}>← 목록</Link>
        {session && (
          <span style={{
            padding: '3px 10px',
            borderRadius: 12,
            background: MODE_COLORS[session.mode] + '18',
            color: MODE_COLORS[session.mode],
            fontSize: 12,
            fontWeight: 700,
          }}>
            {MODE_LABELS[session.mode]}
          </span>
        )}
        {session && (
          <span style={{ fontSize: 13, color: '#6b7280' }}>
            {session.experience_years === 0 ? '신입' : `경력 ${session.experience_years}년`}
          </span>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <button
            onClick={toggleTts}
            style={{
              padding: '5px 10px',
              borderRadius: 6,
              border: '1px solid',
              borderColor: ttsEnabled ? '#4f46e5' : '#e5e7eb',
              background: ttsEnabled ? '#e0e7ff' : '#fff',
              cursor: 'pointer',
              fontSize: 12,
              color: ttsEnabled ? '#4338ca' : '#6b7280',
            }}
          >
            🔊 {ttsEnabled ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={async () => {
              setAnalyzing(true)
              setAnalysis(null)
              const res = await fetch(`/api/interview/sessions/${id}/analyze`, { method: 'POST' })
              const data = await res.json()
              setAnalysis(data.analysis ?? data.error)
              setAnalyzing(false)
            }}
            disabled={analyzing || messages.length < 2}
            style={{
              padding: '5px 12px',
              borderRadius: 6,
              border: 'none',
              background: '#7c3aed',
              color: '#fff',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 700,
              opacity: analyzing || messages.length < 2 ? 0.5 : 1,
            }}
          >
            {analyzing ? '분석 중...' : 'AI 분석'}
          </button>
          {session?.status === 'active' && (
            <button
              onClick={endInterview}
              style={{
                padding: '5px 12px',
                borderRadius: 6,
                border: 'none',
                background: '#dc2626',
                color: '#fff',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              면접 종료
            </button>
          )}
          {session?.status === 'completed' && (
            <span style={{ fontSize: 12, color: '#059669', fontWeight: 700, padding: '5px 0' }}>완료됨</span>
          )}
        </div>
      </div>

      {/* 좌/우 레이아웃 */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 16, flex: isMobile ? undefined : 1, minHeight: 0 }}>
        {/* 왼쪽: 채팅 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: isMobile ? 300 : 0 }}>
          <ChatWindow messages={messages} loading={loading} />
          {session?.status === 'active' && (
            <>
              <ChatInput
                onSend={handleSend}
                disabled={loading}
                placeholder="답변을 입력하세요..."
                voiceSlot={sttSupported ? <VoiceButton listening={listening} onToggle={toggleStt} disabled={loading} /> : undefined}
              />
              {voiceInput && (
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                  음성: {voiceInput}
                  <button
                    onClick={() => handleSend(voiceInput)}
                    style={{ marginLeft: 8, fontSize: 12, color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer' }}
                  >전송</button>
                </div>
              )}
            </>
          )}
        </div>

        {/* 오른쪽: AI 분석 */}
        <div style={{ flex: 1, overflowY: isMobile ? 'visible' : 'auto', minWidth: 0 }}>
          {analyzing && (
            <div style={{ padding: 20, background: '#fefce8', border: '1px solid #fde047', borderRadius: 10, fontSize: 14, color: '#854d0e' }}>
              AI 면접 분석 중...
            </div>
          )}
          {analysis && !analyzing && (
            <div style={{ padding: 20, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10, whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.8 }}>
              {analysis}
            </div>
          )}
          {!analysis && !analyzing && (
            <div style={{ padding: 20, background: '#f9fafb', border: '1px dashed #e5e7eb', borderRadius: 10, fontSize: 13, color: '#9ca3af', textAlign: 'center' }}>
              AI 분석 버튼을 눌러<br />면접 피드백을 받으세요
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
