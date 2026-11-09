### interface와 type의 차이점은?

- **interface**: 선언 병합(declaration merging) 가능, `extends`로 확장, 객체 타입 정의에 적합
- **type**: 유니온, 인터섹션, 튜플, 매핑 타입 등 더 유연한 타입 조합 가능, 별칭(alias) 역할
- 공통점: 둘 다 객체 형태 정의 가능, `implements` 가능
- 관례: 객체 구조 → interface, 유니온/유틸리티 → type

### 제네릭(Generics)이란 무엇이고 왜 사용하나요?

제네릭은 타입을 파라미터로 받아 재사용 가능한 컴포넌트를 만드는 방법입니다.

```typescript
function identity<T>(arg: T): T { return arg }
```

- 타입 안전성 유지하면서 코드 재사용
- 제약 조건: `<T extends HasLength>`로 타입 제한
- 기본값: `<T = string>`
- 활용: 유틸리티 타입, API 응답 타입, 컬렉션 등

### 유틸리티 타입(Utility Types)을 설명하세요

- `Partial<T>`: 모든 프로퍼티를 선택적으로
- `Required<T>`: 모든 프로퍼티를 필수로
- `Pick<T, K>`: 특정 프로퍼티만 선택
- `Omit<T, K>`: 특정 프로퍼티 제외
- `Record<K, V>`: 키-값 타입의 객체
- `Readonly<T>`: 모든 프로퍼티를 읽기 전용으로
- `ReturnType<T>`: 함수의 반환 타입 추출
- `Parameters<T>`: 함수의 파라미터 타입을 튜플로

### 타입 가드(Type Guard)란?

런타임에서 타입을 좁혀(narrowing) 타입 안전한 코드를 작성하는 패턴입니다.

- `typeof`: 원시 타입 체크 (`typeof x === 'string'`)
- `instanceof`: 클래스 인스턴스 체크
- `in`: 프로퍼티 존재 여부 체크
- 사용자 정의 타입 가드: `function isUser(x: any): x is User`
- discriminated union: 공통 프로퍼티로 유니온 타입 구분

### never 타입은 언제 사용하나요?

`never`는 절대 발생하지 않는 값의 타입입니다.

- 함수가 절대 반환하지 않을 때 (무한 루프, throw)
- exhaustive check: switch문에서 모든 케이스 처리 확인
- 조건부 타입에서 타입 필터링: `T extends U ? never : T`
- 빈 유니온: `string & number` → `never`

### 조건부 타입(Conditional Types)을 설명하세요

`T extends U ? X : Y` 형태로 조건에 따라 타입을 결정합니다.

- 분배 법칙: 유니온 타입에 자동 분배
- `infer` 키워드: 타입 추론 (`T extends Promise<infer R> ? R : T`)
- 활용 예: `Exclude`, `Extract`, `NonNullable` 등 내장 유틸리티 타입 구현

### enum vs const enum vs union type 비교

- **enum**: 런타임 객체 생성, 양방향 매핑 (숫자), 트리쉐이킹 불가
- **const enum**: 컴파일 시 인라인 치환, 런타임 객체 없음 (isolatedModules에서 제한)
- **union type**: `type Status = 'active' | 'inactive'` — 런타임 오버헤드 없음, 타입 안전
- 권장: 대부분의 경우 union type이 가장 가벼움

### 타입 단언(Type Assertion) vs 타입 선언의 차이는?

- **타입 선언**: `const x: Type = value` — 할당 시 타입 체크
- **타입 단언**: `value as Type` — 개발자가 타입을 확신할 때 (체크 우회)
- `as unknown as T`: 이중 단언 (위험, 최후의 수단)
- 타입 단언보다 타입 가드 사용 권장
- `!` (non-null assertion): null/undefined가 아님을 단언

### 데코레이터(Decorator)란 무엇인가요?

데코레이터는 클래스, 메서드, 프로퍼티 등에 메타데이터를 추가하거나 동작을 수정하는 패턴입니다.

- Stage 3 제안 (TC39), TypeScript 5.0에서 표준 데코레이터 지원
- `@decorator` 문법
- 종류: 클래스, 메서드, 접근자, 프로퍼티, 파라미터 데코레이터
- 활용: NestJS의 `@Controller()`, `@Injectable()`, Angular의 `@Component()`

### 타입스크립트의 구조적 타이핑(Structural Typing)이란?

TypeScript는 명목적(nominal)이 아닌 구조적(structural) 타입 시스템을 사용합니다.

- 타입 이름이 아닌 구조(shape)가 같으면 호환 가능
- 덕 타이핑과 유사하지만 컴파일 타임에 체크
- 초과 프로퍼티 체크: 객체 리터럴 직접 할당 시에만 엄격 체크
- 브랜드 타입(branded type)으로 명목적 타이핑 흉내 가능
