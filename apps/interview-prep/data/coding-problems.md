# 코딩테스트 대비 — 프로그래머스 빈출 유형

## 카테고리: coding

---

### [해시] 전화번호 목록 — 접두사 존재 여부 확인

**문제 요약**: 전화번호부에 어떤 번호가 다른 번호의 접두어인 경우가 있으면 false, 없으면 true 반환.

**핵심 아이디어**: 정렬 후 인접 원소 비교. 정렬하면 접두사 관계인 번호는 반드시 인접.

```js
function solution(phone_book) {
  phone_book.sort();
  for (let i = 0; i < phone_book.length - 1; i++) {
    if (phone_book[i + 1].startsWith(phone_book[i])) return false;
  }
  return true;
}
```

**Set 활용 풀이** (더 직관적):
```js
function solution(phone_book) {
  const set = new Set(phone_book);
  return phone_book.every(num => {
    for (let i = 1; i < num.length; i++) {
      if (set.has(num.slice(0, i))) return false;
    }
    return true;
  });
}
```

**복잡도**: 정렬 풀이 O(n log n), Set 풀이 O(n * L) — L은 최대 번호 길이.

---

### [해시] 위장 — 경우의 수 조합

**문제 요약**: 스파이가 매일 다른 조합의 옷을 입으려 할 때, 서로 다른 옷의 조합 수 반환. 최소 1가지 옷은 착용.

**핵심 아이디어**: 각 카테고리마다 "안 입는 경우" 1가지 추가. 전체 경우의 수 = 각 (카테고리 수 + 1)의 곱 - 1(전부 안 입는 경우).

```js
function solution(clothes) {
  const map = {};
  for (const [item, category] of clothes) {
    map[category] = (map[category] ?? 0) + 1;
  }
  return Object.values(map).reduce((acc, cnt) => acc * (cnt + 1), 1) - 1;
}
```

**함정**: `Map` 대신 일반 객체 써도 되지만, 카테고리가 `__proto__` 같은 예약어면 위험 → `Object.create(null)` 또는 `Map` 권장.

---

### [스택/큐] 기능개발 — 작업 완료 배포 묶음

**문제 요약**: 각 기능의 진도와 속도가 주어질 때, 배포마다 몇 개씩 배포되는지 반환.

**핵심 아이디어**: 앞 작업이 완료되지 않으면 뒤 작업도 배포 불가. 각 작업의 완료일 계산 후 앞에서부터 묶기.

```js
function solution(progresses, speeds) {
  const days = progresses.map((p, i) => Math.ceil((100 - p) / speeds[i]));
  const result = [];
  let i = 0;

  while (i < days.length) {
    let count = 1;
    while (i + count < days.length && days[i + count] <= days[i]) {
      count++;
    }
    result.push(count);
    i += count;
  }
  return result;
}
```

**복잡도**: O(n). 큐 자료구조를 명시적으로 쓰지 않아도 인덱스로 해결 가능.

---

### [스택/큐] 다리를 지나는 트럭 — 시뮬레이션

**문제 요약**: bridge_length 길이의 다리에 weight 이하의 트럭들이 순서대로 건널 때 걸리는 시간.

**핵심 아이디어**: 다리를 큐로 표현. 매 초마다 다리 앞에서 트럭 하나씩 빠지고 뒤에서 추가. 무게 초과 시 빈 트럭(0) 추가.

```js
function solution(bridge_length, weight, truck_weights) {
  const bridge = Array(bridge_length).fill(0);
  let time = 0, currentWeight = 0, idx = 0;

  while (idx < truck_weights.length || currentWeight > 0) {
    time++;
    currentWeight -= bridge.shift();

    if (idx < truck_weights.length && currentWeight + truck_weights[idx] <= weight) {
      bridge.push(truck_weights[idx]);
      currentWeight += truck_weights[idx];
      idx++;
    } else {
      bridge.push(0);
    }
  }
  return time;
}
```

---

### [완전탐색] 카펫 — 갈색/노란색 격자 크기 역산

**문제 요약**: 갈색 격자 수와 노란색 격자 수가 주어질 때 카펫의 가로/세로 크기 반환.

**핵심 아이디어**: 전체 = brown + yellow. 가로 >= 세로, 세로 >= 3 (최소 크기). 약수 탐색.

