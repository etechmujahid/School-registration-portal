import type { FormEvent } from 'react'
import { useState } from 'react'
import { Lock, Mail } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Checkbox, Input } from '../../../components/ui'
import { useAuth } from '../../../context/AuthContext'
import { AuthHeader } from '../AuthLayout'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@greenwood.edu')
  const [password, setPassword] = useState('password')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Enter a valid email address'
    if (password.length < 6) next.password = 'Password must be at least 6 characters'
    setErrors(next)
    if (Object.keys(next).length) return

    setLoading(true)
    await login(email)
    navigate('/dashboard')
  }

  return (
    <>
      <AuthHeader title="Welcome back" subtitle="Sign in to your administrator account to continue." />

      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Input
          label="Email address"
          name="email"
          type="email"
          placeholder="you@school.edu"
          icon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Input
          label="Password"
          labelAction={
            <Link to="/forgot-password" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              Forgot password?
            </Link>
          }
          name="password"
          type="password"
          placeholder="••••••••"
          icon={<Lock className="h-4 w-4" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <Checkbox label="Remember me" defaultChecked />

        <Button type="submit" fullWidth loading={loading}>
          Sign in
        </Button>
      </form>

      <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 text-xs text-slate-500">
        Demo mode: any valid email and a password of 6+ characters will sign you in.
      </div>

      <p className="mt-8 text-center text-sm text-slate-500">
        Don’t have an account?{' '}
        <Link to="/register" className="font-medium text-brand-600 hover:text-brand-700">
          Create one
        </Link>
      </p>
    </>
  )
}
