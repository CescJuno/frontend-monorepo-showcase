-- ============================================================
-- interview-prep 초기 스키마 마이그레이션
-- Supabase SQL Editor에서 실행
-- ============================================================

-- 유저 테이블 (NextAuth 세션과 연동)
CREATE TABLE IF NOT EXISTS users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kakao_id   TEXT UNIQUE NOT NULL,
  name       TEXT,
  email      TEXT,
  image      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 이력서
CREATE TABLE IF NOT EXISTS resumes (
  id         BIGSERIAL PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  version    INTEGER DEFAULT 1,
  note       TEXT,
  summary    TEXT,
  refined    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 면접 질문 (글로벌 공유 — user_id 없음, seed 데이터)
CREATE TABLE IF NOT EXISTS questions (
  id         BIGSERIAL PRIMARY KEY,
  category   TEXT NOT NULL,
  question   TEXT NOT NULL UNIQUE,
  answer     TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 질문별 사용자 진행상태 (user_id 있음)
CREATE TABLE IF NOT EXISTS question_progress (
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  done        BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (user_id, question_id)
);

-- 질문 채팅 메시지
CREATE TABLE IF NOT EXISTS messages (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_messages_question ON messages(user_id, question_id);

-- 모의 면접 세션
CREATE TABLE IF NOT EXISTS interview_sessions (
  id               BIGSERIAL PRIMARY KEY,
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mode             TEXT NOT NULL CHECK(mode IN ('technical', 'pressure')),
  experience_years INTEGER NOT NULL DEFAULT 0,
  resume_id        BIGINT REFERENCES resumes(id),
  status           TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'completed')),
  analysis         TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 모의 면접 메시지
CREATE TABLE IF NOT EXISTS interview_messages (
  id         BIGSERIAL PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id BIGINT NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
  role       TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_interview_messages_session ON interview_messages(user_id, session_id);

-- 포트폴리오 프로젝트
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  period      TEXT,
  role        TEXT,
  tech_stack  TEXT,
  description TEXT,
  ai_content  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RLS (Row Level Security) 활성화
-- ============================================================

ALTER TABLE users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes            ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_progress  ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages           ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;

-- questions는 공유 데이터 — 전체 읽기 허용
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "questions_read_all" ON questions FOR SELECT USING (true);

-- ============================================================
-- RLS 정책 — service_role 키(서버)는 bypass, anon은 차단
-- 서버에서 service_role 키를 사용하므로 RLS bypass됨
-- 아래 정책은 anon/authenticated role 보호용
-- ============================================================

-- users: 자신만 조회
CREATE POLICY "users_self" ON users
  FOR ALL USING (id = auth.uid());

-- resumes: 자신 것만
CREATE POLICY "resumes_owner" ON resumes
  FOR ALL USING (user_id = auth.uid());

-- question_progress: 자신 것만
CREATE POLICY "progress_owner" ON question_progress
  FOR ALL USING (user_id = auth.uid());

-- messages: 자신 것만
CREATE POLICY "messages_owner" ON messages
  FOR ALL USING (user_id = auth.uid());

-- interview_sessions: 자신 것만
CREATE POLICY "sessions_owner" ON interview_sessions
  FOR ALL USING (user_id = auth.uid());

-- interview_messages: 자신 것만
CREATE POLICY "interview_messages_owner" ON interview_messages
  FOR ALL USING (user_id = auth.uid());

-- portfolio_projects: 자신 것만
CREATE POLICY "portfolio_owner" ON portfolio_projects
  FOR ALL USING (user_id = auth.uid());
