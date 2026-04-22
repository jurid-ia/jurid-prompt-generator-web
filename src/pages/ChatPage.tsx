import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Plus, Trash2, ArrowLeft, Copy, Check, Sparkles, Bot, User as UserIcon, Scale, Clock, ChevronRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/ui/Toast'
import {
  createConversation as apiCreateConversation,
  listConversations as apiListConversations,
  deleteConversation as apiDeleteConversation,
  getMessages as apiGetMessages,
  streamMessage as apiStreamMessage,
} from '@/lib/api/chat'
import type { ChatConversation, ChatMessage } from '@/types'
import Spinner from '@/components/ui/Spinner'
import { cn } from '@/lib/utils/cn'

function CopyMsg({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer active:scale-90 transition-all">
      {copied ? <Check size={10} className="text-green-400" /> : <Copy size={10} className="text-brand-gray-400" />}
      <span className={copied ? 'text-green-400' : 'text-brand-gray-400'}>{copied ? 'Copiado' : 'Copiar'}</span>
    </button>
  )
}

const suggestions = [
  { icon: Scale, text: 'Redigir petição inicial trabalhista', color: 'from-brand-blue/20 to-brand-blue/5' },
  { icon: Sparkles, text: 'Elaborar contestação em ação cível', color: 'from-brand-primary/20 to-brand-primary/5' },
  { icon: Bot, text: 'Criar parecer jurídico sobre LGPD', color: 'from-blue-500/20 to-cyan-500/10' },
  { icon: Clock, text: 'Contrato de honorários advocatícios', color: 'from-brand-primary-dark/20 to-brand-primary-dark/5' },
]

