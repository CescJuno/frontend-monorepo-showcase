import { getProvider, getExtractionProvider } from './ai'
import { maskPII } from './mask'
import type { Message, InterviewMessage, ProjectInput, ResumeFields } from './types'

export async function refineResume(content: string): Promise<string> {
  return getProvider().refineResume(maskPII(content))
}

export async function summarizeResume(content: string): Promise<string> {
  return getProvider().summarizeResume(maskPII(content))
}

export async function chatAnswer(question: string, messages: Message[]): Promise<string> {
  return getProvider().chatAnswer(question, messages)
}

export async function conductInterview(
  mode: 'technical' | 'pressure',
  expYears: number,
  resume: string,
  messages: Message[],
): Promise<string> {
  return getProvider().conductInterview(mode, expYears, maskPII(resume), messages)
}

export async function analyzeInterview(mode: 'technical' | 'pressure', messages: InterviewMessage[]): Promise<string> {
  return getProvider().analyzeInterview(mode, messages)
}

export async function generatePortfolio(project: ProjectInput): Promise<string> {
  return getProvider().generatePortfolio(project)
}

export async function extractResumeFields(content: string): Promise<ResumeFields> {
  return getExtractionProvider().extractResumeFields(maskPII(content))
}
