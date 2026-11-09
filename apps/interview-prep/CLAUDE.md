# interview-prep

Claude API 기반 면접 준비 웹앱.

## 핵심 제약 (변경 금지)

- AI Provider: `AI_PROVIDER=anthropic|gemini` 환경변수로 선택 (기본값: `anthropic`)
- API 키: 서버사이드(`lib/claude.ts` → `lib/ai.ts`)에서만 사용, 클라이언트 노출 금지
- LLM으로 나가는 모든 텍스트는 `lib/mask.ts`의 `maskPII`를 먼저 거친다
- 음성: Web Speech API 클라이언트 전용 (Chrome 권장)

## 로컬 LLM (extractResumeFields 한정)

- `LOCAL_EXTRACTION_ENABLED=true` + Ollama 실행 시, `extractResumeFields`만 로컬 모델로 우회
- `AI_PROVIDER` enum과 기본 모델은 변경하지 않는다

## 커맨드

`/dev` 개발 서버 시작 · `/seed` DB 초기화 · `/refine-prompt` 프롬프트 개선(before/after 비교 후 승인받아 수정)
