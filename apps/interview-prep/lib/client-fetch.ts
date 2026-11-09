'use client'

export class FetchError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

/**
 * 클라이언트 fetch 래퍼. 401이면 /login으로 리다이렉트하고
 * 그 외 에러는 FetchError로 throw. 성공 시 JSON 파싱 결과 반환.
 */
export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      const callback = encodeURIComponent(window.location.pathname + window.location.search)
      window.location.href = `/login?callbackUrl=${callback}`
    }
    throw new FetchError(401, 'Unauthorized')
  }
  if (!res.ok) {
    throw new FetchError(res.status, `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}
