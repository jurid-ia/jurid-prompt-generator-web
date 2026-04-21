import type { QuizQuestion } from '@/types/quiz'

export const quizQuestions: QuizQuestion[] = [
  // Slide 1 - Welcome
  {
    id: 'welcome',
    type: 'info',
    title: 'Vamos criar seus prompts juridicos personalizados',
    subtitle:
      'Responda algumas perguntas sobre sua pratica juridica. Leva menos de 3 minutos.',
    icon: 'sparkles',
  },

  // Slide 2 - Name
  {
    id: 'name',
    type: 'text',
    question: 'Como voce quer que a IA se refira a voce?',
    placeholder: 'Dr. / Dra. + seu nome',
    subtitle: 'Os prompts vao usar seu nome para parecerem naturais.',
  },

  // Slide 3 - Uses AI
  {
    id: 'uses_ai',
    type: 'yes_no',
    question: 'Voce ja usa inteligencia artificial na sua pratica juridica?',
    subtitle: 'Nao se preocupe se ainda nao usa. Vamos te ajudar!',
  },

  // Slide 4 - Area of Practice
  {
    id: 'business_type',
    type: 'single_choice',
    question: 'Qual sua principal area de atuacao?',
    options: [
      { value: 'civil', label: 'Direito Civil', icon: 'building-2' },
      { value: 'trabalhista', label: 'Direito Trabalhista', icon: 'wrench' },
      { value: 'penal', label: 'Direito Penal', icon: 'shield' },
      { value: 'tributario', label: 'Direito Tributario', icon: 'dollar-sign' },
      { value: 'empresarial', label: 'Direito Empresarial', icon: 'briefcase' },
      { value: 'familia', label: 'Direito de Familia', icon: 'heart-handshake' },
      { value: 'digital', label: 'Direito Digital / LGPD', icon: 'laptop' },
      { value: 'other', label: 'Outra area', icon: 'pin' },
    ],
  },

  // Slide 5 - Specialization
  {
    id: 'niche',
    type: 'text',
    question: 'Descreva sua especialidade em uma frase',
    placeholder: 'Ex: "Advogado trabalhista focado em reclamatorias"',
    subtitle: 'Quanto mais especifico, mais personalizados serao os prompts.',
  },

  // Slide 6 - Media: AI Example
  {
    id: 'media_ai_example',
    type: 'media',
    title: 'Veja o poder da IA na advocacia',
    subtitle:
      'Prompts bem construidos podem economizar horas na redacao de pecas e pareceres.',
    mediaType: 'image',
    mediaUrl: '/images/quiz/ai-example.png',
  },

  // Slide 7 - Experience
  {
    id: 'revenue',
    type: 'single_choice',
    question: 'Ha quanto tempo voce atua como advogado(a)?',
    options: [
      { value: 'student', label: 'Ainda sou estudante / estagiario', icon: 'sprout' },
      { value: '1_3', label: '1 a 3 anos', icon: 'trending-up' },
      { value: '3_10', label: '3 a 10 anos', icon: 'rocket' },
      { value: '10_20', label: '10 a 20 anos', icon: 'wallet' },
      { value: '20_plus', label: 'Mais de 20 anos', icon: 'trophy' },
    ],
  },

  // Slide 8 - Team Size
  {
    id: 'team_size',
    type: 'single_choice',
    question: 'Como e a estrutura do seu escritorio?',
    options: [
      { value: 'solo', label: 'Advogado(a) solo', icon: 'user' },
      { value: '2_5', label: '2-5 advogados', icon: 'users' },
      { value: '6_15', label: '6-15 advogados', icon: 'users-round' },
      { value: '15_plus', label: 'Mais de 15 advogados', icon: 'building' },
    ],
  },

  // Slide 9 - Pain Points (multi-choice)
  {
    id: 'pain_points',
    type: 'multi_choice',
    question: 'Quais sao seus maiores desafios hoje?',
    subtitle: 'Selecione ate 3',
    maxSelections: 3,
    options: [
      { value: 'redacao', label: 'Redacao de pecas processuais' },
      { value: 'pesquisa', label: 'Pesquisa de jurisprudencia' },
      { value: 'tempo', label: 'Falta de tempo / volume de processos' },
      { value: 'contratos', label: 'Elaboracao e revisao de contratos' },
      { value: 'clientes', label: 'Captacao e atendimento de clientes' },
      { value: 'pareceres', label: 'Pareceres e consultoria' },
      { value: 'prazos', label: 'Controle de prazos' },
      { value: 'marketing', label: 'Marketing juridico e posicionamento' },
    ],
  },

  // Slide 10 - AI Experience
  {
    id: 'ai_experience',
    type: 'single_choice',
    question: 'Qual sua experiencia com IA (ChatGPT, Claude, etc)?',
    options: [
      { value: 'never', label: 'Nunca usei', icon: 'circle-help' },
      { value: 'casual', label: 'Uso as vezes, sem metodo', icon: 'zap' },
      { value: 'regular', label: 'Uso frequentemente na advocacia', icon: 'flame' },
      { value: 'advanced', label: 'Uso avancado / ja crio prompts juridicos', icon: 'brain' },
    ],
  },

  // Slide 11 - Time Waste (rank order)
  {
    id: 'time_waste',
    type: 'rank_order',
    question: 'Ordene do que mais toma tempo ao que menos toma:',
    items: [
      'Redigir peticoes e recursos',
      'Pesquisar jurisprudencia e doutrina',
      'Elaborar contratos e pareceres',
      'Atender clientes e reunioes',
      'Tarefas administrativas do escritorio',
    ],
  },

  // Slide 12 - Preferred AI
  {
    id: 'preferred_ai',
    type: 'single_choice',
    question: 'Qual IA voce mais usa (ou pretende usar)?',
    options: [
      { value: 'chatgpt', label: 'ChatGPT', icon: 'message-circle' },
      { value: 'claude', label: 'Claude', icon: 'bot' },
      { value: 'gemini', label: 'Gemini', icon: 'sparkles' },
      { value: 'copilot', label: 'Copilot', icon: 'code' },
      { value: 'any', label: 'Tanto faz / qualquer uma', icon: 'shuffle' },
    ],
  },

  // Slide 13 - Communication Tone
  {
    id: 'communication_tone',
    type: 'single_choice',
    question: 'Qual o tom predominante das suas pecas?',
    options: [
      { value: 'formal', label: 'Formal e tecnico', icon: 'briefcase' },
      { value: 'casual', label: 'Objetivo e direto', icon: 'smile' },
      { value: 'technical', label: 'Academico e doutrinario', icon: 'microscope' },
      { value: 'friendly', label: 'Persuasivo e envolvente', icon: 'heart-handshake' },
    ],
  },

  // Slide 14 - Media: Motivation
  {
    id: 'media_motivation',
    type: 'media',
    title: 'Estamos quase la!',
    subtitle:
      'Em instantes, a IA vai gerar prompts exclusivos para sua pratica juridica.',
    mediaType: 'image',
    mediaUrl: '/images/quiz/almost-done.png',
  },

  // Slide 15 - Completion
  {
    id: 'completion',
    type: 'info',
    title: 'Preparando seus resultados...',
    subtitle:
      'A IA esta analisando seu perfil e criando prompts personalizados para sua area.',
    icon: 'loader',
  },
]
