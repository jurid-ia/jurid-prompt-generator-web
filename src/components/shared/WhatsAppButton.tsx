import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

const WHATSAPP_URL =
  "https://wa.me/5566996591485?text=Olá! Estou com problemas no Jurid Prompts.";

export default function WhatsAppButton() {
  const [tooltipVisible, setTooltipVisible] = useState(true);

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 z-50 flex flex-col items-end gap-2">
      {/* Tooltip */}
      <AnimatePresence>
        {tooltipVisible && (
          <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            className="relative block bg-white rounded-2xl shadow-xl border border-brand-gray-200/50 p-3.5 max-w-[220px] cursor-pointer hover:shadow-2xl transition-shadow"
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setTooltipVisible(false);
              }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-gray-200 rounded-full flex items-center justify-center hover:bg-brand-gray-400 transition-colors cursor-pointer min-h-auto"
            >
              <X size={10} className="text-brand-gray-600" />
            </button>
            <p className="text-xs text-brand-black font-medium leading-snug">
              Precisa de ajuda? Fale com nosso time jurídico pelo WhatsApp!
            </p>
            <div className="absolute bottom-0 right-5 translate-y-1/2 rotate-45 w-2.5 h-2.5 bg-white border-r border-b border-brand-gray-200/50" />
          </motion.a>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 2, stiffness: 200, damping: 15 }}
        className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 hover:scale-110 active:scale-95 transition-all cursor-pointer"
      >
        <MessageCircle size={26} fill="white" strokeWidth={0} />
      </motion.a>
    </div>
  );
}
