import { BrowserRouter, MemoryRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AuthLayout from './modules/auth/AuthLayout'
import ForgotPasswordPage from './modules/auth/pages/ForgotPasswordPage'
import LoginPage from './modules/auth/pages/LoginPage'
import RegisterPage from './modules/auth/pages/RegisterPage'
import ResetPasswordPage from './modules/auth/pages/ResetPasswordPage'
import VerifyOtpPage from './modules/auth/pages/VerifyOtpPage'
import DashboardLayout from './modules/dashboard/DashboardLayout'
import ApplicationsPage from './modules/dashboard/pages/ApplicationsPage'
import ClassesPage from './modules/dashboard/pages/ClassesPage'
import OverviewPage from './modules/dashboard/pages/OverviewPage'
import SettingsPage from './modules/dashboard/pages/SettingsPage'
import StudentsPage from './modules/dashboard/pages/StudentsPage'

// The claude.ai artifact build can't rely on URL paths, so it keeps routes in memory.
const Router = import.meta.env.MODE === 'artifact' ? MemoryRouter : BrowserRouter

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth module (redirects to dashboard if signed in) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-otp" element={<VerifyOtpPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>

          {/* Dashboard (protected) */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="classes" element={<ClassesPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
