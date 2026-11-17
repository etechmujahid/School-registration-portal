import type { ClipboardEvent, FormEvent, KeyboardEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui'
import { AuthHeader } from '../AuthLayout'

const LENGTH = 6

export default function VerifyOtpPage() {
  const navigate = useNavigate()
  const email = (useLocation().state as { email?: string } | null)?.email ?? 'your email'
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(''))
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [seconds, setSeconds] = useState(30)
  const refs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (seconds <= 0) return
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds])

  // Handles single keystrokes as well as fast typing / OS autofill that drops the whole code into one box.
  const setDigit = (i: number, value: string) => {
    let chars = value.replace(/\D/g, '')
    if (digits[i] && chars.length > 1 && chars.startsWith(digits[i])) chars = chars.slice(1)
    if (!chars) {
      setDigits((d) => d.map((x, idx) => (idx === i ? '' : x)))
      return
    }
    const next = [...digits]
    chars
      .slice(0, LENGTH - i)
      .split('')
      .forEach((c, k) => (next[i + k] = c))
    setDigits(next)
    refs.current[Math.min(i + chars.length, LENGTH - 1)]?.focus()
  }

  const onKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus()
  }

  const onPaste = (e: ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH)
    if (!text) return
    e.preventDefault()
    setDigits(Array.from({ length: LENGTH }, (_, i) => text[i] ?? ''))
    refs.current[Math.min(text.length, LENGTH - 1)]?.focus()
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (digits.join('').length !== LENGTH) return setError('Enter the full 6-digit code')
    setError(undefined)
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    navigate('/reset-password')
  }

  return (
    <>
      <Link to="/forgot-password" className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <ShieldCheck className="h-6 w-6" />
      </span>
      <AuthHeader title="Check your inbox" subtitle={`We sent a 6-digit code to ${email}. Enter it below to continue.`} />

      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <div className="flex justify-between gap-2" onPaste={onPaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el
              }}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              inputMode="numeric"
              autoComplete="one-time-code"
              aria-label={`Digit ${i + 1}`}
              className="h-14 w-full min-w-0 rounded-lg border border-slate-300 bg-white text-center text-xl font-semibold text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          ))}
        </div>
        {error && <p className="-mt-3 text-xs text-rose-600">{error}</p>}

        <Button type="submit" fullWidth loading={loading}>
          Verify code
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Didn’t receive it?{' '}
        {seconds > 0 ? (
          <span>Resend in 0:{String(seconds).padStart(2, '0')}</span>
        ) : (
          <button type="button" onClick={() => setSeconds(30)} className="font-medium text-brand-600 hover:text-brand-700">
            Resend code
          </button>
        )}
      </p>
    </>
  )
}
