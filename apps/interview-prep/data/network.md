### HTTP와 HTTPS의 차이를 설명하세요

- **HTTP**: 평문 전송, 포트 80
- **HTTPS**: TLS/SSL 암호화, 포트 443
- TLS 핸드셰이크: 클라이언트 → 서버 인증서 검증 → 대칭키 교환 → 암호화 통신
- HSTS: 브라우저가 HTTP 요청을 자동으로 HTTPS로 리다이렉트
- 혼합 콘텐츠(Mixed Content): HTTPS 페이지에서 HTTP 리소스 로드 시 차단

### REST API 설계 원칙을 설명하세요

1. **자원(Resource)**: URI로 식별 (`/users/123`)
2. **HTTP 메서드**: GET(조회), POST(생성), PUT(전체수정), PATCH(부분수정), DELETE(삭제)
3. **무상태(Stateless)**: 각 요청에 필요한 정보 모두 포함
4. **표현(Representation)**: JSON, XML 등으로 자원 표현
5. **HATEOAS**: 응답에 관련 리소스 링크 포함 (Level 3)
6. 상태 코드: 200, 201, 204, 400, 401, 403, 404, 500

### CORS란 무엇이고 어떻게 동작하나요?

Cross-Origin Resource Sharing. 브라우저의 동일 출처 정책(SOP)을 안전하게 우회하는 메커니즘.

- **Simple Request**: GET/POST/HEAD, 특정 헤더만 사용 → 바로 요청
- **Preflight Request**: 그 외 → OPTIONS 요청으로 허용 여부 확인
- 서버 응답 헤더: `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`
- `credentials: 'include'` 시 와일드카드(`*`) 불가, 명시적 origin 필요

### TCP와 UDP의 차이를 설명하세요

- **TCP**: 연결 지향, 3-way handshake, 순서 보장, 재전송, 흐름/혼잡 제어
  - 용도: HTTP, 파일 전송, 이메일
- **UDP**: 비연결형, 순서/전달 보장 없음, 빠름, 오버헤드 적음
  - 용도: DNS, 실시간 스트리밍, 게임, VoIP
- HTTP/3: QUIC 프로토콜 (UDP 기반, TCP 장점 구현)

### 브라우저에 URL을 입력하면 어떤 일이 벌어지나요?

1. **DNS 조회**: 도메인 → IP 변환 (캐시 → 재귀적 조회)
2. **TCP 연결**: 3-way handshake (HTTPS면 TLS 핸드셰이크 추가)
3. **HTTP 요청**: GET 요청 전송
4. **서버 처리**: 요청 처리 후 응답 반환
5. **응답 수신**: HTML 파싱 시작
6. **렌더링**: DOM 트리 → CSSOM → 렌더 트리 → 레이아웃 → 페인트 → 합성
7. **추가 리소스**: CSS, JS, 이미지 등 병렬 로드

### 쿠키, 세션, JWT를 비교하세요

- **쿠키**: 클라이언트 저장, 4KB 제한, 매 요청 자동 전송, HttpOnly/Secure/SameSite 설정
- **세션**: 서버 저장, 세션 ID만 쿠키로 전달, 서버 메모리/DB 사용
- **JWT**: 토큰 자체에 정보 포함 (self-contained), 서버 상태 불필요
  - 구조: Header.Payload.Signature
  - 장점: stateless, 확장성
  - 단점: 토큰 크기, 만료 전 강제 무효화 어려움 (블랙리스트 필요)

### WebSocket이란 무엇인가요?

양방향(full-duplex) 실시간 통신 프로토콜.

- HTTP 업그레이드 핸드셰이크로 연결 수립 (`ws://`, `wss://`)
- 한 번 연결되면 지속적 양방향 통신 가능 (HTTP처럼 매번 연결 불필요)
- 용도: 채팅, 실시간 알림, 주식 시세, 게임
- 대안: SSE(Server-Sent Events) — 서버 → 클라이언트 단방향, HTTP 기반

### CDN이란 무엇이고 어떻게 동작하나요?

Content Delivery Network. 지리적으로 분산된 서버에 콘텐츠를 캐싱하여 빠르게 전달.

- 사용자와 가까운 엣지 서버에서 응답 → 레이턴시 감소
- 정적 자원(이미지, CSS, JS)뿐 아니라 동적 콘텐츠 가속도 가능
- 캐시 전략: TTL, Cache-Control 헤더, 캐시 무효화(purge)
- DDoS 방어, SSL 오프로딩 기능도 제공
- 예: CloudFront, Cloudflare, Akamai

### HTTP/1.1 vs HTTP/2 vs HTTP/3 차이점은?

- **HTTP/1.1**: 텍스트 기반, keep-alive, 파이프라이닝 (실제 사용 제한적), HOL blocking
- **HTTP/2**: 바이너리 프레이밍, 멀티플렉싱(하나의 연결로 병렬 요청), 헤더 압축(HPACK), 서버 푸시
- **HTTP/3**: QUIC 프로토콜(UDP 기반), 연결 설정 속도 향상(0-RTT), HOL blocking 해결
- 대부분의 모던 웹은 HTTP/2 이상 사용 권장

### 캐싱 전략(Cache-Control)을 설명하세요

- `no-store`: 캐시 금지
- `no-cache`: 캐시하지만 매번 서버에 검증
- `max-age=3600`: 1시간 동안 캐시 사용
- `public`: CDN 등 공유 캐시 허용
- `private`: 브라우저만 캐시
- **ETag**: 리소스 해시로 변경 여부 확인 (304 Not Modified)
- **Last-Modified**: 마지막 수정 시간 기반 검증
- **stale-while-revalidate**: 만료된 캐시를 보여주면서 백그라운드 갱신
