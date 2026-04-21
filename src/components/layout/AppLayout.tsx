import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import MobileBottomNav from './MobileBottomNav'
import AdBanner from '@/components/shared/AdBanner'
import PopupAd from '@/components/shared/PopupAd'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import CookieConsent from '@/components/shared/CookieConsent'
import NewsletterModal from '@/components/shared/NewsletterModal'
import FeatureAnnouncementModal from '@/components/shared/FeatureAnnouncementModal'
import FeedbackSlideIn from '@/components/shared/FeedbackSlideIn'
import { cn } from '@/lib/utils/cn'

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/quiz': 'Quiz Juridico',
  '/skill': 'Meu Perfil IA',
  '/prompts': 'Meus Prompts',
  '/chat': 'Gerador de Prompts',
  '/training': 'Treinamentos',
  '/profile': 'Meu Perfil',
}

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()

  const title = pageTitles[location.pathname] || ''

  return (
    <div className="min-h-screen bg-brand-white">
      {/* Top promotional banner */}
      <AdBanner
        id="top-promo"
        variant="top"
        title="Jurid IA PRO — prompts ilimitados + peticoes automaticas"
        ctaText="Conhecer PRO"
      />

      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <TopBar sidebarCollapsed={sidebarCollapsed} title={title} />

      <main
        className={cn(
          'transition-all duration-300 min-h-[calc(100dvh-3rem)]',
          sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[240px]',
          'lg:p-6',
          'ml-0 px-3 py-3 pb-[6.5rem]',
          'min-[390px]:px-4 min-[390px]:py-4',
        )}
      >
        <Outlet />
      </main>

      <MobileBottomNav />

      {/* ===== MODALS & POPUPS ===== */}

      {/* Feature announcement — shows after 3s (first visit welcome) */}
      <FeatureAnnouncementModal />

      {/* Promotional popup — shows after 15s */}
      <PopupAd
        id="jurid-pro-offer"
        delayMs={15000}
        title="Quer peticoes automaticas?"
        description="Com o Jurid IA PRO, gere peticoes completas, pesquise jurisprudencia e revise contratos — tudo com IA."
        ctaText="Quero conhecer o PRO"
      />

      {/* Newsletter modal — shows after 25s */}
      <NewsletterModal />

      {/* Feedback slide-in — shows after 45s (desktop only) */}
      <FeedbackSlideIn />

      {/* Cookie consent — shows after 1.5s */}
      <CookieConsent />

      {/* WhatsApp floating button */}
      <WhatsAppButton />
    </div>
  )
}
