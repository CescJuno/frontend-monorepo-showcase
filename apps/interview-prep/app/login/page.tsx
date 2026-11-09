'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginContent() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: '48px 40px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: 360,
        width: '100%',
      }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: '#1a1a2e' }}>
          면접 준비
        </h1>
        <p style={{ color: '#666', marginBottom: 32, fontSize: 14 }}>
          카카오 계정으로 로그인하여 시작하세요
        </p>
        <button
          onClick={() => signIn('kakao', { callbackUrl })}
          style={{
            width: '100%',
            padding: '14px 0',
            background: '#FEE500',
            color: '#191919',
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <KakaoIcon />
          카카오로 로그인
        </button>
      </div>
    </div>
  )
}

function KakaoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#191919">
      <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.7 1.68 5.1 4.2 6.6L5.4 21l4.5-2.7c.69.12 1.4.18 2.1.18 5.52 0 10-3.48 10-7.8S17.52 3 12 3z"/>
    </svg>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
