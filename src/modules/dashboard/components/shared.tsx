import type { ReactNode } from 'react'
import { ChevronLeft, ChevronRight, Search, TrendingDown, TrendingUp } from 'lucide-react'
import { Card, cn } from '../../../components/ui'

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function StatCard({
  label,
  value,
  change,
  trend,
  icon,
  iconClass,
}: {
  label: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: ReactNode
  iconClass: string
}) {
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <span className={cn('flex h-11 w-11 items-center justify-center rounded-lg', iconClass)}>{icon}</span>
      </div>
      <p className="mt-3 flex items-center gap-1 text-xs">
        <span className={cn('inline-flex items-center gap-0.5 font-medium', trend === 'up' ? 'text-emerald-600' : 'text-rose-600')}>
          <TrendIcon className="h-3.5 w-3.5" /> {change}
        </span>
        <span className="text-slate-400">vs last month</span>
      </p>
    </Card>
  )
}

export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative w-full sm:w-72">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
      />
    </div>
  )
}

export function Tabs<T extends string>({ tabs, value, onChange, counts }: { tabs: readonly T[]; value: T; onChange: (t: T) => void; counts?: Partial<Record<T, number>> }) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={cn(
            'whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            value === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700',
          )}
        >
          {t}
          {counts?.[t] !== undefined && <span className="ml-1.5 text-xs text-slate-400">{counts[t]}</span>}
        </button>
      ))}
    </div>
  )
}

export function Pagination({ shown, total }: { shown: number; total: number }) {
  return (
    <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-sm text-slate-500">
      <span>
        Showing <span className="font-medium text-slate-700">{shown}</span> of <span className="font-medium text-slate-700">{total}</span> results
      </span>
      <div className="flex gap-1">
        <button className="rounded-md border border-slate-200 p-1.5 hover:bg-slate-50" aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button className="rounded-md border border-slate-200 p-1.5 hover:bg-slate-50" aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-12 text-center text-sm text-slate-400">
        {text}
      </td>
    </tr>
  )
}

export const th = 'px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500'
export const td = 'px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap'

export function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
