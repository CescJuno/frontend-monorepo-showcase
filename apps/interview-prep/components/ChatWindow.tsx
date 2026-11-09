'use client'

import { useEffect, useRef } from 'react'
import type { Message } from '@/lib/types'
import { ChatBubble } from './ChatBubble'

interface Props {
  messages: Message[]
  loading?: boolean
}

export function ChatWindow({ messages, loading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 16px',
        minHeight: 0,
        background: '#fff',
        borderRadius: 10,
        border: '1px solid #e5e7eb',
      }}
    >
      {messages.length === 0 && !loading && (
        <div style={{ textAlign: 'center', color: '#9ca3af', marginTop: 40, fontSize: 14 }}>
          대화를 시작하세요
        </div>
      )}
      {messages.map(m => (
        <ChatBubble key={m.id} message={m} />
      ))}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
          <div style={{
            padding: '10px 16px',
            borderRadius: '18px 18px 18px 4px',
            background: '#f3f4f6',
            color: '#9ca3af',
            fontSize: 14,
          }}>
            입력 중...
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}
