'use client'

import { useState, useRef, useEffect } from 'react'

interface Options {
  onResult: (transcript: string) => void
  lang?: string
}

type AnySpeechRecognition = {
  lang: string
  interimResults: boolean
  continuous: boolean
  maxAlternatives: number
  onresult: ((e: Event) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
}

function getSpeechRecognitionCtor(): (new () => AnySpeechRecognition) | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as Record<string, unknown>
  return (w['SpeechRecognition'] ?? w['webkitSpeechRecognition'] ?? null) as (new () => AnySpeechRecognition) | null
}

export function useSpeechRecognition({ onResult, lang = 'ko-KR' }: Options) {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(false)
  const recognitionRef = useRef<AnySpeechRecognition | null>(null)
  const accumulatedRef = useRef<string>('')

  useEffect(() => {
    const SR = getSpeechRecognitionCtor()
    if (!SR) return
    setSupported(true)

    const recognition = new SR()
    recognition.lang = lang
    recognition.interimResults = false
    recognition.continuous = true
    recognition.maxAlternatives = 1
    recognition.onresult = (e: Event) => {
      const event = e as unknown as { results: SpeechRecognitionResultList; resultIndex: number }
      const newTranscript = event.results[event.resultIndex][0].transcript
      accumulatedRef.current = accumulatedRef.current
        ? accumulatedRef.current + ' ' + newTranscript
        : newTranscript
      onResult(accumulatedRef.current)
    }
    recognition.onend = () => setListening(false)
    recognitionRef.current = recognition
  }, [lang, onResult])

  function toggle() {
    if (!recognitionRef.current) return
    if (listening) {
      recognitionRef.current.stop()
      setListening(false)
      accumulatedRef.current = ''
    } else {
      accumulatedRef.current = ''
      recognitionRef.current.start()
      setListening(true)
    }
  }

  return { listening, supported, toggle }
}
