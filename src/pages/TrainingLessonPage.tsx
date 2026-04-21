import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, CheckCircle, Circle, Play, FileText } from 'lucide-react'
import type { TrainingLesson } from '@/types'
import { DEMO_TRAINING_LESSONS } from '@/config/demo-data'

export default function TrainingLessonPage() {
  const { courseId, moduleId, lessonId } = useParams()
  const navigate = useNavigate()
  const [lesson] = useState<TrainingLesson | null>(DEMO_TRAINING_LESSONS.find(l => l.id === lessonId) || null)
  const [completed, setCompleted] = useState(false)

  if (!lesson) {
    return <div className="text-center py-20 text-gray-500">Aula nao encontrada.</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => navigate(`/training/${courseId}/${moduleId}`)}
        className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer active:scale-[0.97]"
      >
        <ArrowLeft size={16} /> Voltar ao modulo
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {lesson.video_url ? (
          <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10">
            <iframe
              src={lesson.video_url}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="w-full aspect-video rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#A78F69]/10 border border-[#A78F69]/20 flex items-center justify-center">
              <Play size={28} className="text-[#A78F69]/60 ml-1" />
            </div>
            <p className="text-sm text-gray-500">Video em breve</p>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h2 className="text-xl font-bold text-white">{lesson.title}</h2>
          {lesson.description && <p className="text-sm text-gray-400 mt-1">{lesson.description}</p>}
        </div>
        <button
          onClick={() => setCompleted(!completed)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer active:scale-[0.97] shrink-0 min-h-[44px] ${
            completed
              ? 'bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20'
              : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-[#A78F69]/30'
          }`}
        >
          {completed ? (
            <>
              <CheckCircle size={18} /> Concluida
            </>
          ) : (
            <>
              <Circle size={18} /> Marcar como concluida
            </>
          )}
        </button>
      </motion.div>

      {lesson.content_html && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-5"
        >
          <div
            className="prose prose-sm prose-invert max-w-none text-gray-300"
            dangerouslySetInnerHTML={{ __html: lesson.content_html }}
          />
        </motion.div>
      )}

      {lesson.downloadable_files?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-5"
        >
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Download size={16} className="text-[#A78F69]" />
            Materiais para download
          </h3>
          <div className="space-y-2">
            {lesson.downloadable_files.map((file, idx) => (
              <a
                key={idx}
                href={file.url}
                download
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#A78F69]/20 transition-all cursor-pointer active:scale-[0.97] min-h-[44px]"
              >
                <FileText size={18} className="text-[#A78F69] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {file.size_bytes >= 1048576
                      ? `${(file.size_bytes / 1048576).toFixed(1)} MB`
                      : `${(file.size_bytes / 1024).toFixed(0)} KB`}
                  </p>
                </div>
                <span className="text-xs text-[#A78F69] font-medium uppercase">{file.type}</span>
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
