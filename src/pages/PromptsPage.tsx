import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Download, ArrowRight, ChevronDown, ChevronUp, Copy, Check, Code2, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/ui/Toast'
import { getPrompts, generatePrompts } from '@/lib/api/prompts'
import { getQuizResponses } from '@/lib/api/quiz'
import type { GeneratedPrompt } from '@/types'
import GlassCard from '@/components/ui/GlassCard'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/shared/EmptyState'

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }
const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } } }

function CopyBtn({ text, label, full }: { text: string; label?: string; full?: boolean }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (full) {
    return (
      <button
        onClick={handleCopy}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer active:scale-[0.97] ${
          copied ? 'bg-green-100 text-green-700' : 'bg-brand-blue text-white hover:bg-brand-blue/90'
        }`}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? 'Copiado!' : label || 'Copiar Prompt'}
      </button>
    )
  }

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer active:scale-95 ${
        copied ? 'bg-green-100 text-green-700' : 'bg-brand-primary/15 text-brand-primary-dark hover:bg-brand-primary/25'
      }`}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? 'Copiado' : label || 'Copiar'}
    </button>
  )
}

function buildPromptJson(p: GeneratedPrompt) {
  return JSON.stringify({
    categoria: p.category,
    situacao: p.situation,
    prompt: p.prompt_text,
    variacoes: p.variations,
    dica_de_ouro: p.golden_tip,
    tempo_economizado: p.estimated_time_saved,
  }, null, 2)
}

