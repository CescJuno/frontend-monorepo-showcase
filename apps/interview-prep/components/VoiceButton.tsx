'use client'

interface Props {
  listening: boolean
  onToggle: () => void
  disabled?: boolean
}

export function VoiceButton({ listening, onToggle, disabled }: Props) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      title={listening ? '녹음 중지' : '음성 입력'}
      style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: listening ? '2px solid #ef4444' : '1px solid #d1d5db',
        background: listening ? '#fef2f2' : '#f9fafb',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        opacity: disabled ? 0.4 : 1,
        animation: listening ? 'pulse 1.2s ease-in-out infinite' : 'none',
      }}
    >
      🎤
    </button>
  )
}