export default function ChatPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [streamedText, setStreamedText] = useState('')
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list' | 'chat'>('list')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    let cancelled = false
    apiListConversations()
      .then(list => { if (!cancelled) setConversations(list) })
      .catch(err => { if (!cancelled) toast(err instanceof Error ? err.message : 'Erro ao carregar conversas', 'error') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [toast])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamedText])

  const openConversation = async (id: string) => {
    setActiveConversation(id)
    setView('chat')
    try {
      const msgs = await apiGetMessages(id)
      setMessages(msgs)
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Erro ao carregar mensagens', 'error')
      setMessages([])
    }
  }

  const startNewConversation = async () => {
    try {
      const c = await apiCreateConversation('Nova conversa')
      setConversations(prev => [c, ...prev])
      setActiveConversation(c.id)
      setMessages([])
      setView('chat')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Erro ao criar conversa', 'error')
    }
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    try {
      await apiDeleteConversation(id)
      setConversations(prev => prev.filter(c => c.id !== id))
      if (activeConversation === id) {
        setActiveConversation(null)
        setMessages([])
        setView('list')
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Erro ao apagar conversa', 'error')
    }
  }

  const sendMessage = async (text?: string) => {
    const msg = (text || input).trim()
    if (!msg || !user || streaming) return

    let convId = activeConversation
    let convsUpdate: ChatConversation[] | null = null

    // Cria conversa lazy, usando as primeiras palavras como titulo
    if (!convId) {
      try {
        const c = await apiCreateConversation(msg.slice(0, 50))
        convId = c.id
        convsUpdate = [c, ...conversations]
        setConversations(convsUpdate)
        setActiveConversation(c.id)
        setView('chat')
      } catch (err) {
        toast(err instanceof Error ? err.message : 'Erro ao criar conversa', 'error')
        return
      }
    }

    // Mensagem otimista do usuario (apenas para feedback visual; o backend persiste a real)
    const optimisticUser: ChatMessage = {
      id: `optim-${Date.now()}`,
      conversation_id: convId,
      user_id: user.id,
      role: 'user',
      content: msg,
      tokens_used: null,
      model: null,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, optimisticUser])
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setStreaming(true)
    setStreamedText('')

    try {
      let full = ''
      for await (const chunk of apiStreamMessage(convId, msg)) {
        full += chunk
        setStreamedText(full)
      }

      // Stream terminou — re-fetch para pegar as mensagens canonicas do banco
      const canonical = await apiGetMessages(convId)
      setMessages(canonical)
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Erro ao gerar resposta', 'error')
    } finally {
      setStreaming(false)
      setStreamedText('')
    }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><Spinner size="lg" /></div>

  // ===== LIST VIEW =====
  if (view === 'list' || (!activeConversation && typeof window !== 'undefined' && window.innerWidth >= 1024)) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-5 animate-fade-in">
        <div className="text-center pt-2 pb-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-brand-blue/20 to-brand-blue/5 border border-brand-blue/20 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-blue/10">
            <Scale size={28} className="text-brand-blue" />
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-brand-black">Gerador de Prompts Jurídicos</h2>
          <p className="text-xs text-brand-gray-400 mt-1 max-w-sm mx-auto">
            Gere prompts para petições, contratos, pareceres e muito mais. Otimizados para advogados brasileiros.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {suggestions.map((s, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              onClick={() => { sendMessage(s.text) }}
              className="text-left glass-strong rounded-2xl p-4 cursor-pointer active:scale-[0.97] transition-all hover:shadow-md group"
            >
              <div className={cn('w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center mb-2.5', s.color)}>
                <s.icon size={18} className="text-brand-black/60 group-hover:text-brand-black transition-colors" />
              </div>
              <p className="text-xs font-medium text-brand-black leading-snug">{s.text}</p>
            </motion.button>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={startNewConversation}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-brand-blue text-white font-semibold text-sm hover:bg-brand-blue/90 transition-all cursor-pointer active:scale-[0.97] shadow-sm"
        >
          <Plus size={18} /> Nova conversa jurídica
        </motion.button>

        {conversations.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-brand-gray-400 uppercase tracking-wider mb-2 px-1">Histórico</h3>
            <div className="space-y-1.5">
              {conversations.map(conv => (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="group glass rounded-2xl flex items-center gap-3 px-4 py-3.5 cursor-pointer active:scale-[0.98] transition-all hover:shadow-sm"
                  onClick={() => openConversation(conv.id)}
                >
                  <div className="w-9 h-9 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                    <Scale size={16} className="text-brand-primary-dark" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-black truncate">{conv.title}</p>
                    <p className="text-[10px] text-brand-gray-400">{conv.message_count} mensagens</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={e => handleDelete(e, conv.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-brand-gray-400 transition-all cursor-pointer">
                      <Trash2 size={14} />
                    </button>
                    <ChevronRight size={16} className="text-brand-gray-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    )
  }

  // ===== CHAT VIEW =====
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-8rem)] -mx-4 lg:mx-0 animate-fade-in">
      <div className="flex items-center gap-3 px-4 py-3 glass-strong border-b border-white/20 shrink-0">
        <button onClick={() => { setView('list'); setActiveConversation(null); setMessages([]) }}
          className="p-2 rounded-xl hover:bg-brand-gray-200/30 cursor-pointer active:scale-90 transition-all">
          <ArrowLeft size={18} />
        </button>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-blue/20 to-brand-blue/5 border border-brand-blue/20 flex items-center justify-center">
          <Scale size={16} className="text-brand-blue" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-brand-black truncate">
            {conversations.find(c => c.id === activeConversation)?.title || 'Gerador de Prompts'}
          </p>
          <p className="text-[10px] text-brand-gray-400">Powered by Jurid AI</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto relative">
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #A78F69 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative p-4 lg:p-6 space-y-4 min-h-full">
          {messages.length === 0 && !streaming && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
              <div className="glass-strong rounded-3xl p-6 max-w-xs">
                <Scale size={28} className="text-brand-blue mx-auto mb-3" />
                <p className="text-sm font-medium text-brand-black mb-1">Pronto para gerar</p>
                <p className="text-xs text-brand-gray-400">Descreva a peça ou documento que precisa e receba um prompt jurídico profissional.</p>
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                className={cn('flex gap-2.5', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-brand-blue/20 to-brand-blue/5 border border-brand-blue/20 flex items-center justify-center shrink-0 mt-1">
                    <Scale size={13} className="text-brand-blue" />
                  </div>
                )}
                <div className={cn('max-w-[82%] lg:max-w-[70%]')}>
                  <div className={cn('rounded-2xl px-4 py-3 text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-brand-blue text-white rounded-br-md'
                      : 'glass-strong rounded-bl-md text-brand-black shadow-sm border border-white/30')}>
                    {msg.content.includes('```') ? (
                      <div className="space-y-2">
                        {msg.content.split(/(```[\s\S]*?```)/g).map((part, i) => {
                          if (part.startsWith('```')) {
                            const code = part.replace(/```\w*\n?/g, '').replace(/```$/g, '')
                            return (
                              <div key={i} className="relative rounded-xl bg-brand-black/[0.04] border border-brand-gray-200/50 overflow-hidden">
                                <div className="flex items-center justify-between px-3 py-1.5 border-b border-brand-gray-200/30">
                                  <span className="text-[9px] font-mono text-brand-gray-400">json</span>
                                  <CopyMsg text={code.trim()} />
                                </div>
                                <pre className="px-3 py-2 text-[11px] font-mono text-brand-gray-600 overflow-x-auto whitespace-pre-wrap">{code.trim()}</pre>
                              </div>
                            )
                          }
                          return part ? <span key={i} className="whitespace-pre-wrap">{part}</span> : null
                        })}
                      </div>
                    ) : (
                      <span className="whitespace-pre-wrap">{msg.content}</span>
                    )}
                  </div>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-1.5 ml-1">
                      <CopyMsg text={msg.content} />
                      <span className="text-[9px] text-brand-gray-400">Jurid AI</span>
                    </div>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-brand-primary-dark flex items-center justify-center shrink-0 mt-1">
                    <UserIcon size={13} className="text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {streaming && streamedText && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-brand-blue/20 to-brand-blue/5 border border-brand-blue/20 flex items-center justify-center shrink-0 mt-1">
                <Scale size={13} className="text-brand-blue" />
              </div>
              <div className="max-w-[82%] lg:max-w-[70%]">
                <div className="glass-strong rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed shadow-sm border border-white/30">
                  <span className="whitespace-pre-wrap">{streamedText}</span>
                  <span className="inline-block w-1.5 h-4 bg-brand-primary ml-0.5 animate-pulse rounded-sm" />
                </div>
              </div>
            </motion.div>
          )}

          {streaming && !streamedText && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-brand-blue/20 to-brand-blue/5 border border-brand-blue/20 flex items-center justify-center shrink-0">
                <Scale size={13} className="text-brand-blue" />
              </div>
              <div className="glass-strong rounded-2xl px-5 py-3.5 flex gap-1.5 shadow-sm border border-white/30">
                <span className="w-2 h-2 bg-brand-primary rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-brand-primary rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-brand-primary rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="shrink-0 glass-strong border-t border-white/20 p-3 lg:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-end gap-2.5 max-w-3xl mx-auto">
          <div className="flex-1 glass-strong rounded-2xl overflow-hidden border border-brand-gray-200/30 focus-within:border-brand-blue focus-within:shadow-[0_0_0_3px_rgba(30,58,95,0.1)] transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => { setInput(e.target.value); if (textareaRef.current) { textareaRef.current.style.height = 'auto'; textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px' } }}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder="Descreva a peça ou documento jurídico que precisa..."
              className="w-full resize-none bg-transparent px-4 py-3 text-sm focus:outline-none min-h-[44px] max-h-[120px] placeholder:text-brand-gray-400"
              rows={1}
            />
          </div>
          <button onClick={() => sendMessage()} disabled={!input.trim() || streaming}
            className={cn(
              'w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer active:scale-90 shrink-0',
              input.trim() && !streaming
                ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20 hover:shadow-lg hover:shadow-brand-blue/30'
                : 'bg-brand-gray-200 text-brand-gray-400'
            )}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
