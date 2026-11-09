apps/interview-prep 개발 서버를 시작해줘.

아래 순서로 진행:
1. apps/interview-prep/.env.local 존재 여부 확인
   - 없으면 .env.example 기반으로 만들어야 한다고 알려주고 중단
2. node_modules 설치 여부 확인 (없으면 pnpm install 실행)
3. interview-prep.db 없으면 pnpm db:seed 먼저 실행
4. pnpm dev 실행 (포트 3000)
