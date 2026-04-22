import AdBanner from "@/components/shared/AdBanner";
import Badge from "@/components/ui/Badge";
import GlassCard from "@/components/ui/GlassCard";
import { useAuth } from "@/contexts/AuthContext";
import { getPrompts } from "@/lib/api/prompts";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  ClipboardList,
  Copy,
  ExternalLink,
  FileText,
  GraduationCap,
  MessageSquare,
  Sparkles,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: -16 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

/* ===== SVG Social Icons ===== */
function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
      <path
        d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
        fill="#FF0000"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
      <defs>
        <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <path
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
        fill="url(#ig-grad)"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
      <path
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
        fill="#0A66C2"
      />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
      <path
        d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
        fill="#1C1917"
      />
    </svg>
  );
}

function XTwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        fill="#1C1917"
      />
    </svg>
  );
}

const socialLinks = [
  {
    id: "youtube",
    Icon: YouTubeIcon,
    label: "YouTube",
    handle: "@juridia",
    bg: "bg-red-50 hover:bg-red-100",
    href: "#",
  },
  {
    id: "instagram",
    Icon: InstagramIcon,
    label: "Instagram",
    handle: "@juridia",
    bg: "bg-pink-50 hover:bg-pink-100",
    href: "#",
  },
  {
    id: "linkedin",
    Icon: LinkedInIcon,
    label: "LinkedIn",
    handle: "/juridia",
    bg: "bg-blue-50 hover:bg-blue-100",
    href: "#",
  },
  {
    id: "tiktok",
    Icon: TikTokIcon,
    label: "TikTok",
    handle: "@juridia",
    bg: "bg-stone-50 hover:bg-stone-100",
    href: "#",
  },
  {
    id: "twitter",
    Icon: XTwitterIcon,
    label: "X (Twitter)",
    handle: "@juridia",
    bg: "bg-stone-50 hover:bg-stone-100",
    href: "#",
  },
];

const products = [
  {
    id: "prod-1",
    title: "Jurid Chat — Assistente IA",
    desc: "Chat inteligente para advogados. Pesquisa jurisprudência, redige peças e responde dúvidas jurídicas em tempo real.",
    price: "Em breve",
    image: "/public/2.png",
    href: "#",
  },
  {
    id: "prod-2",
    title: "Jurid Voice — Transcrição Jurídica",
    desc: "Transcreva audiências, reuniões e depoimentos automaticamente com IA. Gera atas e resumos profissionais.",
    price: "Em breve",
    image: "/public/3.png",
    href: "#",
  },
  {
    id: "prod-3",
    title: "Jurid Contratos — Gerador de Contratos",
    desc: "Crie e revise contratos com IA. Templates profissionais para todas as áreas do Direito.",
    price: "Em breve",
    image: "/public/4.png",
    href: "#",
  },
];

