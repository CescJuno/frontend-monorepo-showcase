'use client'

import { useState, useCallback } from 'react'

export function useSpeechSynthesis() {
  const [enabled, setEnabled] = useState(false)
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

  const speak = useCallback((text: string) => {
    if (!enabled || !supported) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'ko-KR'
    window.speechSynthesis.speak(utter)
  }, [enabled, supported])

  const toggle = () => {
    if (enabled) window.speechSynthesis?.cancel()
    setEnabled(v => !v)
  }

  return { enabled, supported, speak, toggle }
}
