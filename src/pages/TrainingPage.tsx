import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, BookOpen, Sparkles } from 'lucide-react'
import type { TrainingCourse } from '@/types'
import { DEMO_TRAINING_COURSES } from '@/config/demo-data'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function TrainingPage() {
  const navigate = useNavigate()
  const [courses] = useState<TrainingCourse[]>(DEMO_TRAINING_COURSES)

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <GraduationCap size={48} className="text-gray-600 mb-4" />
        <h3 className="text-lg font-semibold text-gray-300">Treinamentos em breve</h3>
        <p className="text-sm text-gray-500 mt-1">Novos cursos estao sendo preparados. Volte em breve!</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center pt-4 pb-2"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A78F69]/10 border border-[#A78F69]/20 text-[#A78F69] text-xs font-medium mb-4">
          <Sparkles size={14} />
          Aprenda no seu ritmo
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Treinamentos</h1>
        <p className="text-gray-400 text-sm lg:text-base max-w-lg mx-auto">
          Domine o uso de IA na advocacia com cursos praticos feitos para advogados que querem resultados reais.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {courses.map((course) => (
          <motion.div
            key={course.id}
            variants={item}
            onClick={() => navigate(`/training/${course.id}`)}
            className="group bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-5 cursor-pointer active:scale-[0.97] transition-all duration-200 hover:border-[#A78F69]/30 hover:shadow-[0_0_30px_rgba(167,143,105,0.06)]"
          >
            {course.thumbnail_url ? (
              <div className="w-full h-40 rounded-xl overflow-hidden mb-4">
                <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-full h-40 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br from-[#A78F69]/10 via-[#A78F69]/5 to-transparent border border-white/5">
                <GraduationCap size={44} className="text-[#A78F69]/40 group-hover:text-[#A78F69]/60 transition-colors" />
              </div>
            )}

            <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-[#A78F69] transition-colors">
              {course.title}
            </h3>
            {course.description && (
              <p className="text-sm text-gray-400 mb-3 line-clamp-2">{course.description}</p>
            )}

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <BookOpen size={14} />
              <span>{course.module_count} modulos</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
