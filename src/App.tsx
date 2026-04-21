import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/components/ui/Toast'
import AppLayout from '@/components/layout/AppLayout'
import AuthLayout from '@/components/layout/AuthLayout'
import TrainingLayout from '@/components/training/TrainingLayout'
import PrivateRoute from '@/components/guards/PrivateRoute'
import PaidRoute from '@/components/guards/PaidRoute'

import DashboardPage from '@/pages/DashboardPage'
import QuizPage from '@/pages/QuizPage'
import SkillPage from '@/pages/SkillPage'
import PromptsPage from '@/pages/PromptsPage'
import ChatPage from '@/pages/ChatPage'
import TrainingPage from '@/pages/TrainingPage'
import TrainingCoursePage from '@/pages/TrainingCoursePage'
import TrainingModulePage from '@/pages/TrainingModulePage'
import TrainingLessonPage from '@/pages/TrainingLessonPage'
import ProfilePage from '@/pages/ProfilePage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import CheckoutPage from '@/pages/CheckoutPage'
import CongratulationsPage from '@/pages/CongratulationsPage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public auth routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            {/* Checkout: logado, nao-pago (PrivateRoute) */}
            <Route element={<PrivateRoute />}>
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/checkout/parabens" element={<CongratulationsPage />} />
            </Route>

            {/* App: logado + pago (PaidRoute) */}
            <Route element={<PaidRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/skill" element={<SkillPage />} />
                <Route path="/prompts" element={<PromptsPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              <Route element={<TrainingLayout />}>
                <Route path="/training" element={<TrainingPage />} />
                <Route path="/training/:courseId" element={<TrainingCoursePage />} />
                <Route path="/training/:courseId/:moduleId" element={<TrainingModulePage />} />
                <Route path="/training/:courseId/:moduleId/:lessonId" element={<TrainingLessonPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