```js
function solution(brown, yellow) {
  const total = brown + yellow;
  for (let h = 3; h <= Math.sqrt(total); h++) {
    if (total % h === 0) {
      const w = total / h;
      if ((w - 2) * (h - 2) === yellow) return [w, h];
    }
  }
}
```

**공식 유도**: 노란색 = (가로-2) * (세로-2), 갈색 = 2*(가로+세로) - 4.

---

### [완전탐색] 소수 찾기 — 순열 + 소수 판별

**문제 요약**: 숫자 카드 조각들로 만들 수 있는 모든 수 중 소수의 개수 반환.

**핵심 아이디어**: 순열로 만들 수 있는 모든 수 생성 → 소수 판별. Set으로 중복 제거.

```js
function solution(numbers) {
  const numArr = numbers.split('');
  const primes = new Set();

  function isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return false;
    }
    return true;
  }

  function permute(current, remaining) {
    if (current) {
      const n = parseInt(current);
      if (isPrime(n)) primes.add(n);
    }
    for (let i = 0; i < remaining.length; i++) {
      permute(
        current + remaining[i],
        remaining.slice(0, i).concat(remaining.slice(i + 1))
      );
    }
  }

  permute('', numArr);
  return primes.size;
}
```

---

### [DFS/BFS] 타겟 넘버 — 재귀로 모든 경우의 수

**문제 요약**: 숫자 배열의 각 원소에 +/- 를 붙여 타겟 숫자를 만들 수 있는 경우의 수.

**핵심 아이디어**: 이진 트리 완전탐색. 각 단계에서 더하거나 빼는 두 가지 선택.

```js
function solution(numbers, target) {
  let count = 0;

  function dfs(idx, sum) {
    if (idx === numbers.length) {
      if (sum === target) count++;
      return;
    }
    dfs(idx + 1, sum + numbers[idx]);
    dfs(idx + 1, sum - numbers[idx]);
  }

  dfs(0, 0);
  return count;
}
```

**반복 풀이** (스택 명시):
```js
function solution(numbers, target) {
  const stack = [[0, 0]]; // [index, sum]
  let count = 0;
  while (stack.length) {
    const [idx, sum] = stack.pop();
    if (idx === numbers.length) {
      if (sum === target) count++;
      continue;
    }
    stack.push([idx + 1, sum + numbers[idx]]);
    stack.push([idx + 1, sum - numbers[idx]]);
  }
  return count;
}
```

---

### [DFS/BFS] 네트워크 — 연결 컴포넌트 개수

**문제 요약**: n개의 컴퓨터와 연결 정보가 주어질 때 네트워크의 개수 반환.

**핵심 아이디어**: 방문하지 않은 노드에서 BFS/DFS 시작할 때마다 네트워크 +1.

```js
function solution(n, computers) {
  const visited = Array(n).fill(false);
  let count = 0;

  function dfs(node) {
    visited[node] = true;
    for (let i = 0; i < n; i++) {
      if (computers[node][i] && !visited[i]) dfs(i);
    }
  }

  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      dfs(i);
      count++;
    }
  }
  return count;
}
```

**Union-Find 풀이** (그래프 문제의 또 다른 접근):
```js
function solution(n, computers) {
  const parent = Array.from({ length: n }, (_, i) => i);

  function find(x) {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }
  function union(a, b) {
    parent[find(a)] = find(b);
  }

  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      if (computers[i][j]) union(i, j);

  return new Set(Array.from({ length: n }, (_, i) => find(i))).size;
}
```

---

### [정렬] 가장 큰 수 — 커스텀 정렬

**문제 요약**: 숫자 배열을 이어 붙여 만들 수 있는 가장 큰 수 반환 (문자열).

**핵심 아이디어**: 두 수 a, b를 비교할 때 `ab > ba`면 a를 앞에.

```js
function solution(numbers) {
  const result = numbers
    .map(String)
    .sort((a, b) => (b + a) - (a + b))
    .join('');
  return result[0] === '0' ? '0' : result;
}
```

**함정**: `[0, 0, 0]` 입력 시 `"000"` → `"0"` 반환해야 함. 첫 글자가 '0'이면 전부 0.

---

### [정렬] H-Index — 이분탐색 또는 정렬

