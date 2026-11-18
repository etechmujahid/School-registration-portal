import type { ButtonHTMLAttributes } from 'react'
import { useMemo, useState } from 'react'
import { Check, Download, Eye, X } from 'lucide-react'
import { Avatar, Badge, Button, Card } from '../../../components/ui'
import type { Application, ApplicationStatus } from '../../../data/dummy'
import { applications as seed, statusTone } from '../../../data/dummy'
import type { CsvColumn } from '../../../lib/csv'
import { downloadCsv, toCsv } from '../../../lib/csv'
import { EmptyRow, PageHeader, Pagination, SearchBox, Tabs, formatDate, td, th } from '../components/shared'

const TABS = ['All', 'Pending', 'Under Review', 'Approved', 'Rejected'] as const
type Tab = (typeof TABS)[number]

const CSV_COLUMNS: CsvColumn<Application>[] = [
  { header: 'Application ID', value: (a) => a.id },
  { header: 'Applicant', value: (a) => a.applicant },
  { header: 'Grade', value: (a) => a.grade },
  { header: 'Parent / Guardian', value: (a) => a.parent },
  { header: 'Email', value: (a) => a.email },
  { header: 'Previous school', value: (a) => (a.previousSchool === '—' ? '' : a.previousSchool) },
  { header: 'Submitted on', value: (a) => a.submittedOn },
  { header: 'Status', value: (a) => a.status },
]

/** Exports exactly what the table shows: current tab, search, and any status changes. */
function exportApplications(rows: Application[], tab: Tab) {
  const now = new Date()
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const scope = tab === 'All' ? '' : `-${tab.toLowerCase().replace(/\s+/g, '-')}`
  downloadCsv(`applications${scope}-${date}.csv`, toCsv(rows, CSV_COLUMNS))
}

export default function ApplicationsPage() {
  const [items, setItems] = useState<Application[]>(seed)
  const [tab, setTab] = useState<Tab>('All')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Application | null>(null)

  const counts = useMemo(() => {
    const c: Partial<Record<Tab, number>> = { All: items.length }
    items.forEach((a) => (c[a.status] = (c[a.status] ?? 0) + 1))
    return c
  }, [items])

  const filtered = items.filter(
    (a) =>
      (tab === 'All' || a.status === tab) &&
      [a.applicant, a.parent, a.id, a.grade].some((v) => v.toLowerCase().includes(query.toLowerCase())),
  )

  const setStatus = (id: string, status: ApplicationStatus) => {
    setItems((list) => list.map((a) => (a.id === id ? { ...a, status } : a)))
    setSelected((s) => (s && s.id === id ? { ...s, status } : s))
  }

  return (
    <>
      <PageHeader
        title="Applications"
        subtitle="Review and process admission applications for the upcoming term."
        actions={
          <Button
            variant="secondary"
            onClick={() => exportApplications(filtered, tab)}
            disabled={filtered.length === 0}
            title={filtered.length === 0 ? 'No applications to export' : `Export ${filtered.length} application${filtered.length === 1 ? '' : 's'} as CSV`}
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <Tabs tabs={TABS} value={tab} onChange={setTab} counts={counts} />
          <SearchBox value={query} onChange={setQuery} placeholder="Search by name, ID or grade" />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/60">
              <tr>
                <th className={th}>Applicant</th>
                <th className={th}>Grade</th>
                <th className={th}>Parent / Guardian</th>
                <th className={th}>Submitted</th>
                <th className={th}>Status</th>
                <th className={`${th} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && <EmptyRow colSpan={6} text="No applications match your filters." />}
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/60">
                  <td className={td}>
                    <div className="flex items-center gap-3">
                      <Avatar name={a.applicant} size="sm" />
                      <div>
                        <p className="font-medium text-slate-900">{a.applicant}</p>
                        <p className="text-xs text-slate-400">{a.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className={td}>{a.grade}</td>
                  <td className={td}>
                    <p className="text-slate-700">{a.parent}</p>
                    <p className="text-xs text-slate-400">{a.email}</p>
                  </td>
                  <td className={td}>{formatDate(a.submittedOn)}</td>
                  <td className={td}>
                    <Badge tone={statusTone[a.status]}>{a.status}</Badge>
                  </td>
                  <td className={`${td} text-right`}>
                    <div className="inline-flex gap-1">
                      <IconBtn label="View" onClick={() => setSelected(a)}>
                        <Eye className="h-4 w-4" />
                      </IconBtn>
                      <IconBtn label="Approve" className="hover:bg-emerald-50 hover:text-emerald-600" onClick={() => setStatus(a.id, 'Approved')} disabled={a.status === 'Approved'}>
                        <Check className="h-4 w-4" />
                      </IconBtn>
                      <IconBtn label="Reject" className="hover:bg-rose-50 hover:text-rose-600" onClick={() => setStatus(a.id, 'Rejected')} disabled={a.status === 'Rejected'}>
                        <X className="h-4 w-4" />
                      </IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination shown={filtered.length} total={186} />
      </Card>

      {selected && <ApplicationDrawer app={selected} onClose={() => setSelected(null)} onStatus={setStatus} />}
    </>
  )
}

function IconBtn({ label, className = '', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      title={label}
      aria-label={label}
      className={`rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:pointer-events-none disabled:opacity-30 ${className}`}
      {...rest}
    />
  )
}

function ApplicationDrawer({ app, onClose, onStatus }: { app: Application; onClose: () => void; onStatus: (id: string, s: ApplicationStatus) => void }) {
  const rows: Array<[string, string]> = [
    ['Application ID', app.id],
    ['Applying for', app.grade],
    ['Date of birth', 'Mar 14, 2018'],
    ['Previous school', app.previousSchool],
    ['Parent / Guardian', app.parent],
    ['Email', app.email],
    ['Phone', '(555) 482-1937'],
    ['Address', '42 Elm Street, Springfield'],
    ['Submitted on', formatDate(app.submittedOn)],
  ]
  const docs = ['Birth certificate.pdf', 'Previous report card.pdf', 'Passport photo.jpg', 'Immunization record.pdf']

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="font-semibold text-slate-900">Application details</h2>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-100" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center gap-4">
            <Avatar name={app.applicant} size="lg" />
            <div>
              <p className="text-lg font-semibold text-slate-900">{app.applicant}</p>
              <Badge tone={statusTone[app.status]}>{app.status}</Badge>
            </div>
          </div>

          <dl className="mt-6 divide-y divide-slate-100 rounded-lg border border-slate-200">
            {rows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
                <dt className="text-slate-500">{k}</dt>
                <dd className="text-right font-medium text-slate-800">{v}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-6 text-sm font-semibold text-slate-900">Documents</h3>
          <ul className="mt-2 space-y-2">
            {docs.map((d) => (
              <li key={d} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <span className="text-slate-700">{d}</span>
                <span className="text-xs font-medium text-brand-600">View</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3 border-t border-slate-100 p-4">
          <Button variant="secondary" fullWidth onClick={() => onStatus(app.id, 'Under Review')}>
            Mark under review
          </Button>
          <Button variant="danger" onClick={() => onStatus(app.id, 'Rejected')}>
            Reject
          </Button>
          <Button onClick={() => onStatus(app.id, 'Approved')}>Approve</Button>
        </div>
      </aside>
    </div>
  )
}
