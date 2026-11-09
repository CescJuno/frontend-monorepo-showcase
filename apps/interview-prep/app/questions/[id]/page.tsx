'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import type { Question } from '@/lib/types'
import { ChatWindow } from '@/components/ChatWindow'
import { ChatInput } from '@/components/ChatInput'
import { VoiceButton } from '@/components/VoiceButton'
import { useChat } from '@/hooks/useChat'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis'
import { fetchJson } from '@/lib/client-fetch'

type Mode = 'chat' | 'flashcard'

export default function QuestionChatPage() {
  const params = useParams<{ id: string }>()
  const id = params.id

  const [question, setQuestion] = useState<Question | null>(null)
  const [voiceInput, setVoiceInput] = useState('')
  const [mode, setMode] = useState<Mode>('flashcard')

  const { messages, loading, fetchMessages, sendMessage, clearMessages } = useChat(
    `/api/questions/${id}/chat`,
    `/api/questions/${id}/messages`,
  )

  const { enabled: ttsEnabled, speak, toggle: toggleTts } = useSpeechSynthesis()

  const handleVoiceResult = useCallback((transcript: string) => {
    setVoiceInput(transcript)
  }, [])

  const { listening, supported: sttSupported, toggle: toggleStt } = useSpeechRecognition({
    onResult: handleVoiceResult,
  })

  useEffect(() => {
    fetchJson<Question[]>(`/api/questions?category=all`)
      .then(qs => {
        const q = qs.find(x => String(x.id) === id)
        if (q) setQuestion(q)
      })
      .catch(() => {})
    fetchMessages()
  }, [id, fetchMessages])

  // TTS: assistant 메시지 마지막 것 읽기
  useEffect(() => {
    if (messages.length === 0) return
    const last = messages[messages.length - 1]
    if (last.role === 'assistant') speak(last.content)
  }, [messages, speak])

  async function handleSend(text: string) {
    setVoiceInput('')
    await sendMessage(text)
  }

  async function handleDoneToggle() {
    if (!question) return
    await fetch(`/api/questions/${id}/done`, { method: 'POST' })
    setQuestion(q => q ? { ...q, done: q.done ? 0 : 1 } : q)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <Link href="/questions" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>← 목록으로</Link>
          {/* 모드 토글 */}
          <div style={{ display: 'flex', gap: 4, background: '#f3f4f6', borderRadius: 8, padding: 3 }}>
            <button
              onClick={() => setMode('chat')}
              style={{
                padding: '4px 12px',
                borderRadius: 6,
                border: 'none',
                background: mode === 'chat' ? '#fff' : 'transparent',
                boxShadow: mode === 'chat' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: mode === 'chat' ? 600 : 400,
                color: mode === 'chat' ? '#111827' : '#6b7280',
              }}
            >
              💬 대화
            </button>
            <button
              onClick={() => setMode('flashcard')}
              style={{
                padding: '4px 12px',
                borderRadius: 6,
                border: 'none',
                background: mode === 'flashcard' ? '#fff' : 'transparent',
                boxShadow: mode === 'flashcard' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: mode === 'flashcard' ? 600 : 400,
                color: mode === 'flashcard' ? '#111827' : '#6b7280',
              }}
            >
              🧠 암기
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{
            flex: 1,
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: 10,
            padding: '12px 16px',
            fontSize: 15,
            fontWeight: 500,
            color: '#0c4a6e',
            lineHeight: 1.5,
          }}>
            {question?.question ?? '...'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
            <button
              onClick={handleDoneToggle}
              title={question?.done ? '학습 완료 취소' : '학습 완료 표시'}
              style={{
                padding: '6px 10px',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                background: question?.done ? '#dcfce7' : '#f9fafb',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                color: question?.done ? '#15803d' : '#6b7280',
              }}
            >
              {question?.done ? '✅ 완료' : '⬜ 완료'}
            </button>
            {mode === 'chat' && (
              <>
                <button
                  onClick={clearMessages}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    background: '#fff',
                    cursor: 'pointer',
                    fontSize: 12,
                    color: '#6b7280',
                  }}
                >
                  초기화
                </button>
                <button
                  onClick={toggleTts}
                  title={ttsEnabled ? '음성 출력 끄기' : '음성 출력 켜기'}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* 채팅 모드 */}
      {mode === 'chat' && (
        <>
          <ChatWindow messages={messages} loading={loading} />
          <ChatInput
            onSend={handleSend}
            disabled={loading}
            placeholder="답변을 입력하세요... (Shift+Enter 줄바꿈)"
            voiceSlot={
              sttSupported ? (
                <VoiceButton listening={listening} onToggle={toggleStt} disabled={loading} />
              ) : undefined
            }
          />
          {voiceInput && (
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4, paddingLeft: 4 }}>
              음성: {voiceInput}
              <button
                onClick={() => handleSend(voiceInput)}
                style={{ marginLeft: 8, fontSize: 12, color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                전송
              </button>
            </div>
          )}
        </>
      )}

      {/* 암기 모드 */}
      {mode === 'flashcard' && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <div style={{
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            padding: '20px 24px',
            fontSize: 14,
            lineHeight: 1.8,
            color: '#111827',
            whiteSpace: 'pre-wrap',
          }}>
            {question?.answer
              ? question.answer
              : <span style={{ color: '#9ca3af' }}>저장된 정답이 없습니다. 대화 모드에서 Claude에게 물어보세요.</span>
            }
          </div>
        </div>
      )}
    </div>
  )
}