export default function PromptsPage() {
  const { setProfile } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [prompts, setPrompts] = useState<GeneratedPrompt[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null)
  const [showJsonFor, setShowJsonFor] = useState<string | null>(null)
  const didLoadRef = useRef(false)

  useEffect(() => {
    if (didLoadRef.current) return
    didLoadRef.current = true

    async function loadOrGenerate() {
      try {
        const existing = await getPrompts()
        if (existing.length > 0) {
          setPrompts(existing)
          setLoading(false)
          return
        }
        const quizzes = await getQuizResponses()
        if (quizzes.length === 0) {
          setLoading(false)
          return
        }
        setGenerating(true)
        setLoading(false)
        const result = await generatePrompts(quizzes[0].id)
        setPrompts(result.prompts)
        setGenerating(false)
        setProfile(prev => (prev ? { ...prev, prompts_generated: true } : prev))
      } catch (err) {
        setGenerating(false)
        setLoading(false)
        const msg = err instanceof Error ? err.message : 'Erro ao carregar prompts.'
        toast(msg, 'error')
        if (msg.toLowerCase().includes('skill')) {
          navigate('/skill')
        }
      }
    }

    loadOrGenerate()
  }, [setProfile, toast, navigate])

  const categories = useMemo(() => {
    return Array.from(new Set(prompts.map(p => p.category)))
  }, [prompts])

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
          <h2 className="text-xl font-bold text-brand-black mb-2">Gerando seus prompts personalizados...</h2>
          <p className="text-sm text-brand-gray-400">A Jurid AI está criando 5 prompts sob medida para o seu perfil. Isto leva alguns segundos.</p>
        </GlassCard>
      </div>
    )
  }

  if (prompts.length === 0) {
    return (
      <EmptyState
        icon={<FileText size={48} />}
        title="Nenhum prompt gerado ainda"
        description="Complete o quiz jurídico para a IA criar seus prompts personalizados."
        action={<Button onClick={() => navigate('/quiz')}>Iniciar Quiz <ArrowRight size={18} /></Button>}
      />
    )
  }

  const filtered = activeCategory === 'all' ? prompts : prompts.filter(p => p.category === activeCategory)

  return (
    <motion.div className="max-w-4xl mx-auto space-y-4" variants={stagger} initial="hidden" animate="show">
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h2 className="text-lg lg:text-xl font-bold text-brand-black">{prompts.length} Prompts Jurídicos</h2>
          <p className="text-xs text-brand-gray-400">Todos em JSON — copie e cole na sua IA</p>
        </div>
        <Button variant="secondary" size="sm" className="hidden sm:flex"><Download size={14} /> PDF</Button>
        <button className="sm:hidden w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center shadow-lg cursor-pointer active:scale-90"><Download size={18} /></button>
      </motion.div>

      <motion.div variants={fadeUp} className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
            activeCategory === 'all' ? 'bg-brand-blue text-white shadow-sm' : 'bg-white text-brand-gray-600 border border-brand-gray-200'
          }`}
        >
          Todos ({prompts.length})
        </button>
        {categories.map(cat => {
          const count = prompts.filter(p => p.category === cat).length
          return (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
                activeCategory === cat ? 'bg-brand-primary text-white shadow-sm' : 'bg-white text-brand-gray-600 border border-brand-gray-200'
              }`}
            >{cat} ({count})</button>
          )
        })}
      </motion.div>

      <motion.div className="space-y-3" variants={stagger}>
        {filtered.map(prompt => {
          const isExpanded = expandedPrompt === prompt.id
          const jsonVisible = showJsonFor === prompt.id
          const jsonStr = buildPromptJson(prompt)

          return (
            <motion.div key={prompt.id} variants={fadeUp}>
              <GlassCard padding="none" className="overflow-hidden">
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="primary" size="sm">{prompt.category}</Badge>
                      <span className="text-[10px] text-brand-gray-400">#{prompt.prompt_index}</span>
                      {prompt.estimated_time_saved && (
                        <span className="text-[10px] text-brand-gray-400">~{prompt.estimated_time_saved} economizados</span>
                      )}
                    </div>
                    <CopyBtn text={buildPromptJson(prompt)} label="Copiar" />
                  </div>

                  <h3 className="text-sm font-semibold text-brand-black mb-1">{prompt.situation}</h3>
                  <p className="text-xs text-brand-gray-400 mb-3 line-clamp-2">
                    {prompt.prompt_text.slice(0, 140)}...
                  </p>

                  <div className="rounded-xl bg-brand-black/[0.03] border border-brand-gray-200/50 overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-brand-gray-200/30">
                      <div className="flex items-center gap-1.5">
                        <Code2 size={13} className="text-brand-gray-400" />
                        <span className="text-[10px] font-mono text-brand-gray-400">prompt.json</span>
                      </div>
                      <CopyBtn text={jsonStr} label="Copiar JSON" />
                    </div>
                    <pre className={`px-3 py-2.5 text-[11px] font-mono text-brand-gray-600 overflow-x-auto ${!jsonVisible ? 'max-h-20' : 'max-h-[500px]'} transition-all duration-300`}>
                      {jsonVisible ? jsonStr : jsonStr.split('\n').slice(0, 5).join('\n') + '\n  ...'}
                    </pre>
                    <button
                      onClick={() => setShowJsonFor(jsonVisible ? null : prompt.id)}
                      className="w-full flex items-center justify-center gap-1 py-2 text-[11px] font-medium text-brand-primary-dark hover:bg-brand-primary/5 border-t border-brand-gray-200/30 cursor-pointer active:bg-brand-primary/10 transition-colors"
                    >
                      {jsonVisible ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      {jsonVisible ? 'Recolher JSON' : 'Mostrar JSON completo'}
                    </button>
                  </div>

                  <div className="mt-3">
                    <CopyBtn text={jsonStr} label="Copiar JSON Completo" full />
                  </div>

                  {(prompt.variations.length > 0 || prompt.golden_tip) && (
                    <button
                      onClick={() => setExpandedPrompt(isExpanded ? null : prompt.id)}
                      className="flex items-center gap-1 text-xs text-brand-gray-400 font-medium mt-3 cursor-pointer active:opacity-70"
                    >
                      {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      {isExpanded ? 'Fechar' : `${prompt.variations.length} variações + dica de ouro`}
                    </button>
                  )}
                </div>

                {isExpanded && (
                  <div className="border-t border-brand-gray-200/50 p-4 sm:p-5 bg-brand-gray-200/5 space-y-3">
                    {prompt.variations.map((v, i) => (
                      <div key={i} className="glass rounded-xl p-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-semibold text-brand-gray-600">{v.context}</p>
                          <CopyBtn text={JSON.stringify({ contexto: v.context, prompt: v.prompt }, null, 2)} label="JSON" />
                        </div>
                        <p className="text-xs text-brand-gray-600 line-clamp-3">{v.prompt}</p>
                      </div>
                    ))}
                    {prompt.golden_tip && (
                      <div className="glass-primary rounded-xl p-3">
                        <p className="text-xs font-bold text-brand-primary-dark mb-1">Dica de Ouro</p>
                        <p className="text-xs text-brand-gray-600">{prompt.golden_tip}</p>
                      </div>
                    )}
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
