import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, Shield } from 'lucide-react'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('cookie-consent')
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-20 lg:bottom-0 left-0 right-0 z-[55] p-3 lg:p-4"
        >
          <div className="max-w-3xl mx-auto glass-strong rounded-2xl p-4 lg:p-5 shadow-2xl border border-brand-gray-200/50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                  <Cookie size={20} className="text-brand-primary-dark" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-black mb-0.5">Politica de Cookies e Privacidade</p>
                  <p className="text-xs text-brand-gray-400 leading-relaxed">
                    Utilizamos cookies para melhorar sua experiencia. Seus dados sao protegidos conforme a LGPD (Lei 13.709/2018).
                    <span className="inline-flex items-center gap-1 ml-1 text-brand-primary-dark"><Shield size={10} /> Dados seguros</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0 w-full sm:w-auto">
                <button
                  onClick={handleDecline}
                  className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-medium text-brand-gray-600 border border-brand-gray-200 rounded-xl hover:bg-brand-gray-200/30 transition-colors cursor-pointer"
                >
                  Recusar
                </button>
                <button
                  onClick={handleAccept}
                  className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-medium text-white bg-brand-primary-dark rounded-xl hover:bg-brand-primary-dark/90 transition-colors cursor-pointer"
                >
                  Aceitar cookies
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
