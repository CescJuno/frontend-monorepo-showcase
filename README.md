# Frontend Monorepo Showcase

pnpm workspace + Turborepo 기반 프론트엔드 모노레포입니다.
공통 패키지(UI·유틸·설정)와, 그 위에서 동작하는 **Claude API 기반 면접 준비 웹앱**으로 구성되어 있습니다.

> 프론트엔드 엔지니어가 실무에서 쓰는 구조(모노레포, 공유 패키지, AI 연동, 인증/보안 가드)를
> 작은 규모로 직접 구현해 둔 레퍼런스 저장소입니다.

## 이 저장소가 보여주는 것

| 주제 | 구현 위치 | 포인트 |
|---|---|---|
| 모노레포 설계 | `pnpm-workspace.yaml`, `turbo.json` | 앱과 공유 패키지를 분리하고 Turborepo로 빌드·린트 파이프라인을 구성 |
| 공유 패키지 | `packages/ui`, `shared`, `icons`, `config` | tsup으로 ESM/CJS 동시 빌드, 앱에서 `workspace:*`로 소비 |
| UI 패키지 | `packages/ui` | MUI 위에 얹은 공통 컴포넌트 15종 + `ThemeProvider`/`useThemeMode`(라이트·다크) |
| LLM 연동 | `apps/interview-prep/lib/providers` | Anthropic·Gemini를 `AIProvider` 인터페이스 뒤로 숨기고 환경변수로 교체, 이력서 필드 추출만 로컬 LLM(Ollama)으로 우회 가능 |
| 개인정보 보호 | `apps/interview-prep/lib/mask.ts` | 이력서를 LLM으로 보내기 전에 이메일·휴대폰·주민번호·카드·계좌·주소·여권번호를 마스킹 (4개 LLM 호출 경로 모두 적용) |
| 인증 | `lib/auth.ts`, `lib/api-auth.ts`, `middleware.ts` | NextAuth(Kakao OAuth) + Supabase, API Route 공통 `requireAuth` 가드 |
| 실시간 UX | `hooks/useSpeechRecognition.ts`, `useSpeechSynthesis.ts` | Web Speech API 기반 음성 입력·낭독을 채팅 UI와 결합 |

## 구성

```
.
├── apps/
│   └── interview-prep/     # Next.js 14 (App Router) 면접 준비 앱
├── packages/
│   ├── ui/                 # 공통 UI 컴포넌트 + 테마
│   ├── shared/             # 공통 타입·유틸·API·스토어
│   ├── icons/              # 아이콘 패키지
│   └── config/             # 공통 설정
├── turbo.json
└── pnpm-workspace.yaml
```

## interview-prep

면접 준비를 한 곳에서 하기 위한 개인용 웹앱입니다.

- **이력서**: 요약·보강, 이력서 필드 추출
- **질문 학습**: 카테고리별 질문과 AI 채팅 학습, 완료 체크
- **모의 면접**: 기술/압박 모드, 면접관 역할의 Claude와 대화(음성 지원)
- **포트폴리오**: 이력서 기반 포트폴리오 생성

설계 의도는 다음과 같습니다.

- **Provider 추상화**: 호출부(`lib/claude.ts`)는 어떤 모델을 쓰는지 모르고, `AI_PROVIDER`로만 교체합니다.
- **민감정보는 모델에 보내지 않는다**: 모든 LLM 호출 전에 `maskPII`를 거칩니다.
- **서버에서만 키를 쓴다**: API 키는 서버 코드에서만 읽고 클라이언트에 노출하지 않습니다.

## 시작하기

```bash
pnpm install
cp apps/interview-prep/.env.example apps/interview-prep/.env.local   # 키 입력
pnpm --filter @monorepo/interview-prep dev
```

`ANTHROPIC_API_KEY` 또는 `GEMINI_API_KEY`가 필요합니다. 인증을 쓰려면 Kakao OAuth와 Supabase 설정을 채워야 합니다.

```bash
pnpm build    # 공유 패키지 + 앱 빌드
pnpm lint
```

## 기술 스택

TypeScript · React 18 · Next.js 14 · MUI · pnpm workspace · Turborepo · tsup ·
NextAuth · Supabase · Anthropic SDK · Gemini API · Ollama(선택) · GitHub Actions

## 만든 사람

프론트엔드 엔지니어 김준호. React · TypeScript · Next.js로 대규모 어드민/SaaS를 만들고,
모노레포 플랫폼과 디자인 시스템, AI 기반 개발 워크플로 자동화에 관심을 두고 일해 왔습니다.