export default function DashboardPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [promptsCount, setPromptsCount] = useState<number | null>(null);
  const didLoadRef = useRef(false);

  const greeting = profile?.display_name || profile?.full_name || "Advogado";
  const quizDone = profile?.quiz_completed;
  const promptsDone = profile?.prompts_generated;

  useEffect(() => {
    if (didLoadRef.current) return;
    didLoadRef.current = true;
    if (!promptsDone) return;

    getPrompts()
      .then((list) => setPromptsCount(list.length))
      .catch(() => setPromptsCount(0));
  }, [promptsDone]);

  return (
    <motion.div
      className="max-w-6xl mx-auto space-y-5"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Welcome */}
      <motion.div variants={fadeRight}>
        <h2 className="text-xl lg:text-2xl font-bold text-brand-black">
          Olá, {greeting}!
        </h2>
        <p className="text-brand-gray-400 text-xs sm:text-sm mt-0.5">
          {!quizDone
            ? "Complete o quiz para receber seus prompts jurídicos personalizados."
            : "Seus prompts jurídicos estão prontos. Explore e use no seu dia a dia."}
        </p>
      </motion.div>

      {/* Hero Banner */}
      <motion.div variants={fadeUp}>
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-primary-dark via-brand-primary-dark/95 to-brand-blue/80 p-6 lg:p-8">
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-brand-primary-light/10 rounded-full blur-2xl" />
          <div
            className="absolute top-2 right-2 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #C9A84C 1px, transparent 1px)",
              backgroundSize: "16px 16px",
              width: "200px",
              height: "200px",
            }}
          />
          <div className="relative flex items-center gap-5">
            <div className="w-16 h-16 lg:w-20 lg:h-20 shrink-0">
              <img
                src="/images/logo/iconWhite.png"
                alt="Jurid IA"
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>
            <div>
              <h3 className="text-lg lg:text-2xl font-bold text-white">
                Jurid IA
              </h3>
              <p className="text-[11px] lg:text-sm text-white/60 font-medium tracking-wide uppercase">
                Melhor amiga do advogado
              </p>
              <p className="text-xs lg:text-sm text-white/70 mt-1.5 max-w-md">
                Gerador de prompts inteligentes para advogados. Economize horas
                na redação de peças, contratos e pareceres.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quiz CTA / Generating / Completed status */}
      {!quizDone ? (
        <motion.button
          variants={fadeUp}
          onClick={() => navigate("/quiz")}
          className="w-full text-left cursor-pointer active:scale-[0.98] transition-transform"
        >
          <div className="relative glass-primary rounded-2xl p-5 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={18} className="text-brand-primary-dark" />
                <Badge variant="primary">Próximo passo</Badge>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-brand-black mb-1">
                Complete seu Quiz Jurídico
              </h3>
              <p className="text-xs sm:text-sm text-brand-gray-600 pr-12">
                A IA vai gerar prompts personalizados para sua área de atuação.
                Leva 3 minutos.
              </p>
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center shadow-sm">
                  <ArrowRight size={20} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.button>
      ) : promptsCount !== null && promptsCount > 0 ? (
        <motion.div variants={fadeUp}>
          <button
            onClick={() => navigate("/prompts")}
            className="w-full text-left cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div
              className="rounded-2xl px-4 py-3 border border-green-200 bg-green-50 flex items-center gap-3"
              style={{ backdropFilter: "blur(8px)" }}
            >
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                <Check size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-semibold text-green-700">
                  Quiz concluído
                </span>
                <p className="text-xs text-green-600">
                  {`${promptsCount} prompt${promptsCount === 1 ? "" : "s"} jurídico${promptsCount === 1 ? "" : "s"} ${promptsCount === 1 ? "pronto" : "prontos"} para usar`}
                </p>
              </div>
              <ChevronRight size={16} className="text-green-400 shrink-0" />
            </div>
          </button>
        </motion.div>
      ) : (
        <motion.button
          variants={fadeUp}
          onClick={() => navigate("/prompts")}
          className="w-full text-left cursor-pointer active:scale-[0.98] transition-transform"
        >
          <div className="rounded-2xl px-4 py-3 border border-brand-primary/30 bg-brand-primary/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-primary-dark flex items-center justify-center shrink-0">
              <Sparkles size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <span className="text-sm font-semibold text-brand-primary-dark">
                Gerar seus prompts
              </span>
              <p className="text-xs text-brand-gray-600">
                Quiz concluído. Abra a aba Prompts para gerar os seus.
              </p>
            </div>
            <ChevronRight size={16} className="text-brand-primary-dark shrink-0" />
          </div>
        </motion.button>
      )}

      {/* Quick Action Grid */}
      <motion.div
        className="grid grid-cols-2 gap-2 min-[390px]:gap-3"
        variants={stagger}
      >
        {[
          {
            icon: FileText,
            label: "Meus Prompts",
            desc: !quizDone
              ? "Faça o quiz primeiro"
              : promptsCount === null
                ? "Carregando..."
                : promptsCount === 0
                  ? "Abra para gerar"
                  : `${promptsCount} ${promptsCount === 1 ? "pronto" : "prontos"} para usar`,
            extra:
              promptsCount !== null && promptsCount > 0 ? (
                <span className="flex items-center gap-1 mt-2 text-brand-primary-dark">
                  <Copy size={12} />
                  <span className="text-[10px] font-medium">Copiar e colar</span>
                </span>
              ) : null,
            to: "/prompts",
            color: "bg-brand-primary/10",
            iconColor: "text-brand-primary-dark",
          },
          {
            icon: MessageSquare,
            label: "Gerador de Prompts",
            desc: "Crie e refine prompts jurídicos",
            extra: null,
            to: "/chat",
            color: "bg-brand-blue/10",
            iconColor: "text-brand-blue",
          },
          {
            icon: GraduationCap,
            label: "Treinamentos",
            desc: "Aprenda IA para advocacia",
            extra: null,
            to: "/training",
            color: "bg-brand-primary-light/10",
            iconColor: "text-brand-primary-light",
          },
          {
            icon: Sparkles,
            label: "Meu Perfil IA",
            desc: "Seu perfil profissional jurídico",
            extra: null,
            to: "/skill",
            color: "bg-brand-primary-dark/10",
            iconColor: "text-brand-primary-dark",
          },
        ].map((item, i) => (
          <motion.button
            key={i}
            variants={fadeUp}
            onClick={() => navigate(item.to)}
            className="text-left cursor-pointer active:scale-[0.97] transition-transform"
          >
            <GlassCard
              padding="none"
              className="p-3 min-[390px]:p-4 h-full hover:shadow-lg hover:shadow-brand-primary/5 transition-all"
            >
              <div
                className={`w-9 h-9 min-[390px]:w-11 min-[390px]:h-11 rounded-2xl ${item.color} flex items-center justify-center mb-2 min-[390px]:mb-3`}
              >
                <item.icon size={20} className={item.iconColor} />
              </div>
              <h3 className="text-[13px] min-[390px]:text-sm font-semibold text-brand-black leading-tight">
                {item.label}
              </h3>
              <p className="text-[10px] min-[390px]:text-[11px] text-brand-gray-400 mt-0.5 leading-snug">
                {item.desc}
              </p>
              {item.extra}
            </GlassCard>
          </motion.button>
        ))}
      </motion.div>

      {/* Quick access list */}
      <motion.div variants={fadeUp}>
        <GlassCard padding="none">
          <div className="p-4 pb-2">
            <h3 className="text-sm font-semibold text-brand-black">
              Acesso rápido
            </h3>
          </div>
          {[
            {
              icon: ClipboardList,
              label: "Refazer Quiz",
              desc: "Gerar novos prompts jurídicos",
              to: "/quiz",
            },
            {
              icon: FileText,
              label: "Baixar PDF",
              desc: "Seus prompts em PDF",
              to: "/prompts",
            },
            {
              icon: MessageSquare,
              label: "Nova conversa",
              desc: "Gere um novo prompt com IA",
              to: "/chat",
            },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.to)}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-brand-primary/5 transition-colors cursor-pointer active:bg-brand-primary/10 border-t border-brand-gray-200/30"
            >
              <div className="w-9 h-9 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                <item.icon size={18} className="text-brand-primary-dark" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-brand-black">
                  {item.label}
                </p>
                <p className="text-[11px] text-brand-gray-400">{item.desc}</p>
              </div>
              <ChevronRight
                size={16}
                className="text-brand-gray-400 shrink-0"
              />
            </button>
          ))}
        </GlassCard>
      </motion.div>

      {/* BANNER: Inline Ad */}
      <motion.div variants={fadeUp}>
        <AdBanner
          id="dashboard-inline-1"
          title="Jurid IA PRO — Petições Automáticas"
          description="Gere petições completas com um clique. Integrado ao PJe e tribunais."
          ctaText="Conhecer"
          imageSrc="/images/logo/iconWhite.png"
        />
      </motion.div>

      {/* ================================================================ */}
      {/* SECTION: Sobre a Jurid IA                                        */}
      {/* ================================================================ */}
      <motion.div variants={fadeUp}>
        <GlassCard>
          <div className="flex flex-col lg:flex-row gap-5">
            <div className="lg:w-2/5 shrink-0">
              <div className="relative aspect-video rounded-xl bg-gradient-to-br from-brand-primary-dark to-brand-blue overflow-hidden flex items-center justify-center">
                <div
                  className="absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #C9A84C 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
                <img
                  src="/images/logo/iconWhite.png"
                  alt="Jurid IA"
                  className="w-20 h-20 object-contain drop-shadow-lg relative z-10"
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <img
                  src="/images/logo/logo.png"
                  alt="Jurid IA"
                  className="h-8 w-auto"
                />
                <Badge variant="dark" size="sm">
                  Sobre
                </Badge>
              </div>
              <h3 className="text-lg font-bold text-brand-black mb-2">
                Jurid IA — Melhor Amiga do Advogado
              </h3>
              <p className="text-sm text-brand-gray-600 leading-relaxed mb-3">
                A Jurid IA é uma plataforma criada para advogados que desejam
                usar inteligência artificial de forma profissional e eficiente.
                Geramos prompts otimizados para petições, contratos, pareceres e
                estratégia jurídica.
              </p>
              <p className="text-sm text-brand-gray-600 leading-relaxed mb-4">
                Com prompts bem estruturados, você economiza horas de trabalho e
                produz documentos de alta qualidade — sem precisar ser
                especialista em IA.
              </p>
              <div className="flex items-center gap-2">
                <BookOpen size={14} className="text-brand-primary-dark" />
                <span className="text-xs text-brand-gray-400">
                  Prompts baseados em legislação e jurisprudência brasileira
                </span>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* ================================================================ */}
      {/* SECTION: Nossos Produtos                                         */}
      {/* ================================================================ */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-brand-black">
            Nossos Produtos
          </h3>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-xs text-brand-primary-dark font-medium hover:underline cursor-pointer"
          >
            Ver todos <ChevronRight size={12} className="inline" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {products.map((prod) => (
            <a
              key={prod.id}
              href={prod.href}
              onClick={(e) => e.preventDefault()}
              data-product-id={prod.id}
              className="block group cursor-pointer active:scale-[0.97] transition-transform"
            >
              <GlassCard padding="none" hover className="h-full">
                <div className="w-full aspect-[2/1] rounded-t-2xl bg-gradient-to-br from-brand-primary/10 via-brand-primary-light/5 to-brand-blue/5 flex items-center justify-center border-b border-brand-gray-200/30">
                  <div className="text-center">
                    <img
                      src={prod.image}
                      alt={prod.title}
                      className="w-full h-full object-cover"
                    />
                    {/* <Image
                      size={28}
                      className="text-brand-gray-400/50 mx-auto mb-1"
                    />
                    <span className="text-[9px] text-brand-gray-400">
                      Imagem do produto
                    </span> */}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-brand-black group-hover:text-brand-primary-dark transition-colors">
                    {prod.title}
                  </h4>
                  <p className="text-[11px] text-brand-gray-400 mt-1 leading-snug line-clamp-2">
                    {prod.desc}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="primary" size="md">
                      {prod.price}
                    </Badge>
                    <span className="text-[11px] font-semibold text-brand-primary-dark flex items-center gap-1">
                      Conhecer <ExternalLink size={10} />
                    </span>
                  </div>
                </div>
              </GlassCard>
            </a>
          ))}
        </div>
      </motion.div>

      {/* BANNER: Video placeholder — Institucional */}
      <motion.div variants={fadeUp}>
        <AdBanner
          id="video-institucional"
          variant="video"
          label="VÍDEO INSTITUCIONAL — Conheça a Jurid IA"
          videoSrc="/public/1.mp4"
        />
      </motion.div>

      {/* BANNER: Inline Ad 2 */}
      <motion.div variants={fadeUp}>
        <AdBanner
          id="dashboard-inline-2"
          title="Curso: IA na Prática Jurídica"
          description="Domine prompts jurídicos em 7 dias. Acesso imediato + certificado."
          ctaText="Inscrever"
          imageSrc="/images/logo/iconWhite.png"
        />
      </motion.div>

      {/* ================================================================ */}
      {/* SECTION: Redes Sociais                                           */}
      {/* ================================================================ */}
      <motion.div variants={fadeUp}>
        <GlassCard>
          <h3 className="text-base font-bold text-brand-black mb-1">
            Siga a Jurid IA
          </h3>
          <p className="text-xs text-brand-gray-400 mb-4">
            Acompanhe nosso conteúdo nas redes sociais
          </p>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            {socialLinks.map((s) => (
              <a
                key={s.id}
                href={s.href}
                onClick={(e) => e.preventDefault()}
                data-social-id={s.id}
                className="flex flex-col items-center gap-1.5 min-w-[72px] group cursor-pointer"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center transition-all group-hover:scale-110 group-active:scale-95`}
                >
                  <s.Icon />
                </div>
                <span className="text-[10px] font-semibold text-brand-black">
                  {s.label}
                </span>
                <span className="text-[9px] text-brand-gray-400">
                  {s.handle}
                </span>
              </a>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* BANNER: Bottom full-width */}
      <motion.div variants={fadeUp}>
        <AdBanner
          id="bottom-banner"
          variant="hero"
          label="BANNER RODAPÉ — 1200x200"
          ratio="aspect-[3/1] sm:aspect-[6/1]"
          imageSrc="/public/5.png"
        />
      </motion.div>
    </motion.div>
  );
}
