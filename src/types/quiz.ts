export type QuizSlideType = 'info' | 'text' | 'yes_no' | 'single_choice' | 'multi_choice' | 'rank_order' | 'media'

export interface QuizOption {
  value: string
  label: string
  icon?: string
}

export interface QuizQuestion {
  id: string
  type: QuizSlideType
  question?: string
  subtitle?: string
  title?: string
  placeholder?: string
  options?: QuizOption[]
  maxSelections?: number
  mediaUrl?: string
  mediaType?: 'image' | 'video'
  required?: boolean
  items?: string[]
  icon?: string
}

export type QuizAnswer = string | string[] | boolean | null

export interface QuizResponses {
  [questionId: string]: QuizAnswer
}

export type QuizStatus = 'idle' | 'active' | 'submitting' | 'processing' | 'complete'

export interface QuizState {
  currentSlide: number
  answers: QuizResponses
  status: QuizStatus
  startedAt: number | null
}
