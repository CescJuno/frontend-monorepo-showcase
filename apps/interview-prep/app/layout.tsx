'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut, SessionProvider } from 'next-auth/react'
import { useState } from 'react'
import { useIsMobile } from '@/hooks/useMediaQuery'

const NAV_ITEMS = [
  { href: '/resume', label: '이력서' },
  { href: '/questions', label: '질문 학습' },
  { href: '/interview', label: '모의 면접' },
  { href: '/portfolio', label: '포트폴리오' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#f5f5f5' }}>
        <SessionProvider>
          <NavBar />
          <main style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 16px' }}>
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  )
}

function NavBar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav style={{
      background: '#1a1a2e',
      padding: isMobile ? '0 12px' : '0 24px',
      position: 'relative',
    }}>
      {/* Top bar: logo + hamburger (mobile) or full nav (desktop) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        height: 56,
      }}>
        <Link href="/" style={{ color: '#fff', fontWeight: 700, marginRight: isMobile ? 0 : 24, textDecoration: 'none', flexShrink: 0 }}>
          면접 준비
        </Link>

        {/* Desktop nav items */}
        {!isMobile && NAV_ITEMS.map(({ href, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              style={{
                color: active ? '#7c83fd' : '#ccc',
                textDecoration: 'none',
                padding: '4px 12px',
                borderRadius: 6,
                fontWeight: active ? 600 : 400,
                background: active ? 'rgba(124,131,253,0.15)' : 'transparent',
                fontSize: 14,
              }}
            >
              {label}
            </Link>
          )
        })}

        {/* Desktop user info */}
        {!isMobile && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            {session?.user && (
              <>
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? ''}
                    style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
                  />
                )}
                <span style={{ color: '#ccc', fontSize: 13 }}>
                  {session.user.name}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  style={{
                    background: 'transparent',
                    border: '1px solid #444',
                    color: '#aaa',
                    borderRadius: 6,
                    padding: '4px 10px',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  로그아웃
                </button>
              </>
            )}
          </div>
        )}

        {/* Mobile hamburger button */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={menuOpen}
            style={{
              marginLeft: 'auto',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 4px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 5,
            }}
          >
            <span style={{
              display: 'block',
              width: 22,
              height: 2,
              background: '#fff',
              borderRadius: 2,
              transition: 'transform 0.2s, opacity 0.2s',
              transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
            }} />
            <span style={{
              display: 'block',
              width: 22,
              height: 2,
              background: '#fff',
              borderRadius: 2,
              opacity: menuOpen ? 0 : 1,
              transition: 'opacity 0.2s',
            }} />
            <span style={{
              display: 'block',
              width: 22,
              height: 2,
              background: '#fff',
              borderRadius: 2,
              transition: 'transform 0.2s, opacity 0.2s',
              transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
            }} />
          </button>
        )}
      </div>

      {/* Mobile dropdown menu */}
      {isMobile && menuOpen && (
        <div style={{
          position: 'absolute',
          top: 56,
          left: 0,
          right: 0,
          background: '#1a1a2e',
          borderTop: '1px solid #2a2a4a',
          zIndex: 100,
          padding: '8px 0 12px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {NAV_ITEMS.map(({ href, label }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{
                  color: active ? '#7c83fd' : '#ccc',
                  textDecoration: 'none',
                  padding: '10px 16px',
                  fontWeight: active ? 600 : 400,
                  background: active ? 'rgba(124,131,253,0.15)' : 'transparent',
                  fontSize: 15,
                }}
              >
                {label}
              </Link>
            )
          })}

          {/* Mobile user info */}
          {session?.user && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 16px',
              borderTop: '1px solid #2a2a4a',
              marginTop: 4,
            }}>
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name ?? ''}
                  style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
              )}
              <span style={{ color: '#ccc', fontSize: 13, flex: 1 }}>
                {session.user.name}
              </span>
              <button
                onClick={() => {
                  setMenuOpen(false)
                  signOut({ callbackUrl: '/login' })
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid #444',
                  color: '#aaa',
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
