import { GraduationCap, CheckCircle2 } from 'lucide-react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const highlights = [
  'Online admission applications in minutes',
  'Track student records, classes and fees',
  'Real-time review & approval workflow',
]

export default function AuthLayout() {
  const { user } = useAuth()
  if (user) return <Navigate to="/dashboard" replace />

  return (
    <div className="flex min-h-full">
      {/* Brand panel */}
      <aside className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-brand-900 p-12 text-white lg:flex">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-600/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20">
            <GraduationCap className="h-6 w-6" />
          </span>
          <span className="text-lg font-semibold">School Registration Portal</span>
        </div>

        <div className="relative max-w-md">
          <h1 className="text-4xl font-bold leading-tight">Admissions made simple for Greenwood Academy.</h1>
          <p className="mt-4 text-brand-100">
            One place for administrators to manage applications, enrolments and student records.
          </p>
          <ul className="mt-8 space-y-3">
            {highlights.map((h) => (
              <li key={h} className="flex items-center gap-3 text-brand-50">
                <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                {h}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-brand-200">© 2026 Greenwood Academy. All rights reserved.</p>
      </aside>

      {/* Form panel */}
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="font-semibold text-slate-900">School Registration Portal</span>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export function AuthHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
    </div>
  )
}
