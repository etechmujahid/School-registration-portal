import type { FormEvent } from 'react'
import { useState } from 'react'
import { Check, CheckCircle2, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button, Input, cn } from '../../../components/ui'
import { AuthHeader } from '../AuthLayout'

const rules = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p: string) => /\d/.test(p) },
  { label: 'One special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!rules.every((r) => r.test(password))) return setError('Password does not meet all requirements')
    if (password !== confirm) return setError('Passwords do not match')
    setError(undefined)
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    setLoading(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="text-center">
        <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h2 className="text-2xl font-bold text-slate-900">Password updated</h2>
        <p className="mt-2 text-sm text-slate-500">Your password has been reset successfully. You can now sign in with your new password.</p>
        <Link
          to="/login"
          className="mt-8 block w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <>
      <AuthHeader title="Set a new password" subtitle="Choose a strong password you haven’t used before." />

      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Input label="New password" name="password" type="password" icon={<Lock className="h-4 w-4" />} value={password} onChange={(e) => setPassword(e.target.value)} />

        <ul className="grid grid-cols-2 gap-2">
          {rules.map((r) => {
            const ok = r.test(password)
            return (
              <li key={r.label} className={cn('flex items-center gap-1.5 text-xs', ok ? 'text-emerald-600' : 'text-slate-400')}>
                <Check className="h-3.5 w-3.5" /> {r.label}
              </li>
            )
          })}
        </ul>

        <Input label="Confirm new password" name="confirm" type="password" icon={<Lock className="h-4 w-4" />} value={confirm} onChange={(e) => setConfirm(e.target.value)} error={error} />

        <Button type="submit" fullWidth loading={loading}>
          Reset password
        </Button>
      </form>
    </>
  )
}
