import { useState } from 'react'
import {
  Bell,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  School,
  Search,
  Settings,
  Users,
  X,
} from 'lucide-react'
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { Avatar, cn } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'

const nav = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/applications', label: 'Applications', icon: ClipboardList, badge: '42' },
  { to: '/dashboard/students', label: 'Students', icon: Users },
  { to: '/dashboard/classes', label: 'Classes', icon: School },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  if (!user) return <Navigate to="/login" replace />

  const onLogout = () => {
    logout()
    navigate('/login')
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-100 px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
          <GraduationCap className="h-5 w-5" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-slate-900">Greenwood Academy</p>
          <p className="text-xs text-slate-500">Registration Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {nav.map(({ to, label, icon: Icon, end, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span className="flex-1">{label}</span>
            {badge && <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs text-white">{badge}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="m-3 rounded-xl bg-gradient-to-br from-brand-600 to-brand-900 p-4 text-white">
        <p className="text-sm font-semibold">Spring Term 2027</p>
        <p className="mt-1 text-xs text-brand-100">Registration closes Dec 02. 68% of seats filled.</p>
        <div className="mt-3 h-1.5 rounded-full bg-white/20">
          <div className="h-full w-[68%] rounded-full bg-white" />
        </div>
      </div>

      <button onClick={onLogout} className="mx-3 mb-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600">
        <LogOut className="h-5 w-5" /> Sign out
      </button>
    </div>
  )

  return (
    <div className="flex h-full">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 lg:block">{sidebar}</aside>

      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setOpen(false)} />
          <aside className="relative h-full w-64 shadow-xl">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-4 rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-6">
          <button onClick={() => setOpen(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>

          <div className="relative hidden max-w-md flex-1 sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search students, applications…"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            <div className="relative">
              <button onClick={() => setMenuOpen((m) => !m)} className="flex items-center gap-3 rounded-lg p-1.5 hover:bg-slate-100">
                <Avatar name={user.name} size="sm" />
                <div className="hidden text-left leading-tight md:block">
                  <p className="text-sm font-medium text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.role}</p>
                </div>
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                    <div className="border-b border-slate-100 px-3 py-2">
                      <p className="truncate text-sm font-medium text-slate-900">{user.name}</p>
                      <p className="truncate text-xs text-slate-500">{user.email}</p>
                    </div>
                    <NavLink to="/dashboard/settings" onClick={() => setMenuOpen(false)} className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                      <Settings className="h-4 w-4" /> Account settings
                    </NavLink>
                    <button onClick={onLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50">
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
