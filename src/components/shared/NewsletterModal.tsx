import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Sparkles, ArrowRight } from 'lucide-react'

export default function NewsletterModal() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem('newsletter-modal-seen')
    if (alreadySeen) return

    const timer = setTimeout(() => setVisible(true), 25000) // 25 seconds
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    sessionStorage.setItem('newsletter-modal-seen', 'true')
    setVisible(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
    setTimeout(handleClose, 2500)
  }

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-[62] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-brand-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full sm:max-w-md glass-strong rounded-t-3xl sm:rounded-2xl overflow-hidden pb-[env(safe-area-inset-bottom)]"
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 p-2 bg-brand-black/10 hover:bg-brand-black/20 rounded-full transition-colors cursor-pointer"
            >
              <X size={16} className="text-brand-gray-600" />
            </button>

            {/* Header illustration */}
            <div className="w-full h-32 bg-gradient-to-br from-brand-primary-dark via-brand-primary-dark/90 to-brand-blue flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, #C9A84C 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
              <div className="text-center relative z-10">
                <Mail size={36} className="text-white/80 mx-auto mb-1" />
                <Sparkles size={16} className="text-brand-primary-light absolute -top-1 -right-3" />
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {!submitted ? (
                <>
                  <h3 className="text-lg font-bold text-brand-black text-center mb-1">Dicas de IA para Advogados</h3>
                  <p className="text-sm text-brand-gray-400 text-center mb-5">
                    Receba semanalmente prompts juridicos exclusivos, dicas de IA e novidades do Jurid. Gratis.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary-dark text-white rounded-xl font-semibold text-sm hover:bg-brand-primary-dark/90 transition-colors cursor-pointer active:scale-[0.97]"
                    >
                      Quero receber <ArrowRight size={16} />
                    </button>
                  </form>

                  <p className="text-[10px] text-brand-gray-400 text-center mt-3">
                    Sem spam. Cancele quando quiser. Dados protegidos pela LGPD.
                  </p>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <Sparkles size={24} className="text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-black mb-1">Inscricao confirmada!</h3>
                  <p className="text-sm text-brand-gray-400">Voce recebera nossas dicas juridicas em breve.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
