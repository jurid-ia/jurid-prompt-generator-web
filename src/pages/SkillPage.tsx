import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Target, TrendingUp, ArrowRight, Brain, BarChart3, Award, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/ui/Toast'
import { generateSkills, getLatestSkill } from '@/lib/api/skills'
import { getQuizResponses } from '@/lib/api/quiz'
import type { UserSkill } from '@/types'
import GlassCard from '@/components/ui/GlassCard'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } } }

const CHART_COLORS = ['#A78F69', '#C9A84C', '#5F4D37', '#1E3A5F', '#2563EB']

function RadialChart({ value, label, color }: { value: number; label: string; color: string }) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="#E7E5E4" strokeWidth="6" />
          <motion.circle
            cx="40" cy="40" r={radius} fill="none" stroke={color} strokeWidth="6"
            strokeLinecap="round" strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-brand-black">{value}%</span>
        </div>
      </div>
      <span className="text-xs text-brand-gray-600 mt-2 text-center font-medium">{label}</span>
    </div>
  )
}

export default function SkillPage() {
  const { profile, setProfile } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [skill, setSkill] = useState<UserSkill | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const didLoadRef = useRef(false)

  useEffect(() => {
    if (didLoadRef.current) return
    didLoadRef.current = true

    async function loadOrGenerate() {
      try {
        const existing = await getLatestSkill()
        setSkill(existing)
        setLoading(false)
      } catch {
        try {
          const quizzes = await getQuizResponses()
          if (quizzes.length === 0) {
            setLoading(false)
            return
          }
          setGenerating(true)
          setLoading(false)
          const generated = await generateSkills(quizzes[0].id)
          setSkill(generated)
          setGenerating(false)
          setProfile(prev => (prev ? { ...prev, quiz_completed: true } : prev))
        } catch (err) {
          setGenerating(false)
          toast(err instanceof Error ? err.message : 'Erro ao gerar perfil. Tente novamente.', 'error')
        }
      }
    }

    loadOrGenerate()
  }, [setProfile, toast])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 size={32} className="text-brand-primary animate-spin" />
      </div>
    )
  }

  if (generating) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <GlassCard variant="strong" padding="lg" className="max-w-md w-full text-center">
          <Loader2 size={48} className="text-brand-primary animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-bold text-brand-black mb-2">Analisando seu perfil jurídico...</h2>
          <p className="text-sm text-brand-gray-400">A Jurid AI está processando suas respostas e criando seu perfil personalizado. Isto pode levar alguns segundos.</p>
        </GlassCard>
      </div>
    )
  }

  if (!skill) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 animate-fade-in">
        <Sparkles size={48} className="text-brand-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-brand-black mb-2">Seu perfil IA ainda não foi gerado</h2>
        <p className="text-brand-gray-400 mb-6">Complete o quiz jurídico para a IA criar seu perfil profissional.</p>
        <Button onClick={() => navigate('/quiz')}>Iniciar Quiz <ArrowRight size={18} /></Button>
      </div>
    )
  }

  const indicators = skill.competency_indicators || []

  return (
    <motion.div className="max-w-4xl mx-auto space-y-5" variants={stagger} initial="hidden" animate="show">
      {/* Hero Card */}
      <motion.div variants={fadeUp}>
        <div className="relative glass-primary rounded-2xl p-5 lg:p-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-brand-primary/20 rounded-full blur-3xl" />
          <div className="relative flex flex-col sm:flex-row items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-blue/20 flex items-center justify-center shrink-0">
              <Brain size={32} className="text-brand-blue" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl lg:text-2xl font-bold text-brand-black">{skill.skill_name}</h2>
                <Badge variant="dark" size="sm">Jurid AI</Badge>
              </div>
              <p className="text-sm text-brand-gray-600 leading-relaxed">{skill.skill_description}</p>
              <div className="flex items-center gap-2 mt-3">
                <Award size={14} className="text-brand-primary-dark" />
                <span className="text-[11px] text-brand-gray-400">
                  Perfil gerado pela <strong className="text-brand-black">IA da Jurid</strong> com base nas suas respostas
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Radial Charts — competency_indicators dinamicos */}
      {indicators.length > 0 && (
        <motion.div variants={fadeUp}>
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={18} className="text-brand-blue" />
              <h3 className="font-semibold text-brand-black">Competências identificadas</h3>
              <Badge variant="dark" size="sm">Jurid AI</Badge>
            </div>
            <div className="flex justify-around flex-wrap gap-4">
              {indicators.map((ind, i) => (
                <RadialChart
                  key={ind.name}
                  value={ind.score}
                  label={ind.name}
                  color={CHART_COLORS[i % CHART_COLORS.length]}
                />
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Strengths + Growth */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={stagger}>
        <motion.div variants={fadeUp}>
          <GlassCard className="h-full">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={18} className="text-green-500" />
              <h3 className="font-semibold text-brand-black">Pontos fortes</h3>
            </div>
            <div className="space-y-2">
              {skill.strengths.map((s, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-green-50">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-green-600">{i + 1}</span>
                  </div>
                  <span className="text-sm text-brand-black font-medium">{s}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={fadeUp}>
          <GlassCard className="h-full">
            <div className="flex items-center gap-2 mb-3">
              <Target size={18} className="text-brand-primary-dark" />
              <h3 className="font-semibold text-brand-black">Áreas para crescer</h3>
            </div>
            <div className="space-y-2">
              {skill.growth_areas.map((a, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-brand-primary/5">
                  <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center shrink-0">
                    <Target size={12} className="text-brand-primary-dark" />
                  </div>
                  <span className="text-sm text-brand-black font-medium">{a}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>

      {/* Recommended Focus */}
      {skill.recommended_focus.length > 0 && (
        <motion.div variants={fadeUp}>
          <GlassCard>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-brand-primary-dark" />
              <h3 className="font-semibold text-brand-black">Foco recomendado pela Jurid AI</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skill.recommended_focus.map((f, i) => (
                <Badge key={i} variant="dark" size="md">{f}</Badge>
              ))}
            </div>
            <p className="text-[11px] text-brand-gray-400 mt-3">
              Baseado na análise do seu perfil jurídico, áreas de atuação e objetivos profissionais.
            </p>
          </GlassCard>
        </motion.div>
      )}

      {/* CTA: ir para prompts (Fase 6) */}
      {profile?.prompts_generated && (
        <motion.div variants={fadeUp} className="flex justify-end">
          <Button onClick={() => navigate('/prompts')}>
            Ver meus prompts <ArrowRight size={18} />
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}
