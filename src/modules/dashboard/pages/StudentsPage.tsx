import type { FormEvent } from 'react'
import { useState } from 'react'
import { MoreHorizontal, Plus, Upload, X } from 'lucide-react'
import { Avatar, Badge, Button, Card, Input, Select } from '../../../components/ui'
import type { Student } from '../../../data/dummy'
import { grades, statusTone, students as seed } from '../../../data/dummy'
import { EmptyRow, PageHeader, Pagination, SearchBox, formatDate, td, th } from '../components/shared'

export default function StudentsPage() {
  const [items, setItems] = useState<Student[]>(seed)
  const [query, setQuery] = useState('')
  const [grade, setGrade] = useState('All grades')
  const [showAdd, setShowAdd] = useState(false)

  const filtered = items.filter(
    (s) =>
      (grade === 'All grades' || s.grade === grade) &&
      [s.name, s.id, s.guardian].some((v) => v.toLowerCase().includes(query.toLowerCase())),
  )

  const addStudent = (s: Student) => {
    setItems((list) => [s, ...list])
    setShowAdd(false)
  }

  return (
    <>
      <PageHeader
        title="Students"
        subtitle="All enrolled students across grades and sections."
        actions={
          <>
            <Button variant="secondary">
              <Upload className="h-4 w-4" /> Import
            </Button>
            <Button onClick={() => setShowAdd(true)}>
              <Plus className="h-4 w-4" /> Add student
            </Button>
          </>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchBox value={query} onChange={setQuery} placeholder="Search by name, ID or guardian" />
          <div className="w-full sm:w-48">
            <Select options={['All grades', ...grades]} value={grade} onChange={(e) => setGrade(e.target.value)} className="py-2" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/60">
              <tr>
                <th className={th}>Student</th>
                <th className={th}>Class</th>
                <th className={th}>Guardian</th>
                <th className={th}>Enrolled</th>
                <th className={th}>Fees</th>
                <th className={th}>Status</th>
                <th className={th} />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && <EmptyRow colSpan={7} text="No students found." />}
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60">
                  <td className={td}>
                    <div className="flex items-center gap-3">
                      <Avatar name={s.name} size="sm" />
                      <div>
                        <p className="font-medium text-slate-900">{s.name}</p>
                        <p className="text-xs text-slate-400">{s.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className={td}>
                    {s.grade} · {s.section}
                  </td>
                  <td className={td}>
                    <p className="text-slate-700">{s.guardian}</p>
                    <p className="text-xs text-slate-400">{s.phone}</p>
                  </td>
                  <td className={td}>{formatDate(s.enrolledOn)}</td>
                  <td className={td}>
                    <Badge tone={statusTone[s.feeStatus]}>{s.feeStatus}</Badge>
                  </td>
                  <td className={td}>
                    <Badge tone={statusTone[s.status]}>{s.status}</Badge>
                  </td>
                  <td className={`${td} text-right`}>
                    <button className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="More actions">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination shown={filtered.length} total={1248} />
      </Card>

      {showAdd && <AddStudentModal onClose={() => setShowAdd(false)} onSave={addStudent} nextId={`STU-${1001 + items.length}`} />}
    </>
  )
}

function AddStudentModal({ onClose, onSave, nextId }: { onClose: () => void; onSave: (s: Student) => void; nextId: string }) {
  const [name, setName] = useState('')
  const [guardian, setGuardian] = useState('')
  const [error, setError] = useState<string>()

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim() || !guardian.trim()) return setError('Student and guardian names are required')
    const data = new FormData(e.currentTarget)
    onSave({
      id: nextId,
      name: name.trim(),
      guardian: guardian.trim(),
      grade: String(data.get('grade')),
      section: String(data.get('section')),
      phone: String(data.get('phone') || '—'),
      email: String(data.get('email') || '—'),
      enrolledOn: new Date().toISOString().slice(0, 10),
      status: 'Active',
      feeStatus: 'Due',
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <Card className="relative w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="font-semibold text-slate-900">Add new student</h2>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-100" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4 p-6" noValidate>
          <Input label="Student full name" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Alex Morgan" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Grade" name="grade" options={grades} />
            <Select label="Section" name="section" options={['A', 'B', 'C']} />
          </div>
          <Input label="Guardian name" name="guardian" value={guardian} onChange={(e) => setGuardian(e.target.value)} placeholder="e.g. Jordan Morgan" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Guardian phone" name="phone" placeholder="(555) 000-0000" />
            <Input label="Guardian email" name="email" type="email" placeholder="parent@example.com" />
          </div>
          {error && <p className="text-xs text-rose-600">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save student</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
