import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Rocket, Star, Zap, ArrowRight } from 'lucide-react'
import Badge from '@/components/ui/Badge'

const features = [
  { icon: Zap, title: 'Gerador de Petições com IA', desc: 'Gere petições completas em segundos com prompts otimizados.' },
  { icon: Star, title: 'Pesquisa de Jurisprudência', desc: 'Encontre precedentes relevantes com busca inteligente.' },
  { icon: Rocket, title: 'Revisão de Contratos', desc: 'Revise contratos automaticamente e identifique riscos.' },
]

export default function FeatureAnnouncementModal() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem('feature-announcement-seen')
    if (alreadySeen) return

    const timer = setTimeout(() => setVisible(true), 3000) // 3 seconds
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    sessionStorage.setItem('feature-announcement-seen', 'true')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-[61] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-brand-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="relative w-full sm:max-w-lg glass-strong rounded-t-3xl sm:rounded-2xl overflow-hidden pb-[env(safe-area-inset-bottom)]"
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 p-2 bg-brand-black/10 hover:bg-brand-black/20 rounded-full transition-colors cursor-pointer"
            >
              <X size={16} className="text-brand-gray-600" />
            </button>

            {/* Header */}
            <div className="relative bg-gradient-to-br from-brand-primary-dark to-brand-blue p-6 text-center overflow-hidden">
              <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, #C9A84C 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
              <div className="relative z-10">
                <Badge variant="primary" size="sm" className="mb-3 bg-white/20 text-white border-0">Novidades</Badge>
                <h2 className="text-xl font-bold text-white mb-1">Bem-vindo ao Jurid IA!</h2>
                <p className="text-sm text-white/70">Confira o que preparamos para sua advocacia</p>
              </div>
            </div>

            {/* Features */}
            <div className="p-5 sm:p-6 space-y-3">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-brand-primary/5 border border-brand-primary/10"
                >
                  <div className="w-9 h-9 rounded-xl bg-brand-primary/15 flex items-center justify-center shrink-0">
                    <f.icon size={18} className="text-brand-primary-dark" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-black">{f.title}</p>
                    <p className="text-xs text-brand-gray-400 mt-0.5">{f.desc}</p>
                  </div>
                </motion.div>
              ))}

              <button
                onClick={handleClose}
                className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-3.5 bg-brand-primary-dark text-white rounded-xl font-semibold text-sm hover:bg-brand-primary-dark/90 transition-colors cursor-pointer active:scale-[0.97]"
              >
                Começar agora <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
