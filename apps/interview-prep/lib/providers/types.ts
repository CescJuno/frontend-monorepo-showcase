import type { Message, InterviewMessage, ProjectInput, ResumeFields } from '../types'

export interface AIProvider {
  refineResume(content: string): Promise<string>
  summarizeResume(content: string): Promise<string>
  chatAnswer(question: string, messages: Message[]): Promise<string>
  conductInterview(
    mode: 'technical' | 'pressure',
    expYears: number,
    resume: string,
    messages: Message[],
  ): Promise<string>
  analyzeInterview(mode: 'technical' | 'pressure', messages: InterviewMessage[]): Promise<string>
  generatePortfolio(project: ProjectInput): Promise<string>
  extractResumeFields(content: string): Promise<ResumeFields>
}
