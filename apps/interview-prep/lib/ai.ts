import type { AIProvider } from './providers/types'

function getProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER ?? 'anthropic'
  if (provider === 'gemini') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires -- 선택된 provider만 지연 로드
    const { GeminiProvider } = require('./providers/gemini')
    return new GeminiProvider()
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires -- 선택된 provider만 지연 로드
  const { AnthropicProvider } = require('./providers/anthropic')
  return new AnthropicProvider()
}

// extractResumeFields 전용 라우팅. AI_PROVIDER(anthropic|gemini) 값은 건드리지 않고
// LOCAL_EXTRACTION_ENABLED=true일 때만 로컬 LLM(Ollama)으로 이 메서드 호출을 우회시킨다.
function getExtractionProvider(): AIProvider {
  if (process.env.LOCAL_EXTRACTION_ENABLED === 'true') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires -- 로컬 LLM 활성화 시에만 지연 로드
    const { LocalProvider } = require('./providers/local')
    return new LocalProvider()
  }
  return getProvider()
}

export { getProvider, getExtractionProvider }
export type { AIProvider }