**문제 요약**: 논문 h편 이상 인용된 논문이 h편 이상일 때 최대 h 반환.

**핵심 아이디어**: 내림차순 정렬 후, i번째 논문의 인용 수 >= i+1 이면 h = i+1.

```js
function solution(citations) {
  citations.sort((a, b) => b - a);
  let h = 0;
  for (let i = 0; i < citations.length; i++) {
    if (citations[i] >= i + 1) h = i + 1;
    else break;
  }
  return h;
}
```

---

### [탐욕법] 체육복 — 그리디 분배

**문제 요약**: 체육복 도난당한 학생들, 여분 있는 학생이 인접한 번호에만 빌려줄 수 있을 때 체육 수업 참여 가능한 최대 학생 수.

**핵심 아이디어**: 여분 있는 학생도 도난당했을 수 있음 → 먼저 본인 처리. 앞번호부터 순서대로 빌려줌.

```js
function solution(n, lost, reserve) {
  const lostSet = new Set(lost.filter(x => !reserve.includes(x)));
  const reserveSet = new Set(reserve.filter(x => !lost.includes(x)));

  for (const r of [...reserveSet].sort((a, b) => a - b)) {
    if (lostSet.has(r - 1)) lostSet.delete(r - 1);
    else if (lostSet.has(r + 1)) lostSet.delete(r + 1);
  }
  return n - lostSet.size;
}
```

---

### [탐욕법] 구명보트 — 투 포인터

**문제 요약**: 무게 제한이 있는 보트에 최대 2명씩 탈 수 있을 때, 필요한 최소 보트 수.

**핵심 아이디어**: 정렬 후 가장 무거운 사람과 가장 가벼운 사람을 함께 태울 수 있으면 같이, 아니면 무거운 사람만.

```js
function solution(people, limit) {
  people.sort((a, b) => a - b);
  let left = 0, right = people.length - 1, boats = 0;

  while (left <= right) {
    if (people[left] + people[right] <= limit) left++;
    right--;
    boats++;
  }
  return boats;
}
```

---

### [구현/시뮬레이션] 게임 맵 최단거리 — BFS 최단경로

**문제 요약**: n×m 격자에서 (0,0)에서 (n-1,m-1)까지 최단 거리. 도달 불가면 -1.

**핵심 아이디어**: BFS는 가중치 없는 그래프의 최단경로를 보장. DFS는 최단경로 보장 안 됨.

```js
function solution(maps) {
  const n = maps.length, m = maps[0].length;
  const dx = [0, 0, 1, -1];
  const dy = [1, -1, 0, 0];
  const visited = Array.from({ length: n }, () => Array(m).fill(false));
  const queue = [[0, 0, 1]];
  visited[0][0] = true;

  while (queue.length) {
    const [x, y, dist] = queue.shift();
    if (x === n - 1 && y === m - 1) return dist;

    for (let d = 0; d < 4; d++) {
      const nx = x + dx[d], ny = y + dy[d];
      if (nx >= 0 && nx < n && ny >= 0 && ny < m && maps[nx][ny] && !visited[nx][ny]) {
        visited[nx][ny] = true;
        queue.push([nx, ny, dist + 1]);
      }
    }
  }
  return -1;
}
```

**최적화**: `queue.shift()`는 O(n). 실제로는 deque나 인덱스 포인터로 O(1) 개선 가능.

---

### [이분탐색] 입국심사 — 최소 시간 이분탐색

**문제 요약**: n명이 심사를 받아야 하고 각 심사관의 소요 시간이 다를 때, 모두 심사받는 최소 시간.

**핵심 아이디어**: 시간 T를 이분탐색 → T 시간 내에 몇 명 처리 가능한지 계산.

```js
function solution(n, times) {
  times.sort((a, b) => a - b);
  let left = 1n, right = BigInt(times[times.length - 1]) * BigInt(n);

  while (left < right) {
    const mid = (left + right) / 2n;
    const count = times.reduce((acc, t) => acc + mid / BigInt(t), 0n);
    if (count >= BigInt(n)) right = mid;
    else left = mid + 1n;
  }
  return Number(left);
}
```

**주의**: n * max(times)가 최대 10^18 → BigInt 필수. number 범위 초과.

---

### 코딩테스트 JavaScript 실수 방지 체크리스트

