import type { FormEvent } from 'react'
import { useState } from 'react'
import { Building2, Lock, Mail, Phone, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Checkbox, Input } from '../../../components/ui'
import { useAuth } from '../../../context/AuthContext'
import { AuthHeader } from '../AuthLayout'

type Form = {
  name: string
  email: string
  phone: string
  school: string
  password: string
  confirm: string
  terms: boolean
}

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState<Form>({ name: '', email: '', phone: '', school: 'Greenwood Academy', password: '', confirm: '', terms: false })
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({})
  const [loading, setLoading] = useState(false)

  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => ({ ...f, [key]: value }))

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (form.name.trim().length < 2) next.name = 'Enter your full name'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address'
    if (form.password.length < 8) next.password = 'Use at least 8 characters'
    if (form.confirm !== form.password) next.confirm = 'Passwords do not match'
    if (!form.terms) next.terms = 'You must accept the terms'
    setErrors(next)
    if (Object.keys(next).length) return

    setLoading(true)
    await register(form.name, form.email)
    navigate('/dashboard')
  }

  return (
    <>
      <AuthHeader title="Create your account" subtitle="Set up an administrator account for your school." />

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Input label="Full name" name="name" placeholder="Jane Doe" icon={<User className="h-4 w-4" />} value={form.name} onChange={(e) => set('name', e.target.value)} error={errors.name} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Email" name="email" type="email" placeholder="you@school.edu" icon={<Mail className="h-4 w-4" />} value={form.email} onChange={(e) => set('email', e.target.value)} error={errors.email} />
          <Input label="Phone" name="phone" placeholder="(555) 000-0000" icon={<Phone className="h-4 w-4" />} value={form.phone} onChange={(e) => set('phone', e.target.value)} />
        </div>
        <Input label="School name" name="school" icon={<Building2 className="h-4 w-4" />} value={form.school} onChange={(e) => set('school', e.target.value)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Password" name="password" type="password" placeholder="Min. 8 characters" icon={<Lock className="h-4 w-4" />} value={form.password} onChange={(e) => set('password', e.target.value)} error={errors.password} />
          <Input label="Confirm password" name="confirm" type="password" placeholder="Repeat password" icon={<Lock className="h-4 w-4" />} value={form.confirm} onChange={(e) => set('confirm', e.target.value)} error={errors.confirm} />
        </div>

        <div>
          <Checkbox
            label={
              <span>
                I agree to the <a href="#" className="font-medium text-brand-600">Terms</a> and <a href="#" className="font-medium text-brand-600">Privacy Policy</a>
              </span>
            }
            checked={form.terms}
            onChange={(e) => set('terms', e.target.checked)}
          />
          {errors.terms && <p className="mt-1 text-xs text-rose-600">{errors.terms}</p>}
        </div>

        <Button type="submit" fullWidth loading={loading}>
          Create account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
          Sign in
        </Link>
      </p>
    </>
  )
}
