'use client'

import Link from 'next/link'
import { useIsMobile } from '@/hooks/useMediaQuery'

const MODULES = [
  {
    href: '/resume',
    title: '이력서 요약·보강',
    description: '이력서를 Claude에게 분석받고 강점·약점 파악 및 문장 보강',
    icon: '📄',
    color: '#4f46e5',
  },
  {
    href: '/questions',
    title: '질문 학습',
    description: '면접 질문에 채팅으로 답변 연습하고 Claude 피드백 받기',
    icon: '💬',
    color: '#0891b2',
  },
  {
    href: '/interview',
    title: '모의 면접',
    description: 'Claude가 면접관이 되어 기술면접·압박면접 시뮬레이션 (음성 지원)',
    icon: '🎤',
    color: '#dc2626',
  },
  {
    href: '/portfolio',
    title: '포트폴리오',
    description: '프로젝트 설명을 입력하면 Claude가 포트폴리오 문구 생성',
    icon: '🗂️',
    color: '#059669',
  },
]

export default function HomePage() {
  const isMobile = useIsMobile()

  return (
    <div>
      <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, marginBottom: 8 }}>면접 준비</h1>
      <p style={{ color: '#666', marginBottom: 32 }}>Claude AI와 함께하는 개인 면접 준비 도구</p>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? '260px' : '380px'}, 1fr))`, gap: 16 }}>
        {MODULES.map(({ href, title, description, icon, color }) => (
          <Link key={href} href={href} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#fff',
              borderRadius: 12,
              padding: isMobile ? 16 : 24,
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              transition: 'box-shadow 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color, marginBottom: 8 }}>{title}</h2>
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