면접 코딩테스트에서 자주 나오는 JS 함정들:

**1. 정렬 기본값은 문자열 정렬**
```js
[10, 9, 2].sort()           // [10, 2, 9] — 잘못됨
[10, 9, 2].sort((a,b)=>a-b) // [2, 9, 10] — 올바름
```

**2. Array(n).fill([])은 같은 참조**
```js
// 잘못: 모든 행이 같은 배열
const grid = Array(n).fill([]);
// 올바름
const grid = Array.from({ length: n }, () => []);
```

**3. parseInt vs Number vs 단항 +**
```js
parseInt('09')   // 9 (10진수)
Number('09')     // 9
+'09'            // 9 (가장 짧지만 가독성 떨어짐)
```

**4. Set/Map은 원시값만 중복 제거**
```js
new Set([[1,2],[1,2]]).size // 2 — 참조가 다르므로 중복 제거 안 됨
// 해결: JSON.stringify로 변환 후 Set
```

**5. 재귀 깊이 주의**
Node.js 기본 콜스택 ~10,000. 깊은 DFS는 반복+스택으로 변환 권장.

**6. BigInt 필요한 경우**
문제에서 10^15 이상의 수가 등장하면 Number 정밀도 손실 → BigInt 사용.

---

# 해커랭크 프론트엔드 빈출 패턴 (올리브영 1차 대비)

## 카테고리: hackerrank-fe

해커랭크 FE 코딩테스트는 알고리즘보다 **(1) JS 유틸 직접 구현, (2) React 컴포넌트 구현, (3) DOM 조작·이벤트** 비중이 훨씬 높다. 문제 풀이 시 다음을 항상 의식할 것:

- **테스트 케이스 통과만이 목표**: 과한 최적화·추상화는 시간 낭비.
- **edge case 명시적 처리**: 빈 배열, null, 0, 음수, 중복.
- **React 문제는 controlled component + key 안정성 + 접근성(aria-label/role)이 채점 포인트**.
- **타이머·비동기 문제는 race condition·cleanup이 함정**.

---

### [유틸 구현] debounce — 마지막 호출만 실행

**문제 요약**: `debounce(fn, wait)`를 구현하라. wait ms 동안 추가 호출이 없을 때만 마지막 인자로 fn 실행.

**핵심 아이디어**: 클로저로 타이머 ID 유지. 매 호출마다 `clearTimeout` → `setTimeout`.

```js
function debounce(fn, wait) {
  let timer = null;
  function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  }
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}
```

**확장 — leading edge 옵션**: 첫 호출은 즉시 실행, 이후 wait 동안은 무시.

```js
function debounce(fn, wait, { leading = false } = {}) {
  let timer = null;
  return function (...args) {
    const callNow = leading && !timer;
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      if (!leading) fn.apply(this, args);
    }, wait);
    if (callNow) fn.apply(this, args);
  };
}
```

**함정**: 화살표 함수로 작성하면 `this` 바인딩 불가 → 호출 컨텍스트가 중요한 경우 일반 함수 사용.

---

### [유틸 구현] throttle — 일정 간격 보장

**문제 요약**: `throttle(fn, wait)`. 최초 호출은 즉시 실행, 이후 wait ms 동안은 추가 호출 무시(또는 마지막 호출 보존).

```js
function throttle(fn, wait) {
  let lastCall = 0;
  let timer = null;
  let lastArgs = null;

  return function (...args) {
    const now = Date.now();
    const remaining = wait - (now - lastCall);
    lastArgs = args;

    if (remaining <= 0) {
      lastCall = now;
      fn.apply(this, args);
    } else if (!timer) {
      timer = setTimeout(() => {
        lastCall = Date.now();
        timer = null;
        fn.apply(this, lastArgs);
      }, remaining);
    }
  };
}
```

**debounce vs throttle 비교**:
| | debounce | throttle |
|---|---|---|
| 트리거 | 마지막 호출 이후 wait | 최초 + wait 간격 |
| 용도 | 검색 자동완성, resize 끝점 | 스크롤 핸들러, 무한스크롤 |

---

### [유틸 구현] deep clone — 순환 참조까지

**문제 요약**: 객체·배열·중첩 구조를 깊은 복사. Date·RegExp·Map·Set·순환 참조까지 처리.

