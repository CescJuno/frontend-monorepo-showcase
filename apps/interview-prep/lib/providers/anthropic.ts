import Anthropic from '@anthropic-ai/sdk'
import type { Message, InterviewMessage, ProjectInput, ResumeFields } from '../types'
import type { AIProvider } from './types'
import { parseResumeFieldsJSON, RESUME_FIELDS_PROMPT } from './resume-fields'

const MODEL = 'claude-sonnet-4-6'

function client() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.')
  }
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

function text(msg: Anthropic.Message): string {
  return (msg.content[0] as { type: 'text'; text: string }).text
}

export class AnthropicProvider implements AIProvider {
  async refineResume(content: string): Promise<string> {
    const msg = await client().messages.create({
      model: MODEL,
      max_tokens: 8192,
      messages: [
        {
          role: 'user',
          content: `다음 이력서를 면접용으로 보강해주세요.

규칙:
- 모호한 표현 → 구체적 수치 포함 문장으로
- 수동형 동사 → 능동·성과 중심 동사로
- 중복·불필요 문장 제거
- 원문 구조(섹션 순서)는 유지

이력서:
${content}

보강된 이력서만 출력하세요(설명 없이).`,
        },
      ],
    })
    return text(msg)
  }

  async summarizeResume(content: string): Promise<string> {
    const msg = await client().messages.create({
      model: MODEL,
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `다음 이력서를 면접 준비 관점에서 분석해주세요.

아래 형식의 마크다운으로 출력:
## 핵심 강점
- ...

## 보완 필요 영역
- ...

## 예상 면접 질문 포인트
- ...

이력서:
${content}`,
        },
      ],
    })
    return text(msg)
  }

  async chatAnswer(question: string, messages: Message[]): Promise<string> {
    const history = messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
    const msg = await client().messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: `당신은 친절한 면접 준비 코치입니다. 사용자가 면접 질문에 답변 연습을 하도록 돕습니다.
- 사용자의 답변을 평가하고 개선점을 구체적으로 제시하세요.
- 부족한 부분은 예시와 함께 보완 방법을 알려주세요.
- 잘된 부분은 명확히 칭찬하세요.
- 한국어로 답변하세요.

현재 연습 중인 질문: ${question}`,
      messages: history.length > 0 ? history : [{ role: 'user', content: '안녕하세요, 이 질문에 대해 연습하고 싶습니다.' }],
    })
    return text(msg)
  }

  async conductInterview(
    mode: 'technical' | 'pressure',
    expYears: number,
    resume: string,
    messages: Message[],
  ): Promise<string> {
    const level = expYears === 0 ? '신입' : `경력 ${expYears}년`
    const systemPrompt =
      mode === 'technical'
        ? `당신은 시니어 개발자 면접관입니다. ${level} 지원자를 기술 면접합니다.
- 이력서 기반으로 구체적인 기술 질문을 하세요.
- 답변에 꼬리 질문으로 깊이를 확인하세요.
- 한 번에 하나의 질문만 하세요.
- 한국어로 진행하세요.

지원자 이력서:
${resume || '이력서 없음'}`
        : `당신은 압박 면접관입니다. ${level} 지원자를 압박 면접합니다.
- 답변의 허점을 날카롭게 지적하세요.
- "그게 정말 본인 성과인가요?", "그 기술 실제로 깊이 아시나요?" 등 반박하세요.
- 난이도를 점점 높이세요.
- 한 번에 하나의 질문/반박만 하세요.
- 한국어로 진행하세요.

지원자 이력서:
${resume || '이력서 없음'}`

    const history = messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
    if (history.length === 0) history.push({ role: 'user', content: '면접을 시작해주세요.' })

    const msg = await client().messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: systemPrompt,
      messages: history,
    })
    return text(msg)
  }

  async analyzeInterview(mode: 'technical' | 'pressure', messages: InterviewMessage[]): Promise<string> {
    const transcript = messages
      .map(m => `[${m.role === 'user' ? '지원자' : '면접관'}] ${m.content}`)
      .join('\n\n')

    const msg = await client().messages.create({
      model: MODEL,
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `다음은 ${mode === 'technical' ? '기술 면접' : '압박 면접'} 대화 내용입니다. 지원자의 면접 수행을 분석해주세요.

아래 형식의 마크다운으로 출력:

## 종합 평가
(전반적인 수행 평가 2~3줄)

## 잘한 점
- ...

## 개선이 필요한 부분
- ...

## 핵심 피드백
(가장 중요한 개선 포인트 1~2가지를 구체적으로)

## 다음 면접 준비 포인트
- ...

---
대화 내용:
${transcript}`,
        },
      ],
    })
    return text(msg)
  }

  async extractResumeFields(content: string): Promise<ResumeFields> {
    const msg = await client().messages.create({
      model: MODEL,
      max_tokens: 4096,
      messages: [{ role: 'user', content: RESUME_FIELDS_PROMPT(content) }],
    })
    return parseResumeFieldsJSON(text(msg))
  }

  async generatePortfolio(project: ProjectInput): Promise<string> {
    const msg = await client().messages.create({
      model: MODEL,
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `다음 프로젝트 정보를 바탕으로 포트폴리오 문구를 작성해주세요.

- 프로젝트명: ${project.title}
- 기간: ${project.period ?? '미입력'}
- 역할: ${project.role ?? '미입력'}
- 기술스택: ${project.tech_stack ?? '미입력'}
- 설명: ${project.description ?? '미입력'}

요건:
- 임팩트 있는 한 줄 요약 (첫 줄)
- 주요 기여/성과 3~5개 불릿
- 사용 기술 맥락 설명 포함
- 채용 담당자 관점에서 매력적인 문구
- 마크다운 형식으로 출력`,
        },
      ],
    })
    return text(msg)
  }
}
