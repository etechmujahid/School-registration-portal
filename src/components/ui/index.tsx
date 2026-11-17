import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'
import { forwardRef, useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

/* ---------- Button ---------- */
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  loading?: boolean
  fullWidth?: boolean
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500',
  secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-400',
  ghost: 'text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500',
}

export function Button({ variant = 'primary', loading, fullWidth, className, children, disabled, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
        buttonVariants[variant],
        fullWidth && 'w-full',
        className,
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}

/* ---------- Input ---------- */
type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  /** Optional element shown at the right end of the label row (e.g. a "Forgot password?" link). */
  labelAction?: ReactNode
  error?: string
  icon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, labelAction, error, icon, id, className, type, ...rest },
  ref,
) {
  const [showPassword, setShowPassword] = useState(false)
  const inputId = id ?? rest.name
  const isPassword = type === 'password'
  return (
    <div className="space-y-1.5">
      {(label || labelAction) && (
        <div className="flex items-center justify-between gap-2">
          {label && (
            <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
              {label}
            </label>
          )}
          {labelAction}
        </div>
      )}
      <div className="relative">
        {icon && <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">{icon}</span>}
        <input
          ref={ref}
          id={inputId}
          type={isPassword && showPassword ? 'text' : type}
          className={cn(
            'block w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400',
            'focus:outline-none focus:ring-2 focus:ring-brand-500/30',
            error ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-brand-500',
            !!icon && 'pl-10',
            isPassword && 'pr-10',
            className,
          )}
          aria-invalid={!!error}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  )
})

/* ---------- Select ---------- */
type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { label?: string; options: string[] }

export function Select({ label, options, id, className, ...rest }: SelectProps) {
  const selectId = id ?? rest.name
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900',
          'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30',
          className,
        )}
        {...rest}
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  )
}

/* ---------- Card ---------- */
export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('rounded-xl border border-slate-200 bg-white shadow-sm', className)}>{children}</div>
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
      <div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

/* ---------- Badge ---------- */
export type BadgeTone = 'green' | 'amber' | 'rose' | 'blue' | 'slate'
const badgeTones: Record<BadgeTone, string> = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  amber: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  rose: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  blue: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  slate: 'bg-slate-100 text-slate-700 ring-slate-500/20',
}

export function Badge({ tone = 'slate', children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset', badgeTones[tone])}>
      {children}
    </span>
  )
}

/* ---------- Avatar ---------- */
const avatarColors = ['bg-indigo-500', 'bg-sky-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-violet-500']

export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  const color = avatarColors[name.length % avatarColors.length]
  const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-16 w-16 text-xl' }
  return (
    <span className={cn('inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white', color, sizes[size])}>
      {initials}
    </span>
  )
}

/* ---------- Checkbox ---------- */
export function Checkbox({ label, ...rest }: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-600">
      <input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-brand-600" {...rest} />
      {label}
    </label>
  )
}
