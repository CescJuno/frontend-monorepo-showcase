'use client'

import { useState, useRef, KeyboardEvent } from 'react'

interface Props {
  onSend: (text: string) => void
  disabled?: boolean
  placeholder?: string
  voiceSlot?: React.ReactNode
}

export function ChatInput({ onSend, disabled, placeholder = '메시지 입력...', voiceSlot }: Props) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleSend() {
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setText('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value)
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'
    }
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', padding: '8px 0' }}>
      {voiceSlot}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        style={{
          flex: 1,
          resize: 'none',
          padding: '9px 12px',
          borderRadius: 10,
          border: '1px solid #d1d5db',
          fontSize: 14,
          fontFamily: 'inherit',
          lineHeight: 1.5,
          outline: 'none',
          overflow: 'hidden',
          background: disabled ? '#f9fafb' : '#fff',
        }}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        style={{
          padding: '9px 16px',
          background: '#4f46e5',
          color: '#fff',
          border: 'none',
          borderRadius: 10,
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: 14,
          opacity: disabled || !text.trim() ? 0.5 : 1,
          flexShrink: 0,
        }}
      >
        전송
      </button>
    </div>
  )
}
