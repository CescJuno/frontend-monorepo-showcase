'use client'

import { useIsMobile } from '@/hooks/useMediaQuery'
import type { Message } from '@/lib/types'

interface Props {
  message: Message
}

export function ChatBubble({ message }: Props) {
  const isMobile = useIsMobile()
  const isUser = message.role === 'user'
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
      <div
        style={{
          maxWidth: isMobile ? '88%' : '72%',
          padding: '10px 14px',
          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          background: isUser ? '#4f46e5' : '#f0f9ff',
          color: isUser ? '#fff' : '#1e3a5f',
          border: isUser ? 'none' : '1px solid #bae6fd',
          fontSize: 14,
          lineHeight: 1.65,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {message.content}
      </div>
    </div>
  )
}
