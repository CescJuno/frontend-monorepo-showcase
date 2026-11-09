export interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface Resume {
  id: number
  content: string
  version: number
  note: string | null
  summary: string | null
  refined: string | null
  created_at: string
}

export interface Question {
  id: number
  category: string
  question: string
  answer: string | null
  done: 0 | 1
  created_at: string
}

export interface InterviewSession {
  id: number
  mode: 'technical' | 'pressure'
  experience_years: number
  resume_id: number | null
  status: 'active' | 'completed'
  analysis: string | null
  created_at: string
}

export interface InterviewMessage {
  id: number
  session_id: number
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface PortfolioProject {
  id: number
  title: string
  period: string | null
  role: string | null
  tech_stack: string | null
  description: string | null
  ai_content: string | null
  created_at: string
}

export interface ProjectInput {
  title: string
  period?: string
  role?: string
  tech_stack?: string
  description?: string
}

export interface ResumeFields {
  summary: string
  skills: string[]
  careers: { company: string; role: string; period: string; description: string }[]
  education: { school: string; degree: string; period: string }[]
}
