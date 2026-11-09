### React의 Virtual DOM이 무엇이고 왜 사용하나요?

Virtual DOM은 실제 DOM의 인메모리 표현입니다. 상태 변경 시 새 Virtual DOM을 생성하고, 이전 것과 비교(Diffing)하여 최소한의 실제 DOM 변경만 수행합니다(Reconciliation).

- 직접 DOM 조작보다 효율적인 배치 업데이트
- 선언적 UI 프로그래밍 가능
- React Fiber (React 16+): 렌더링 작업을 쪼개 우선순위 기반 스케줄링

### useEffect의 실행 시점과 cleanup 함수를 설명하세요

- **마운트**: 컴포넌트가 DOM에 추가된 후 실행
- **업데이트**: 의존성 배열의 값이 변경되면 이전 cleanup 실행 → 새 effect 실행
- **언마운트**: cleanup 함수 실행
- 의존성 배열 `[]`: 마운트 시 1회만 실행
- 의존성 배열 생략: 매 렌더링마다 실행 (주의 필요)

### React에서 상태 관리 방법들을 비교하세요

1. **useState/useReducer**: 로컬 상태, 단순 ~ 중간 복잡도
2. **Context API**: props drilling 방지, 전역 상태 (리렌더링 주의)
3. **Redux/Zustand**: 대규모 전역 상태, 미들웨어 지원
4. **React Query/SWR**: 서버 상태 관리, 캐싱, 자동 재요청
5. **Jotai/Recoil**: 원자적 상태 관리, 세밀한 리렌더링 제어

### useMemo와 useCallback의 차이와 사용 시점은?

- **useMemo**: 계산 결과 값을 메모이제이션 (비용이 큰 계산)
- **useCallback**: 함수 참조를 메모이제이션 (자식 컴포넌트에 콜백 전달 시)
- 남용하면 오히려 메모리 오버헤드 → 실제 성능 문제가 있을 때 사용
- `React.memo`와 함께 사용해야 효과적

### React Server Components(RSC)란 무엇인가요?

- 서버에서만 렌더링되는 컴포넌트, 클라이언트로 JS 번들이 전송되지 않음
- DB 직접 접근, 파일 시스템 읽기 등 서버 자원 활용 가능
- `'use client'` 지시문으로 클라이언트 컴포넌트 명시
- 장점: 번들 크기 감소, 초기 로딩 속도 향상, 워터폴 감소
- Next.js App Router에서 기본값

### React에서 리렌더링이 발생하는 조건은?

1. **state 변경**: `setState` 호출
2. **props 변경**: 부모로부터 받은 props가 변경
3. **부모 리렌더링**: 부모가 리렌더링되면 자식도 리렌더링 (props가 같아도)
4. **Context 값 변경**: 구독 중인 Context의 value 변경
5. **forceUpdate** 호출 (클래스 컴포넌트)

최적화: `React.memo`, `useMemo`, `useCallback`, Context 분리

### useRef의 용도를 설명하세요

1. **DOM 참조**: `ref={myRef}`로 DOM 요소 직접 접근
2. **값 저장**: 리렌더링 없이 값 유지 (이전 state 저장, 타이머 ID 등)
3. `.current` 변경은 리렌더링을 트리거하지 않음
4. 렌더링 중 `.current` 읽기/쓰기는 피해야 함 (순수 함수 원칙)

### Suspense와 Error Boundary를 설명하세요

- **Suspense**: 비동기 데이터 로딩 중 fallback UI 표시
  - React.lazy 코드 스플리팅
  - RSC에서 서버 데이터 패칭 대기
  - `<Suspense fallback={<Loading />}>`
- **Error Boundary**: 하위 컴포넌트 트리의 에러를 잡아 fallback UI 표시
  - 클래스 컴포넌트의 `componentDidCatch`, `getDerivedStateFromError`
  - 이벤트 핸들러, 비동기 코드 에러는 잡지 못함

### React의 key가 중요한 이유는?

- Reconciliation 시 리스트의 각 항목을 식별하는 데 사용
- key가 없거나 index를 사용하면: 순서 변경 시 불필요한 DOM 재생성, 상태 꼬임
- 안정적이고 고유한 값(ID)을 key로 사용해야 함
- key 변경 → 컴포넌트 언마운트 + 새로 마운트 (상태 초기화 트릭)

### Next.js의 렌더링 전략들을 비교하세요

1. **SSG (Static Site Generation)**: 빌드 시 HTML 생성, CDN 캐싱
2. **SSR (Server-Side Rendering)**: 요청마다 서버에서 HTML 생성
3. **ISR (Incremental Static Regeneration)**: SSG + 주기적 재생성
4. **CSR (Client-Side Rendering)**: 브라우저에서 JS로 렌더링
5. **Streaming SSR**: HTML을 청크 단위로 스트리밍 (App Router 기본)
