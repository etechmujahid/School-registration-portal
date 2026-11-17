import { DoorOpen, Plus, UserRound, Users } from 'lucide-react'
import { Badge, Button, Card, cn } from '../../../components/ui'
import { classes } from '../../../data/dummy'
import { PageHeader } from '../components/shared'

export default function ClassesPage() {
  const totalSeats = classes.reduce((s, c) => s + c.capacity, 0)
  const filled = classes.reduce((s, c) => s + c.students, 0)

  return (
    <>
      <PageHeader
        title="Classes"
        subtitle={`${classes.length} sections · ${filled} of ${totalSeats} seats filled`}
        actions={
          <Button>
            <Plus className="h-4 w-4" /> New class
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {classes.map((c) => {
          const pct = Math.round((c.students / c.capacity) * 100)
          const full = c.students >= c.capacity
          return (
            <Card key={c.id} className="p-5 transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{c.id}</p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-900">
                    {c.grade} – {c.section}
                  </h3>
                </div>
                {full ? <Badge tone="rose">Full</Badge> : pct >= 90 ? <Badge tone="amber">Almost full</Badge> : <Badge tone="green">Open</Badge>}
              </div>

              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-slate-400" /> {c.teacher}
                </li>
                <li className="flex items-center gap-2">
                  <DoorOpen className="h-4 w-4 text-slate-400" /> Room {c.room}
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400" /> {c.students} / {c.capacity} students
                </li>
              </ul>

              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-slate-500">Capacity</span>
                  <span className="font-medium text-slate-700">{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className={cn('h-full rounded-full', full ? 'bg-rose-500' : pct >= 90 ? 'bg-amber-500' : 'bg-emerald-500')}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </>
  )
}