```js
function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return seen.get(value);

  if (value instanceof Date) return new Date(value);
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);

  if (value instanceof Map) {
    const map = new Map();
    seen.set(value, map);
    value.forEach((v, k) => map.set(deepClone(k, seen), deepClone(v, seen)));
    return map;
  }

  if (value instanceof Set) {
    const set = new Set();
    seen.set(value, set);
    value.forEach(v => set.add(deepClone(v, seen)));
    return set;
  }

  const result = Array.isArray(value) ? [] : {};
  seen.set(value, result);
  for (const key of Reflect.ownKeys(value)) {
    result[key] = deepClone(value[key], seen);
  }
  return result;
}
```

**왜 JSON.parse(JSON.stringify(x))는 안 되는가**:
- `undefined`, `function`, `Symbol` 손실
- `Date` → 문자열로 변환
- 순환 참조 시 throw
- `NaN`, `Infinity` → `null`

---

### [유틸 구현] curry — 인자 누적

**문제 요약**: `curry(fn)`이 fn의 모든 인자가 채워질 때까지 부분 적용 함수를 반환.

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...next) => curried.apply(this, [...args, ...next]);
  };
}

// 사용
const add = (a, b, c) => a + b + c;
const c = curry(add);
c(1)(2)(3);    // 6
c(1, 2)(3);    // 6
c(1)(2, 3);    // 6
```

**함정**: `fn.length`는 default 인자나 rest 인자 무시. 그런 함수는 인자 개수를 명시적으로 받는 변형 필요.

---

### [유틸 구현] flatten — 임의 깊이 배열 평탄화

**문제 요약**: `flatten([1, [2, [3, [4]]]])` → `[1, 2, 3, 4]`. `depth` 인자 지원.

```js
function flatten(arr, depth = Infinity) {
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      result.push(...flatten(item, depth - 1));
    } else {
      result.push(item);
    }
  }
  return result;
}

// 반복 풀이 (스택 깊이 안전)
function flattenIterative(arr) {
  const stack = [...arr];
  const result = [];
  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) stack.push(...item);
    else result.unshift(item); // pop 순서 보정
  }
  return result;
}
```

**오브젝트 flatten** (dot notation):
```js
function flattenObject(obj, prefix = '') {
  const result = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(result, flattenObject(v, key));
    } else {
      result[key] = v;
    }
  }
  return result;
}
```

---

### [유틸 구현] Promise.all 직접 구현

**문제 요약**: native `Promise.all` 없이 동일 동작 구현. 모든 promise resolve 시 결과 배열 반환, 하나라도 reject 시 즉시 reject.

```js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = new Array(promises.length);
    let completed = 0;

    if (promises.length === 0) return resolve([]);

    promises.forEach((p, i) => {
      Promise.resolve(p).then(
        (value) => {
          results[i] = value;
          completed++;
          if (completed === promises.length) resolve(results);
        },
        reject
      );
    });
  });
}
```

**변형 — allSettled**: 실패해도 reject하지 않고 status/value/reason 객체 반환.

```js
function promiseAllSettled(promises) {
  return Promise.all(
    promises.map(p =>
      Promise.resolve(p).then(
        value => ({ status: 'fulfilled', value }),
        reason => ({ status: 'rejected', reason })
      )
    )
  );
}
```

---

### [유틸 구현] LRU Cache — 객체 + 더블 링크드 리스트

**문제 요약**: `get(key)`, `put(key, value)` 모두 O(1). 용량 초과 시 가장 오래 안 쓴 항목 제거.

**핵심 아이디어**: JS의 `Map`은 삽입 순서를 보장하므로 그것만으로 충분.

```js
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value); // 가장 최근 사용으로 이동
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size >= this.capacity) {
      const oldest = this.cache.keys().next().value;
      this.cache.delete(oldest);
    }
    this.cache.set(key, value);
  }
}
```

**복잡도**: `Map.delete` / `Map.set` 모두 O(1).

---

### [React] Counter — props 기반 조건부 disable

**문제 요약**: increment / decrement / reset 버튼. `min`, `max` prop이 주어지면 한계값에서 해당 버튼 disabled.

```tsx
function Counter({ initial = 0, min = -Infinity, max = Infinity }: Props) {
  const [count, setCount] = useState(initial);

  return (
    <div>
      <button
        data-testid="decrement"
        onClick={() => setCount(c => c - 1)}
        disabled={count <= min}
      >-</button>
      <span data-testid="value">{count}</span>
      <button
        data-testid="increment"
        onClick={() => setCount(c => c + 1)}
        disabled={count >= max}
      >+</button>
      <button onClick={() => setCount(initial)}>Reset</button>
    </div>
  );
}
```

**채점 포인트**:
- `data-testid` 정확히 일치 (해커랭크는 testid 기반 단언이 많음)
- 함수형 업데이트 `setCount(c => c + 1)` — 동일 이벤트에서 두 번 호출되는 케이스 대비
- disabled 처리

---

### [React] Todo List — 추가/토글/삭제/필터

```tsx
type Todo = { id: string; text: string; done: boolean };

