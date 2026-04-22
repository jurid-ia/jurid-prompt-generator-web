import type { QuizQuestion, QuizAnswer } from '@/types'
import { cn } from '@/lib/utils/cn'
import { quizIconMap } from '@/lib/utils/quiz-icons'

interface SingleChoiceProps {
  question: QuizQuestion
  value: string
  onChange: (value: QuizAnswer) => void
}

export default function SingleChoice({ question, value, onChange }: SingleChoiceProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-brand-black">{question.question}</h2>
      {question.subtitle && (
        <p className="text-sm text-brand-gray-400">{question.subtitle}</p>
      )}
      <div className="grid gap-2 mt-4">
        {question.options?.map(option => {
          const Icon = option.icon ? quizIconMap[option.icon] : null
          const isSelected = value === option.value
          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={cn(
                'flex items-center gap-3 px-4 py-3.5 rounded-xl text-left text-sm font-medium transition-all cursor-pointer border-2',
                isSelected
                  ? 'border-brand-yellow bg-brand-yellow/10 text-brand-black'
                  : 'border-brand-gray-200 bg-white text-brand-gray-600 hover:border-brand-yellow/50 hover:bg-brand-yellow/5'
              )}
            >
              {Icon && (
                <Icon
                  size={20}
                  className={cn(
                    'shrink-0',
                    isSelected ? 'text-brand-yellow' : 'text-brand-gray-400'
                  )}
                />
              )}
              <span>{option.label}</span>
              {isSelected && (
                <div className="ml-auto w-5 h-5 rounded-full bg-brand-yellow flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-brand-black" />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
