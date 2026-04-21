// Scaffolding temporario para as rotas /training (Fase 11 - opcional).
// Todo o restante do app (quiz, skill, prompts, chat, checkout) usa dados reais do backend.
// Quando a Fase 11 persistir training no banco, este arquivo pode ser apagado.
import type { TrainingCourse, TrainingModule, TrainingLesson } from '@/types'

export const DEMO_TRAINING_COURSES: TrainingCourse[] = [
  {
    id: 'course-1', title: 'IA na Pratica Juridica', description: 'Domine o uso de inteligencia artificial na advocacia. Do basico ao avancado.',
    thumbnail_url: null, sort_order: 1, module_count: 3, is_published: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'course-2', title: 'Prompts Juridicos Avancados', description: 'Aprenda a criar prompts que geram pecas processuais de alta qualidade.',
    thumbnail_url: null, sort_order: 2, module_count: 4, is_published: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
]

export const DEMO_TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'demo-mod-1', course_id: 'course-1', title: 'Introducao a IA para Advogados', description: 'Aprenda os fundamentos de como usar IA na pratica juridica para economizar tempo e melhorar a qualidade das pecas.',
    thumbnail_url: null, sort_order: 1, lesson_count: 4, is_published: true,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-mod-2', course_id: 'course-1', title: 'Prompts para Peticoes', description: 'Tecnicas avancadas para criar prompts que geram peticoes iniciais, contestacoes e recursos.',
    thumbnail_url: null, sort_order: 2, lesson_count: 3, is_published: true,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-mod-3', course_id: 'course-1', title: 'IA para Contratos e Pareceres', description: 'Como usar IA para redigir e revisar contratos e elaborar pareceres juridicos.',
    thumbnail_url: null, sort_order: 3, lesson_count: 5, is_published: true,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
]

export const DEMO_TRAINING_LESSONS: TrainingLesson[] = [
  { id: 'lesson-1', module_id: 'demo-mod-1', title: 'IA e Direito: fundamentos', description: 'Conceitos fundamentais de IA aplicada ao Direito', video_url: null, video_duration_seconds: 720, content_html: null, downloadable_files: [{ name: 'Slides da aula', url: '#', size_bytes: 2048000, type: 'pdf' }], sort_order: 1, is_published: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'lesson-2', module_id: 'demo-mod-1', title: 'Configurando ChatGPT e Claude', description: 'Passo a passo para configurar as principais IAs', video_url: null, video_duration_seconds: 540, content_html: null, downloadable_files: [], sort_order: 2, is_published: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'lesson-3', module_id: 'demo-mod-1', title: 'Seu primeiro prompt juridico', description: 'Criando prompts juridicos que realmente funcionam', video_url: null, video_duration_seconds: 900, content_html: null, downloadable_files: [{ name: 'Template de prompts juridicos', url: '#', size_bytes: 512000, type: 'pdf' }], sort_order: 3, is_published: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'lesson-4', module_id: 'demo-mod-1', title: 'Erros comuns e como evitar', description: 'Os 10 erros que advogados cometem com IA', video_url: null, video_duration_seconds: 660, content_html: null, downloadable_files: [], sort_order: 4, is_published: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
]
