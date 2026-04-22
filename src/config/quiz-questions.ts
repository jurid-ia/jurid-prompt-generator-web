import type { QuizQuestion } from "@/types/quiz";

export const quizQuestions: QuizQuestion[] = [
  // Slide 1 - Welcome
  {
    id: "welcome",
    type: "info",
    title: "Vamos criar seus prompts jurídicos personalizados",
    subtitle:
      "Responda algumas perguntas sobre sua prática jurídica. Leva menos de 3 minutos.",
    icon: "sparkles",
  },

  // Slide 2 - Name
  {
    id: "name",
    type: "text",
    question: "Como você quer que a IA se refira a você?",
    placeholder: "Dr. / Dra. + seu nome",
    subtitle: "Os prompts vão usar seu nome para parecerem naturais.",
  },

  // Slide 3 - Uses AI
  {
    id: "uses_ai",
    type: "yes_no",
    question: "Você já usa inteligência artificial na sua prática jurídica?",
    subtitle: "Não se preocupe se ainda não usa. Vamos te ajudar!",
  },

  // Slide 4 - Area of Practice
  {
    id: "business_type",
    type: "single_choice",
    question: "Qual sua principal área de atuação?",
    options: [
      { value: "civil", label: "Direito Civil", icon: "building-2" },
      { value: "trabalhista", label: "Direito Trabalhista", icon: "wrench" },
      { value: "penal", label: "Direito Penal", icon: "shield" },
      { value: "tributario", label: "Direito Tributário", icon: "dollar-sign" },
      { value: "empresarial", label: "Direito Empresarial", icon: "briefcase" },
      {
        value: "familia",
        label: "Direito de Família",
        icon: "heart-handshake",
      },
      { value: "digital", label: "Direito Digital / LGPD", icon: "laptop" },
      { value: "other", label: "Outra área", icon: "pin" },
    ],
  },

  // Slide 5 - Specialization
  {
    id: "niche",
    type: "text",
    question: "Descreva sua especialidade em uma frase",
    placeholder: 'Ex: "Advogado trabalhista focado em reclamatórias"',
    subtitle: "Quanto mais específico, mais personalizados serão os prompts.",
  },

  // Slide 7 - Experience
  {
    id: "revenue",
    type: "single_choice",
    question: "Há quanto tempo você atua como advogado(a)?",
    options: [
      {
        value: "student",
        label: "Ainda sou estudante / estagiário",
        icon: "sprout",
      },
      { value: "1_3", label: "1 a 3 anos", icon: "trending-up" },
      { value: "3_10", label: "3 a 10 anos", icon: "rocket" },
      { value: "10_20", label: "10 a 20 anos", icon: "wallet" },
      { value: "20_plus", label: "Mais de 20 anos", icon: "trophy" },
    ],
  },

  // Slide 8 - Team Size
  {
    id: "team_size",
    type: "single_choice",
    question: "Como é a estrutura do seu escritório?",
    options: [
      { value: "solo", label: "Advogado(a) solo", icon: "user" },
      { value: "2_5", label: "2-5 advogados", icon: "users" },
      { value: "6_15", label: "6-15 advogados", icon: "users-round" },
      { value: "15_plus", label: "Mais de 15 advogados", icon: "building" },
    ],
  },

  // Slide 9 - Pain Points (multi-choice)
  {
    id: "pain_points",
    type: "multi_choice",
    question: "Quais são seus maiores desafios hoje?",
    subtitle: "Selecione até 3",
    maxSelections: 3,
    options: [
      { value: "redacao", label: "Redação de peças processuais" },
      { value: "pesquisa", label: "Pesquisa de jurisprudência" },
      { value: "tempo", label: "Falta de tempo / volume de processos" },
      { value: "contratos", label: "Elaboração e revisão de contratos" },
      { value: "clientes", label: "Captação e atendimento de clientes" },
      { value: "pareceres", label: "Pareceres e consultoria" },
      { value: "prazos", label: "Controle de prazos" },
      { value: "marketing", label: "Marketing jurídico e posicionamento" },
    ],
  },

  // Slide 10 - AI Experience
  {
    id: "ai_experience",
    type: "single_choice",
    question: "Qual sua experiência com IA (ChatGPT, Claude, etc)?",
    options: [
      { value: "never", label: "Nunca usei", icon: "circle-help" },
      { value: "casual", label: "Uso às vezes, sem método", icon: "zap" },
      {
        value: "regular",
        label: "Uso frequentemente na advocacia",
        icon: "flame",
      },
      {
        value: "advanced",
        label: "Uso avançado / já crio prompts jurídicos",
        icon: "brain",
      },
    ],
  },

  // Slide 11 - Time Waste (rank order)
  {
    id: "time_waste",
    type: "rank_order",
    question: "Ordene do que mais toma tempo ao que menos toma:",
    items: [
      "Redigir petições e recursos",
      "Pesquisar jurisprudência e doutrina",
      "Elaborar contratos e pareceres",
      "Atender clientes e reuniões",
      "Tarefas administrativas do escritório",
    ],
  },

  // Slide 12 - Preferred AI
  {
    id: "preferred_ai",
    type: "single_choice",
    question: "Qual IA você mais usa (ou pretende usar)?",
    options: [
      { value: "chatgpt", label: "ChatGPT", icon: "message-circle" },
      { value: "claude", label: "Claude", icon: "bot" },
      { value: "gemini", label: "Gemini", icon: "sparkles" },
      { value: "copilot", label: "Copilot", icon: "code" },
      { value: "any", label: "Tanto faz / qualquer uma", icon: "shuffle" },
    ],
  },

  // Slide 13 - Communication Tone
  {
    id: "communication_tone",
    type: "single_choice",
    question: "Qual o tom predominante das suas peças?",
    options: [
      { value: "formal", label: "Formal e técnico", icon: "briefcase" },
      { value: "casual", label: "Objetivo e direto", icon: "smile" },
      {
        value: "technical",
        label: "Acadêmico e doutrinário",
        icon: "microscope",
      },
      {
        value: "friendly",
        label: "Persuasivo e envolvente",
        icon: "heart-handshake",
      },
    ],
  },

  // Slide 15 - Completion
  {
    id: "completion",
    type: "info",
    title: "Tudo certo com suas respostas?",
    subtitle:
      'Se quiser revisar ou ajustar algo, use "Voltar". Quando estiver pronto, clique em "Gerar prompts" para a IA analisar seu perfil.',
    icon: "clipboard-check",
  },
];
