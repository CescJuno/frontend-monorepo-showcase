import { getServerSession, type NextAuthOptions } from 'next-auth'
import KakaoProvider from 'next-auth/providers/kakao'
import { supabase } from './supabase'

export function getAuthOptions(): NextAuthOptions {
  return {
    providers: [
      KakaoProvider({
        clientId: process.env.KAKAO_REST_API_KEY ?? '',
        clientSecret: process.env.KAKAO_CLIENT_SECRET ?? '',
      }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async signIn({ user, account }) {
        if (account?.provider !== 'kakao') return false

        const kakaoId = account.providerAccountId

        const { error } = await supabase.from('users').upsert(
          {
            kakao_id: kakaoId,
            name: user.name ?? null,
            email: user.email ?? null,
            image: user.image ?? null,
          },
          { onConflict: 'kakao_id' }
        )

        if (error) {
          console.error('signIn upsert error:', error)
          return false
        }
        return true
      },

      async session({ session, token }) {
        if (token.kakaoId) {
          const { data } = await supabase
            .from('users')
            .select('id')
            .eq('kakao_id', token.kakaoId as string)
            .single()

          if (data) {
            session.user.id = data.id
            session.user.kakaoId = token.kakaoId as string
          }
        }
        return session
      },

      async jwt({ token, account }) {
        if (account?.provider === 'kakao') {
          token.kakaoId = account.providerAccountId
        }
        return token
      },
    },
    pages: {
      signIn: '/login',
    },
  }
}

export async function getSession() {
  return getServerSession(getAuthOptions())
}

/** API Route에서 인증된 user_id 반환. 없으면 null */
export async function getAuthUserId(): Promise<string | null> {
  const session = await getSession()
  return session?.user?.id ?? null
}
