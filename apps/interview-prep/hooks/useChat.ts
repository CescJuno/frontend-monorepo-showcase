'use client'

import { useState, useCallback } from 'react'
import type { Message } from '@/lib/types'
import { fetchJson } from '@/lib/client-fetch'

export function useChat(chatApiUrl: string, messagesApiUrl: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = useCallback(async () => {
    try {
      setMessages(await fetchJson<Message[]>(messagesApiUrl))
    } catch {
      setMessages([])
    }
  }, [messagesApiUrl])

  const sendMessage = useCallback(async (content: string) => {
    setLoading(true)
    setError(null)
    // optimistic: user bubble 즉시 표시
    const tempUser: Message = { id: Date.now(), role: 'user', content, created_at: new Date().toISOString() }
    setMessages(prev => [...prev, tempUser])

    try {
      const res = await fetch(chatApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      if (!res.ok) throw new Error('전송 실패')
      const assistant: Message = await res.json()
      // 서버에서 받은 실제 메시지로 교체
      setMessages(prev => [...prev.filter(m => m.id !== tempUser.id), tempUser, assistant])
    } catch (e) {
      setError((e as Error).message)
      setMessages(prev => prev.filter(m => m.id !== tempUser.id))
    } finally {
      setLoading(false)
    }
  }, [chatApiUrl])

  const clearMessages = useCallback(async () => {
    await fetch(messagesApiUrl, { method: 'DELETE' })
    setMessages([])
  }, [messagesApiUrl])

  return { messages, loading, error, fetchMessages, sendMessage, clearMessages }
}
