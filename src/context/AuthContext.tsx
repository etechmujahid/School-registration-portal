import type { ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'

export type User = {
  name: string
  email: string
  role: 'Admin'
}

type AuthContextValue = {
  user: User | null
  login: (email: string) => Promise<void>
  register: (name: string, email: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)
const STORAGE_KEY = 'srp_user'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

/**
 * UI-only auth: no backend. Any email/password "works" and the user is kept in localStorage.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readStoredUser)

  const persist = (u: User | null) => {
    setUser(u)
    try {
      if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* storage unavailable — keep in memory only */
    }
  }

  const login = async (email: string) => {
    await wait(700)
    persist({ name: 'Sarah Thompson', email, role: 'Admin' })
  }

  const register = async (name: string, email: string) => {
    await wait(900)
    persist({ name, email, role: 'Admin' })
  }

  const logout = () => persist(null)

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
