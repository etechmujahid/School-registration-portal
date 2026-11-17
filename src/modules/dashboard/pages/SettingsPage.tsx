import type { FormEvent } from 'react'
import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Avatar, Button, Card, CardHeader, Input, Select, cn } from '../../../components/ui'
import { useAuth } from '../../../context/AuthContext'
import { PageHeader, Tabs } from '../components/shared'

const TABS = ['Profile', 'School', 'Security', 'Notifications'] as const
type Tab = (typeof TABS)[number]

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('Profile')
  const [saved, setSaved] = useState(false)

  const onSave = (e: FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your account and school preferences." />

      <div className="mb-6 max-w-fit">
        <Tabs tabs={TABS} value={tab} onChange={setTab} />
      </div>

      <form onSubmit={onSave} className="max-w-3xl">
        {tab === 'Profile' && <ProfileTab />}
        {tab === 'School' && <SchoolTab />}
        {tab === 'Security' && <SecurityTab />}
        {tab === 'Notifications' && <NotificationsTab />}

        <div className="mt-6 flex items-center justify-end gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600">
              <CheckCircle2 className="h-4 w-4" /> Changes saved
            </span>
          )}
          <Button type="button" variant="secondary">
            Cancel
          </Button>
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </>
  )
}

function ProfileTab() {
  const { user } = useAuth()
  return (
    <Card>
      <CardHeader title="Personal information" subtitle="This is shown to other staff members." />
      <div className="space-y-5 p-5">
        <div className="flex items-center gap-4">
          <Avatar name={user?.name ?? 'User'} size="lg" />
          <div className="flex gap-2">
            <Button type="button" variant="secondary">
              Change photo
            </Button>
            <Button type="button" variant="ghost">
              Remove
            </Button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Full name" name="name" defaultValue={user?.name} />
          <Input label="Email" name="email" type="email" defaultValue={user?.email} />
          <Input label="Phone" name="phone" defaultValue="(555) 210-4488" />
          <Select label="Role" name="role" options={['Admin', 'Registrar', 'Teacher']} defaultValue="Admin" disabled />
        </div>
      </div>
    </Card>
  )
}

function SchoolTab() {
  return (
    <Card>
      <CardHeader title="School details" subtitle="Used on admission letters and receipts." />
      <div className="grid gap-4 p-5 sm:grid-cols-2">
        <Input label="School name" name="school" defaultValue="Greenwood Academy" />
        <Input label="Registration no." name="reg" defaultValue="GWA-2009-4471" />
        <Input label="Contact email" name="schoolEmail" defaultValue="admissions@greenwood.edu" />
        <Input label="Contact phone" name="schoolPhone" defaultValue="(555) 100-2000" />
        <div className="sm:col-span-2">
          <Input label="Address" name="address" defaultValue="1200 Greenwood Ave, Springfield, IL 62704" />
        </div>
        <Select label="Academic year" name="year" options={['2026 – 2027', '2027 – 2028']} />
        <Input label="Application fee ($)" name="fee" type="number" defaultValue={50} />
      </div>
    </Card>
  )
}

function SecurityTab() {
  return (
    <Card>
      <CardHeader title="Change password" subtitle="Use a strong password you don’t use elsewhere." />
      <div className="space-y-4 p-5">
        <Input label="Current password" name="current" type="password" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="New password" name="new" type="password" />
          <Input label="Confirm new password" name="confirm" type="password" />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
          <div>
            <p className="text-sm font-medium text-slate-900">Two-factor authentication</p>
            <p className="text-xs text-slate-500">Require a verification code at sign in.</p>
          </div>
          <Toggle defaultOn />
        </div>
      </div>
    </Card>
  )
}

function NotificationsTab() {
  const items = [
    ['New application submitted', 'Get notified when a parent submits an application.', true],
    ['Application status changes', 'When an application is approved or rejected.', true],
    ['Fee payments', 'When a fee payment is received.', false],
    ['Weekly summary', 'A digest of admissions activity every Monday.', true],
  ] as const
  return (
    <Card>
      <CardHeader title="Email notifications" />
      <ul className="divide-y divide-slate-100">
        {items.map(([title, desc, on]) => (
          <li key={title} className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-slate-900">{title}</p>
              <p className="text-xs text-slate-500">{desc}</p>
            </div>
            <Toggle defaultOn={on} />
          </li>
        ))}
      </ul>
    </Card>
  )
}

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setOn((v) => !v)}
      className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors', on ? 'bg-brand-600' : 'bg-slate-300')}
    >
      <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', on ? 'left-[22px]' : 'left-0.5')} />
    </button>
  )
}
