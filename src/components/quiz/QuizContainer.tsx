import { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/ui/Toast'
import { quizQuestions } from '@/config/quiz-questions'
import { submitQuiz } from '@/lib/api/quiz'
import type { QuizResponses, QuizAnswer } from '@/types'
import GlassCard from '@/components/ui/GlassCard'
import Button from '@/components/ui/Button'
import Progress from '@/components/ui/Progress'

import InfoSlide from './question-types/InfoSlide'
import TextQuestion from './question-types/TextQuestion'
import YesNoQuestion from './question-types/YesNoQuestion'
import SingleChoice from './question-types/SingleChoice'
import MultiChoice from './question-types/MultiChoice'
import RankOrder from './question-types/RankOrder'
import MediaSlide from './question-types/MediaSlide'

export default function QuizContainer() {
  const { setProfile } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [answers, setAnswers] = useState<QuizResponses>({})
  const [direction, setDirection] = useState(1)
  const [processing, setProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState('')
  const startTimeRef = useRef<number>(Date.now())

  const question = quizQuestions[currentSlide]
  const isFirst = currentSlide === 0
  const isLast = currentSlide === quizQuestions.length - 1
  const progress = ((currentSlide + 1) / quizQuestions.length) * 100

  const canAdvance = useCallback(() => {
    if (!question.required && ['info', 'media'].includes(question.type)) return true
    const answer = answers[question.id]
    if (question.type === 'info' || question.type === 'media') return true
    if (question.type === 'text') return typeof answer === 'string' && answer.trim().length > 0
    if (question.type === 'yes_no') return answer !== undefined && answer !== null
    if (question.type === 'single_choice') return !!answer
    if (question.type === 'multi_choice') return Array.isArray(answer) && answer.length > 0
    if (question.type === 'rank_order') return true
    return true
  }, [question, answers])

  const setAnswer = (value: QuizAnswer) => {
    setAnswers(prev => ({ ...prev, [question.id]: value }))
  }

  const goNext = async () => {
    if (question.type === 'rank_order' && !answers[question.id] && question.items) {
      setAnswers(prev => ({ ...prev, [question.id]: question.items! }))
    }

    if (isLast) {
      await processQuiz()
      return
    }
    setDirection(1)
    setCurrentSlide(prev => Math.min(prev + 1, quizQuestions.length - 1))
  }

  const goPrev = () => {
    setDirection(-1)
    setCurrentSlide(prev => Math.max(prev - 1, 0))
  }

  const processQuiz = async () => {
    setProcessing(true)
    setProcessingStep('Salvando suas respostas...')

    try {
      const painPoints = Array.isArray(answers.pain_points) ? (answers.pain_points as string[]) : []
      const timeSpentSeconds = Math.round((Date.now() - startTimeRef.current) / 1000)

      await submitQuiz(answers, painPoints, timeSpentSeconds)

      setProfile(prev => (prev ? { ...prev, quiz_completed: true } : prev))
      navigate('/skill')
    } catch (err) {
      setProcessing(false)
      toast(err instanceof Error ? err.message : 'Não foi possível salvar o quiz. Tente novamente.', 'error')
    }
  }

  const renderQuestion = () => {
    switch (question.type) {
      case 'info':
        return <InfoSlide question={question} />
      case 'text':
        return <TextQuestion question={question} value={(answers[question.id] as string) || ''} onChange={setAnswer} />
      case 'yes_no':
        return <YesNoQuestion question={question} value={answers[question.id] as boolean | null} onChange={setAnswer} />
      case 'single_choice':
        return <SingleChoice question={question} value={(answers[question.id] as string) || ''} onChange={setAnswer} />
      case 'multi_choice':
        return <MultiChoice question={question} value={(answers[question.id] as string[]) || []} onChange={setAnswer} maxSelections={question.maxSelections} />
      case 'rank_order':
        return <RankOrder question={question} value={(answers[question.id] as string[]) || question.items || []} onChange={setAnswer} />
      case 'media':
        return <MediaSlide question={question} />
      default:
        return null
    }
  }

  if (processing) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <GlassCard variant="strong" padding="lg" className="max-w-md w-full text-center">
          <Loader2 size={48} className="text-brand-primary animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-bold text-brand-black mb-2">Processando...</h2>
          <p className="text-sm text-brand-gray-400">{processingStep}</p>
          <div className="mt-6">
            <Progress value={
              processingStep.includes('Salvando') ? 25 :
              processingStep.includes('Analisando') ? 50 :
              processingStep.includes('Gerando') ? 75 :
              processingStep.includes('Finalizando') ? 95 : 10
            } />
          </div>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4 min-[390px]:mb-6 lg:mb-8">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-brand-gray-400">
            {currentSlide + 1} de {quizQuestions.length}
          </span>
          <span className="text-[11px] text-brand-gray-400">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} size="sm" />
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          initial={{ opacity: 0, x: direction * 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -30 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          <GlassCard variant="strong" padding="none" className="p-4 min-[390px]:p-5 lg:p-8 min-h-[260px] min-[390px]:min-h-[300px] flex flex-col justify-center">
            {renderQuestion()}
          </GlassCard>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between mt-4 min-[390px]:mt-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={goPrev}
          disabled={isFirst}
          className={isFirst ? 'invisible' : ''}
        >
          <ArrowLeft size={16} /> <span className="hidden min-[390px]:inline">Voltar</span>
        </Button>

        <Button
          onClick={goNext}
          disabled={!canAdvance()}
          size="md"
          className="min-[390px]:!text-base min-[390px]:!px-6 min-[390px]:!py-3"
        >
          {isLast ? 'Gerar prompts' : 'Continuar'} <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  )
}
