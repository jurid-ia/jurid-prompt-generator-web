import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, MessageSquare } from 'lucide-react'

export default function FeedbackSlideIn() {
  const [visible, setVisible] = useState(false)
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem('feedback-seen')
    if (alreadySeen) return

    const timer = setTimeout(() => setVisible(true), 45000) // 45 seconds
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    sessionStorage.setItem('feedback-seen', 'true')
    setVisible(false)
  }

  const handleSubmit = () => {
    if (rating === 0) return
    setSubmitted(true)
    setTimeout(handleClose, 2000)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="fixed top-20 right-4 z-[58] w-[300px] glass-strong rounded-2xl shadow-2xl border border-brand-gray-200/50 overflow-hidden hidden lg:block"
        >
          <button
            onClick={handleClose}
            className="absolute top-2.5 right-2.5 p-1.5 bg-brand-black/5 hover:bg-brand-black/10 rounded-full transition-colors cursor-pointer min-h-auto"
          >
            <X size={14} className="text-brand-gray-400" />
          </button>

          <div className="p-4">
            {!submitted ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                    <MessageSquare size={16} className="text-brand-primary-dark" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-black">Como está sua experiência?</p>
                    <p className="text-[10px] text-brand-gray-400">Avalie o Jurid Prompts</p>
                  </div>
                </div>

                {/* Star rating */}
                <div className="flex justify-center gap-1 mb-3 py-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      className="p-1 cursor-pointer active:scale-90 transition-transform min-h-auto"
                    >
                      <Star
                        size={28}
                        className={`transition-colors ${
                          star <= (hovered || rating)
                            ? 'text-brand-primary-light fill-brand-primary-light'
                            : 'text-brand-gray-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  placeholder="Conte o que podemos melhorar... (opcional)"
                  className="w-full px-3 py-2.5 rounded-xl border border-brand-gray-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none min-h-[60px]"
                  rows={2}
                />

                <button
                  onClick={handleSubmit}
                  disabled={rating === 0}
                  className="w-full mt-3 px-4 py-2.5 bg-brand-primary-dark text-white rounded-xl text-xs font-semibold hover:bg-brand-primary-dark/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer active:scale-[0.97]"
                >
                  Enviar avaliação
                </button>
              </>
            ) : (
              <div className="text-center py-3">
                <Star size={32} className="text-brand-primary-light fill-brand-primary-light mx-auto mb-2" />
                <p className="text-sm font-semibold text-brand-black">Obrigado!</p>
                <p className="text-xs text-brand-gray-400">Sua opinião é muito importante.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
