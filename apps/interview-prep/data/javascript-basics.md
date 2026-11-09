### var, let, const의 차이점을 설명하세요

- `var`: 함수 스코프, 호이스팅 시 `undefined`로 초기화, 재선언 가능
- `let`: 블록 스코프, 호이스팅되지만 TDZ(Temporal Dead Zone)에 의해 초기화 전 접근 불가, 재선언 불가
- `const`: 블록 스코프, 선언 시 반드시 초기화 필요, 재할당 불가 (객체 내부 속성은 변경 가능)

### 클로저(Closure)란 무엇인가요?

클로저는 함수가 선언된 렉시컬 환경(Lexical Environment)을 기억하여, 함수가 해당 스코프 밖에서 실행되더라도 그 환경에 접근할 수 있는 것을 말합니다.

- 데이터 은닉, 팩토리 함수, 커링 등에 활용
- 루프 내에서 비동기 콜백 사용 시 클로저 관련 버그 주의 (var vs let)

### 프로토타입 체인(Prototype Chain)을 설명하세요

JavaScript의 모든 객체는 `[[Prototype]]` 내부 슬롯을 가지며, 프로퍼티를 찾을 때 자신에게 없으면 프로토타입 체인을 따라 상위로 탐색합니다.

- `Object.create()`로 명시적 프로토타입 설정
- `__proto__`는 비표준이며 `Object.getPrototypeOf()` 사용 권장
- 체인의 끝은 `Object.prototype` → `null`

### 이벤트 루프(Event Loop)와 태스크 큐를 설명하세요

JavaScript는 싱글 스레드로, 이벤트 루프가 콜 스택과 태스크 큐를 관리합니다.

1. **콜 스택**: 현재 실행 중인 실행 컨텍스트
2. **마이크로태스크 큐**: Promise.then, MutationObserver (우선순위 높음)
3. **매크로태스크 큐**: setTimeout, setInterval, I/O
4. 콜 스택이 비면 마이크로태스크 → 매크로태스크 순으로 처리

### this 바인딩 규칙을 설명하세요

1. **기본 바인딩**: 전역 객체 (strict mode에서는 `undefined`)
2. **암시적 바인딩**: 메서드 호출 시 호출한 객체
3. **명시적 바인딩**: `call`, `apply`, `bind`
4. **new 바인딩**: 새로 생성된 객체
5. **화살표 함수**: 렉시컬 this (선언 시점의 상위 스코프 this)

우선순위: new > 명시적 > 암시적 > 기본

### Promise와 async/await의 차이점은?

- `Promise`: `.then()`, `.catch()` 체이닝으로 비동기 처리. 콜백 지옥 해결
- `async/await`: Promise의 문법적 설탕(syntactic sugar). 동기 코드처럼 읽기 쉬움
- `await`은 `async` 함수 내에서만 사용 가능
- 에러 처리: Promise는 `.catch()`, async/await은 `try/catch`
- 병렬 처리: `Promise.all()`, `Promise.allSettled()` 활용

### 깊은 복사(Deep Copy)와 얕은 복사(Shallow Copy)의 차이는?

- **얕은 복사**: 1단계 프로퍼티만 복사, 중첩 객체는 참조 공유
  - `Object.assign()`, 스프레드 연산자 `{...obj}`
- **깊은 복사**: 모든 중첩 객체를 재귀적으로 복사
  - `structuredClone()` (모던 브라우저), `JSON.parse(JSON.stringify())` (함수, undefined 등 손실 주의)

### 호이스팅(Hoisting)이란 무엇인가요?

호이스팅은 변수와 함수 선언이 스코프의 최상단으로 끌어올려지는 것처럼 동작하는 메커니즘입니다.

- **함수 선언문**: 전체가 호이스팅 (선언 전 호출 가능)
- **함수 표현식**: 변수만 호이스팅 (할당은 원래 위치)
- **var**: 선언만 호이스팅, `undefined`로 초기화
- **let/const**: 호이스팅되지만 TDZ로 인해 접근 불가

### 이벤트 버블링과 캡처링을 설명하세요

- **캡처링**: 이벤트가 최상위(window)에서 타겟 요소로 내려가는 단계
- **타겟**: 이벤트가 실제 발생한 요소
- **버블링**: 타겟에서 다시 최상위로 올라가는 단계
- `addEventListener`의 3번째 인자로 캡처링 사용 가능
- `event.stopPropagation()`으로 전파 중단
- **이벤트 위임**: 버블링을 활용해 부모에 핸들러를 등록하는 패턴

### WeakMap과 Map의 차이점은?

- **Map**: 어떤 값이든 키로 사용 가능, `size` 프로퍼티, iterable
- **WeakMap**: 객체만 키로 사용, 키에 대한 약한 참조 → GC 대상, iterable 아님, `size` 없음
- WeakMap 활용: 객체에 메타데이터 붙이기, DOM 노드에 데이터 연결, private 멤버 구현
