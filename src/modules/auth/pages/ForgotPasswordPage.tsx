import type { FormEvent } from 'react'
import { useState } from 'react'
import { ArrowLeft, Mail } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input } from '../../../components/ui'
import { AuthHeader } from '../AuthLayout'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address')
    setError(undefined)
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    navigate('/verify-otp', { state: { email } })
  }

  return (
    <>
      <Link to="/login" className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="h-4 w-4" /> Back to sign in
      </Link>
      <AuthHeader title="Forgot your password?" subtitle="Enter the email linked to your account and we’ll send you a 6-digit verification code." />

      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Input
          label="Email address"
          name="email"
          type="email"
          placeholder="you@school.edu"
          icon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
        />
        <Button type="submit" fullWidth loading={loading}>
          Send verification code
        </Button>
      </form>
    </>
  )
}
