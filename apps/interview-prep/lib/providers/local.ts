import type { Message, InterviewMessage, ProjectInput, ResumeFields } from '../types'
import type { AIProvider } from './types'
import { parseResumeFieldsJSON, RESUME_FIELDS_PROMPT } from './resume-fields'

const OLLAMA_HOST = process.env.OLLAMA_HOST ?? 'http://127.0.0.1:11434'
const MODEL = process.env.LOCAL_LLM_MODEL ?? 'qwen3.5:4b'

function unsupported(method: string): never {
  throw new Error(`LocalProvider는 ${method}를 지원하지 않습니다. extractResumeFields 전용입니다.`)
}

export class LocalProvider implements AIProvider {
  async refineResume(_content: string): Promise<string> {
    unsupported('refineResume')
  }

  async summarizeResume(_content: string): Promise<string> {
    unsupported('summarizeResume')
  }

  async chatAnswer(_question: string, _messages: Message[]): Promise<string> {
    unsupported('chatAnswer')
  }

  async conductInterview(
    _mode: 'technical' | 'pressure',
    _expYears: number,
    _resume: string,
    _messages: Message[],
  ): Promise<string> {
    unsupported('conductInterview')
  }

  async analyzeInterview(_mode: 'technical' | 'pressure', _messages: InterviewMessage[]): Promise<string> {
    unsupported('analyzeInterview')
  }

  async generatePortfolio(_project: ProjectInput): Promise<string> {
    unsupported('generatePortfolio')
  }

  async extractResumeFields(content: string): Promise<ResumeFields> {
    let res: Response
    try {
      res = await fetch(`${OLLAMA_HOST}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: 'user', content: RESUME_FIELDS_PROMPT(content) }],
          stream: false,
          think: false,
          format: 'json',
        }),
        signal: AbortSignal.timeout(120_000),
      })
    } catch (e) {
      const reason = e instanceof Error && e.name === 'TimeoutError' ? '응답 시간 초과(120초)' : String(e)
      throw new Error(`로컬 LLM 호출 실패: Ollama가 ${OLLAMA_HOST}에서 실행 중인지 확인하세요. (${reason})`)
    }

    if (!res.ok) {
      throw new Error(`로컬 LLM 호출 실패 (${res.status}): Ollama가 ${OLLAMA_HOST}에서 실행 중인지 확인하세요.`)
    }

    const data = (await res.json()) as { message?: { content?: string } }
    const raw = data.message?.content ?? ''
    return parseResumeFieldsJSON(raw)
  }
}
