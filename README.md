# School Registration Portal

UI-only admin portal (React 19 + Vite + TypeScript + Tailwind CSS v4). All data is dummy data from `src/data/dummy.ts`; there is no backend.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173. Demo sign-in: any valid email + any password of 6+ characters.

## Structure

```
src/
  components/ui/        Shared UI kit (Button, Input, Select, Card, Badge, Avatar, Checkbox)
  context/AuthContext   Fake auth (user kept in localStorage)
  data/dummy.ts         Dummy students, applications, classes, stats
  modules/
    auth/               Login, Register, Forgot password, Verify OTP, Reset password
    dashboard/          Layout (sidebar + topbar), Overview, Applications, Students, Classes, Settings
```

## Routes

| Path | Screen |
| --- | --- |
| `/login` | Sign in |
| `/register` | Create account |
| `/forgot-password` → `/verify-otp` → `/reset-password` | Password recovery flow |
| `/dashboard` | Overview (stats, chart, recent applications, activity) |
| `/dashboard/applications` | Applications list with status tabs, search, approve/reject, detail drawer |
| `/dashboard/students` | Students table with search, grade filter, "Add student" modal |
| `/dashboard/classes` | Class/section cards with capacity |
| `/dashboard/settings` | Profile, School, Security, Notifications tabs |

Dashboard routes redirect to `/login` when signed out; auth routes redirect to `/dashboard` when signed in.
# School-registration-portal
