import { Calendar, ClipboardList, Clock, DollarSign, Plus, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar, Badge, Button, Card, CardHeader } from '../../../components/ui'
import { useAuth } from '../../../context/AuthContext'
import { applications, gradeDistribution, monthlyApplications, recentActivity, stats, statusTone, upcomingEvents } from '../../../data/dummy'
import { PageHeader, StatCard, formatDate, td, th } from '../components/shared'

const statIcons = [
  { icon: <Users className="h-5 w-5" />, cls: 'bg-brand-50 text-brand-600' },
  { icon: <ClipboardList className="h-5 w-5" />, cls: 'bg-sky-50 text-sky-600' },
  { icon: <Clock className="h-5 w-5" />, cls: 'bg-amber-50 text-amber-600' },
  { icon: <DollarSign className="h-5 w-5" />, cls: 'bg-emerald-50 text-emerald-600' },
]

const dotTone = { green: 'bg-emerald-500', blue: 'bg-sky-500', rose: 'bg-rose-500', amber: 'bg-amber-500', slate: 'bg-slate-400' }

export default function OverviewPage() {
  const { user } = useAuth()
  const max = Math.max(...monthlyApplications.map((m) => m.value))
  const totalStudents = gradeDistribution.reduce((s, g) => s + g.count, 0)
  const firstName = user?.name.split(' ')[0]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <>
      <PageHeader
        title={`${greeting}, ${firstName} 👋`}
        subtitle="Here’s what’s happening with admissions today."
        actions={
          <>
            <Button variant="secondary">
              <Calendar className="h-4 w-4" /> Nov 2026
            </Button>
            <Button>
              <Plus className="h-4 w-4" /> New application
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} icon={statIcons[i].icon} iconClass={statIcons[i].cls} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        {/* Bar chart */}
        <Card className="xl:col-span-2">
          <CardHeader title="Applications received" subtitle="Last 6 months" action={<Badge tone="green">+57% vs prev. period</Badge>} />
          <div className="flex h-64 items-end gap-3 px-5 pb-5 pt-6 sm:gap-6">
            {monthlyApplications.map((m) => (
              <div key={m.month} className="group flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-medium text-slate-500 opacity-0 transition-opacity group-hover:opacity-100">{m.value}</span>
                <div
                  className="w-full max-w-12 rounded-t-md bg-brand-200 transition-colors group-hover:bg-brand-500 group-last:bg-brand-600"
                  style={{ height: `${(m.value / max) * 170}px` }}
                />
                <span className="text-xs text-slate-500">{m.month}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Distribution */}
        <Card>
          <CardHeader title="Enrolment by level" subtitle={`${totalStudents.toLocaleString()} active students`} />
          <div className="space-y-5 p-5">
            {gradeDistribution.map((g, i) => {
              const pct = Math.round((g.count / totalStudents) * 100)
              const colors = ['bg-brand-600', 'bg-sky-500', 'bg-emerald-500']
              return (
                <div key={g.grade}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="text-slate-600">{g.grade}</span>
                    <span className="font-medium text-slate-900">
                      {g.count} <span className="font-normal text-slate-400">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${colors[i]}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Boys</p>
                <p className="text-lg font-semibold text-slate-900">642</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Girls</p>
                <p className="text-lg font-semibold text-slate-900">606</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        {/* Recent applications */}
        <Card className="overflow-hidden xl:col-span-2">
          <CardHeader
            title="Recent applications"
            action={
              <Link to="/dashboard/applications" className="text-sm font-medium text-brand-600 hover:text-brand-700">
                View all
              </Link>
            }
          />
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/60">
                <tr>
                  <th className={th}>Applicant</th>
                  <th className={th}>Grade</th>
                  <th className={th}>Submitted</th>
                  <th className={th}>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.slice(0, 5).map((a) => (
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
                    <td className={td}>{formatDate(a.submittedOn)}</td>
                    <td className={td}>
                      <Badge tone={statusTone[a.status]}>{a.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-6">
          {/* Activity */}
          <Card>
            <CardHeader title="Recent activity" />
            <ul className="space-y-4 p-5">
              {recentActivity.map((a) => (
                <li key={a.id} className="flex gap-3">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotTone[a.tone]}`} />
                  <div>
                    <p className="text-sm text-slate-700">{a.text}</p>
                    <p className="text-xs text-slate-400">{a.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          {/* Events */}
          <Card>
            <CardHeader title="Upcoming" />
            <ul className="divide-y divide-slate-100">
              {upcomingEvents.map((e) => {
                const [mon, day] = e.date.split(' ')
                return (
                  <li key={e.title} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                      <span className="text-[10px] font-semibold uppercase">{mon}</span>
                      <span className="text-lg font-bold leading-none">{day}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">{e.title}</p>
                      <p className="text-xs text-slate-500">{e.place}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </Card>
        </div>
      </div>
    </>
  )
}
