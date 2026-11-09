import type { ResumeFields } from '../types'

export const RESUME_FIELDS_PROMPT = (content: string) => `다음 이력서를 채용 플랫폼(원티드/사람인/리맴버) 프로필 입력용 구조화 데이터로 변환해주세요.

아래 JSON 스키마로만 출력하세요 (설명·코드블록 없이 순수 JSON만):
{
  "summary": "한 줄 자기소개 (100자 이내)",
  "skills": ["기술스택1", "기술스택2"],
  "careers": [
    { "company": "회사명", "role": "직무/직책", "period": "YYYY.MM ~ YYYY.MM", "description": "주요 성과 요약" }
  ],
  "education": [
    { "school": "학교명", "degree": "학위/전공", "period": "YYYY.MM ~ YYYY.MM" }
  ]
}

이력서 원문에 없는 항목은 빈 배열 또는 빈 문자열로 두세요. 추측으로 채우지 마세요.

이력서:
${content}`

export function parseResumeFieldsJSON(raw: string): ResumeFields {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '')
  const parsed = JSON.parse(cleaned)

  return {
    summary: typeof parsed.summary === 'string' ? parsed.summary : '',
    skills: Array.isArray(parsed.skills) ? parsed.skills.filter((s: unknown) => typeof s === 'string') : [],
    careers: Array.isArray(parsed.careers)
      ? parsed.careers.map((c: Record<string, unknown>) => ({
          company: typeof c.company === 'string' ? c.company : '',
          role: typeof c.role === 'string' ? c.role : '',
          period: typeof c.period === 'string' ? c.period : '',
          description: typeof c.description === 'string' ? c.description : '',
        }))
      : [],
    education: Array.isArray(parsed.education)
      ? parsed.education.map((e: Record<string, unknown>) => ({
          school: typeof e.school === 'string' ? e.school : '',
          degree: typeof e.degree === 'string' ? e.degree : '',
          period: typeof e.period === 'string' ? e.period : '',
        }))
      : [],
  }
}