function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all');

  const add = () => {
    const text = input.trim();
    if (!text) return;
    setTodos(prev => [...prev, { id: crypto.randomUUID(), text, done: false }]);
    setInput('');
  };

  const toggle = (id: string) =>
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const remove = (id: string) =>
    setTodos(prev => prev.filter(t => t.id !== id));

  const visible = useMemo(() => {
    if (filter === 'active') return todos.filter(t => !t.done);
    if (filter === 'done') return todos.filter(t => t.done);
    return todos;
  }, [todos, filter]);

  return (
    <div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && add()}
      />
      <button onClick={add}>Add</button>

      <div>
        {(['all', 'active', 'done'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f}>
            {f}
          </button>
        ))}
      </div>

      <ul>
        {visible.map(t => (
          <li key={t.id}>
            <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
            <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
            <button onClick={() => remove(t.id)}>x</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**함정**:
- 빈 문자열 / 공백만 입력 거부
- `id`로 `index` 쓰면 정렬·삭제 후 key 충돌 → `crypto.randomUUID()` 또는 증분 카운터
- 체크박스 `defaultChecked` 쓰면 controlled 경고 발생 → `checked` + `onChange`

---

### [React] Search + Debounce + Race Condition 처리

**문제 요약**: 검색 input. 300ms debounce 후 API 호출. 빠르게 입력 시 이전 요청이 늦게 도착해 최신 결과를 덮어쓰지 않아야 함.

```tsx
function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setResults(data);
      } catch (err) {
        if ((err as any).name !== 'AbortError') console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {loading && <span>Loading...</span>}
      <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>
    </div>
  );
}
```

**핵심 패턴**:
- `AbortController`로 이전 요청 취소 → race 방지의 가장 깔끔한 방법
- `useEffect` cleanup에서 `clearTimeout` + `abort`
- 빈 쿼리 early return — 불필요한 호출 차단

**대안 — request ID 패턴** (Abort 지원 안 되는 환경):
```tsx
const reqIdRef = useRef(0);
// ...
const id = ++reqIdRef.current;
fetch(...).then(data => {
  if (id === reqIdRef.current) setResults(data);
});
```

---

### [React] Pagination — 페이지 번호 + Prev/Next

**문제 요약**: 총 페이지 수, 현재 페이지가 주어졌을 때 페이지네이션 UI. 페이지 5개 윈도우 + 처음/끝 버튼.

```tsx
function Pagination({ totalPages, currentPage, onChange }: Props) {
  const windowSize = 5;
  const half = Math.floor(windowSize / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav aria-label="pagination">
      <button onClick={() => onChange(1)} disabled={currentPage === 1}>«</button>
      <button onClick={() => onChange(currentPage - 1)} disabled={currentPage === 1}>‹</button>
      {pages.map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          aria-current={p === currentPage ? 'page' : undefined}
          style={{ fontWeight: p === currentPage ? 'bold' : 'normal' }}
        >
          {p}
        </button>
      ))}
      <button onClick={() => onChange(currentPage + 1)} disabled={currentPage === totalPages}>›</button>
      <button onClick={() => onChange(totalPages)} disabled={currentPage === totalPages}>»</button>
    </nav>
  );
}
```

**함정**:
- `totalPages === 0` 경계
- `currentPage`가 prop으로 들어올 때 (controlled) vs 내부 state (uncontrolled) 구분 명확히
- 접근성: `aria-current="page"`, `aria-label="pagination"`

---

### [React] Autocomplete — 키보드 네비 + ARIA

**문제 요약**: input 입력 시 제안 목록 표시. ↑↓로 항목 이동, Enter로 선택, Esc로 닫기.

```tsx
function Autocomplete({ options }: { options: string[] }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(
    () => options.filter(o => o.toLowerCase().includes(query.toLowerCase())),
    [options, query]
  );

  const choose = (value: string) => {
    setQuery(value);
    setOpen(false);
    setActive(-1);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(a => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(a => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && active >= 0) {
      choose(filtered[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div role="combobox" aria-expanded={open} aria-haspopup="listbox">
      <input
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); setActive(-1); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `opt-${active}` : undefined}
      />
      {open && filtered.length > 0 && (
        <ul role="listbox">
          {filtered.map((o, i) => (
            <li
              key={o}
              id={`opt-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={() => choose(o)}
              style={{ background: i === active ? '#eee' : 'transparent' }}
            >
              {o}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

**채점 포인트**:
- 마우스 이벤트는 `onClick`이 아닌 `onMouseDown` — `onBlur`로 닫히기 전에 선택되도록
- `aria-activedescendant`로 스크린리더 호환
- 화살표 키 `e.preventDefault()` — 커서가 input 끝으로 이동하는 기본 동작 차단

---

### [DOM] Form Validation — 실시간 + Submit

**문제 요약**: 이메일, 비밀번호(8자 이상, 숫자 포함), 비밀번호 확인 일치. blur 시 검증, submit 시 전체 검증.

```html
<form id="signup">
  <input name="email" type="email" />
  <span class="error" data-for="email"></span>

  <input name="password" type="password" />
  <span class="error" data-for="password"></span>

  <input name="confirm" type="password" />
  <span class="error" data-for="confirm"></span>

  <button type="submit">Sign up</button>
</form>
```

```js
const form = document.getElementById('signup');
const rules = {
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || '유효한 이메일이 아닙니다',
  password: v => (v.length >= 8 && /\d/.test(v)) || '8자 이상, 숫자 포함',
  confirm: v => v === form.password.value || '비밀번호가 일치하지 않습니다',
};

function validateField(name) {
  const result = rules[name](form[name].value);
  const errEl = form.querySelector(`[data-for="${name}"]`);
  errEl.textContent = result === true ? '' : result;
  return result === true;
}

form.addEventListener('blur', (e) => {
  if (rules[e.target.name]) validateField(e.target.name);
}, true); // capture phase — blur는 버블 안 함

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const allValid = Object.keys(rules).every(validateField);
  if (allValid) console.log('OK', new FormData(form));
});
```

**함정**:
- `blur` 이벤트는 버블링 안 됨 → 위임 시 `capture: true` 또는 `focusout` 사용
- `e.preventDefault()` 누락 시 페이지 새로고침
- 비밀번호 확인 검증은 비밀번호 변경 시도 재검증 필요 (생략 자주 함)

---

### 해커랭크 FE 면접 직전 체크리스트

**환경**:
- 브라우저는 Chrome 권장 — 일부 문제는 클립보드/포커스 동작이 브라우저별로 다름
- 코드 에디터에서 들여쓰기 자동 정렬 켜둘 것 (테스트 케이스가 console.log 위치에 민감)

**시간 배분 (90분 가정)**:
- 문제 파악 5분 → 손으로 인풋/아웃풋 적기
- 구현 60분
- 테스트 케이스 통과 확인 + edge case 보완 20분
- 예비 5분

**자주 빠뜨리는 것**:
1. `data-testid` 속성 — 채점 셀렉터와 정확히 일치해야 함
2. 빈 입력 / 빈 배열 / null 입력 처리
3. useEffect cleanup (clearTimeout, abort, unsubscribe)
4. React controlled component (`value` + `onChange` 한 쌍)
5. 이벤트 핸들러 내부 `e.preventDefault()` (form submit, anchor click)
6. `key` prop을 index 대신 안정적인 id로

**문제 못 풀 때 차선책**:
- 일부 케이스만 통과해도 부분 점수 — 완벽한 0보다 어설픈 70% 점수가 낫다
- 가장 단순한 구현부터 동작시키고 점진 개선 (greedy submission)
