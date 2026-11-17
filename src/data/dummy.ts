import type { BadgeTone } from '../components/ui'

export type ApplicationStatus = 'Pending' | 'Under Review' | 'Approved' | 'Rejected'
export type StudentStatus = 'Active' | 'Inactive' | 'Graduated'

export type Student = {
  id: string
  name: string
  grade: string
  section: string
  guardian: string
  phone: string
  email: string
  enrolledOn: string
  status: StudentStatus
  feeStatus: 'Paid' | 'Partial' | 'Due'
}

export type Application = {
  id: string
  applicant: string
  grade: string
  parent: string
  email: string
  submittedOn: string
  previousSchool: string
  status: ApplicationStatus
}

export type SchoolClass = {
  id: string
  grade: string
  section: string
  teacher: string
  room: string
  students: number
  capacity: number
}

export const statusTone: Record<ApplicationStatus | StudentStatus | Student['feeStatus'], BadgeTone> = {
  Pending: 'amber',
  'Under Review': 'blue',
  Approved: 'green',
  Rejected: 'rose',
  Active: 'green',
  Inactive: 'slate',
  Graduated: 'blue',
  Paid: 'green',
  Partial: 'amber',
  Due: 'rose',
}

export const grades = ['KG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10']

export const stats = [
  { label: 'Total Students', value: '1,248', change: '+4.2%', trend: 'up' as const },
  { label: 'New Applications', value: '186', change: '+12.5%', trend: 'up' as const },
  { label: 'Pending Reviews', value: '42', change: '-8.1%', trend: 'down' as const },
  { label: 'Fee Collection', value: '$84.3k', change: '+6.7%', trend: 'up' as const },
]

export const monthlyApplications = [
  { month: 'Jun', value: 48 },
  { month: 'Jul', value: 72 },
  { month: 'Aug', value: 134 },
  { month: 'Sep', value: 96 },
  { month: 'Oct', value: 118 },
  { month: 'Nov', value: 186 },
]

export const gradeDistribution = [
  { grade: 'Primary (KG–5)', count: 562 },
  { grade: 'Middle (6–8)', count: 384 },
  { grade: 'Secondary (9–10)', count: 302 },
]

export const students: Student[] = [
  { id: 'STU-1001', name: 'Aiden Carter', grade: 'Grade 5', section: 'A', guardian: 'Michael Carter', phone: '(555) 201-3344', email: 'm.carter@example.com', enrolledOn: '2022-08-15', status: 'Active', feeStatus: 'Paid' },
  { id: 'STU-1002', name: 'Sofia Martinez', grade: 'Grade 3', section: 'B', guardian: 'Elena Martinez', phone: '(555) 342-1190', email: 'elena.m@example.com', enrolledOn: '2023-08-21', status: 'Active', feeStatus: 'Partial' },
  { id: 'STU-1003', name: 'Liam Nguyen', grade: 'Grade 8', section: 'A', guardian: 'Tran Nguyen', phone: '(555) 784-2231', email: 'tran.n@example.com', enrolledOn: '2019-08-12', status: 'Active', feeStatus: 'Paid' },
  { id: 'STU-1004', name: 'Olivia Brown', grade: 'Grade 10', section: 'C', guardian: 'Jessica Brown', phone: '(555) 908-4471', email: 'j.brown@example.com', enrolledOn: '2017-08-14', status: 'Graduated', feeStatus: 'Paid' },
  { id: 'STU-1005', name: 'Noah Patel', grade: 'Grade 1', section: 'A', guardian: 'Raj Patel', phone: '(555) 613-0087', email: 'raj.patel@example.com', enrolledOn: '2025-08-18', status: 'Active', feeStatus: 'Due' },
  { id: 'STU-1006', name: 'Emma Wilson', grade: 'Grade 6', section: 'B', guardian: 'David Wilson', phone: '(555) 455-9012', email: 'd.wilson@example.com', enrolledOn: '2021-08-16', status: 'Active', feeStatus: 'Paid' },
  { id: 'STU-1007', name: 'Lucas Kim', grade: 'Grade 4', section: 'A', guardian: 'Grace Kim', phone: '(555) 227-6650', email: 'grace.kim@example.com', enrolledOn: '2022-08-15', status: 'Inactive', feeStatus: 'Due' },
  { id: 'STU-1008', name: 'Mia Johnson', grade: 'KG', section: 'A', guardian: 'Chris Johnson', phone: '(555) 390-7718', email: 'c.johnson@example.com', enrolledOn: '2026-08-17', status: 'Active', feeStatus: 'Partial' },
  { id: 'STU-1009', name: 'Ethan Ali', grade: 'Grade 9', section: 'B', guardian: 'Fatima Ali', phone: '(555) 116-4429', email: 'fatima.ali@example.com', enrolledOn: '2018-08-13', status: 'Active', feeStatus: 'Paid' },
  { id: 'STU-1010', name: 'Ava Rossi', grade: 'Grade 7', section: 'C', guardian: 'Marco Rossi', phone: '(555) 872-3305', email: 'marco.r@example.com', enrolledOn: '2020-08-17', status: 'Active', feeStatus: 'Paid' },
  { id: 'STU-1011', name: 'James Okafor', grade: 'Grade 2', section: 'B', guardian: 'Ngozi Okafor', phone: '(555) 649-2108', email: 'ngozi.o@example.com', enrolledOn: '2024-08-19', status: 'Active', feeStatus: 'Due' },
  { id: 'STU-1012', name: 'Chloe Dubois', grade: 'Grade 10', section: 'A', guardian: 'Pierre Dubois', phone: '(555) 531-8846', email: 'p.dubois@example.com', enrolledOn: '2016-08-15', status: 'Active', feeStatus: 'Paid' },
]

export const applications: Application[] = [
  { id: 'APP-2411', applicant: 'Harper Lewis', grade: 'Grade 2', parent: 'Rebecca Lewis', email: 'rebecca.l@example.com', submittedOn: '2026-11-15', previousSchool: 'Maple Leaf Elementary', status: 'Pending' },
  { id: 'APP-2410', applicant: 'Benjamin Chen', grade: 'Grade 6', parent: 'Wei Chen', email: 'wei.chen@example.com', submittedOn: '2026-11-14', previousSchool: 'Riverside Middle', status: 'Under Review' },
  { id: 'APP-2409', applicant: 'Zara Hussain', grade: 'KG', parent: 'Omar Hussain', email: 'omar.h@example.com', submittedOn: '2026-11-14', previousSchool: '—', status: 'Approved' },
  { id: 'APP-2408', applicant: 'Daniel Garcia', grade: 'Grade 9', parent: 'Luis Garcia', email: 'luis.g@example.com', submittedOn: '2026-11-13', previousSchool: 'Westbrook High', status: 'Pending' },
  { id: 'APP-2407', applicant: 'Isabella Moore', grade: 'Grade 4', parent: 'Amanda Moore', email: 'amanda.m@example.com', submittedOn: '2026-11-12', previousSchool: 'Sunnyvale Primary', status: 'Rejected' },
  { id: 'APP-2406', applicant: 'Henry Adams', grade: 'Grade 1', parent: 'Paul Adams', email: 'paul.adams@example.com', submittedOn: '2026-11-11', previousSchool: 'Little Stars Preschool', status: 'Approved' },
  { id: 'APP-2405', applicant: 'Amelia Scott', grade: 'Grade 7', parent: 'Laura Scott', email: 'laura.s@example.com', submittedOn: '2026-11-10', previousSchool: 'Oakwood Academy', status: 'Under Review' },
  { id: 'APP-2404', applicant: 'Yusuf Demir', grade: 'Grade 3', parent: 'Ayse Demir', email: 'ayse.d@example.com', submittedOn: '2026-11-09', previousSchool: 'Hillside Elementary', status: 'Pending' },
  { id: 'APP-2403', applicant: 'Lily Baker', grade: 'Grade 5', parent: 'Tom Baker', email: 'tom.baker@example.com', submittedOn: '2026-11-08', previousSchool: 'Greenfield Primary', status: 'Approved' },
  { id: 'APP-2402', applicant: 'Mateo Silva', grade: 'Grade 8', parent: 'Ana Silva', email: 'ana.silva@example.com', submittedOn: '2026-11-07', previousSchool: 'Lakeside Middle', status: 'Under Review' },
]

export const classes: SchoolClass[] = [
  { id: 'C-01', grade: 'KG', section: 'A', teacher: 'Ms. Rachel Green', room: 'K-101', students: 22, capacity: 25 },
  { id: 'C-02', grade: 'Grade 1', section: 'A', teacher: 'Mr. Daniel Brooks', room: 'P-104', students: 28, capacity: 30 },
  { id: 'C-03', grade: 'Grade 2', section: 'B', teacher: 'Mrs. Priya Sharma', room: 'P-108', students: 30, capacity: 30 },
  { id: 'C-04', grade: 'Grade 3', section: 'B', teacher: 'Ms. Hannah Lee', room: 'P-112', students: 26, capacity: 30 },
  { id: 'C-05', grade: 'Grade 5', section: 'A', teacher: 'Mr. Kevin O’Brien', room: 'P-205', students: 29, capacity: 32 },
  { id: 'C-06', grade: 'Grade 6', section: 'B', teacher: 'Mrs. Nadia Farouk', room: 'M-301', students: 31, capacity: 32 },
  { id: 'C-07', grade: 'Grade 8', section: 'A', teacher: 'Mr. Samuel Ortiz', room: 'M-310', students: 27, capacity: 32 },
  { id: 'C-08', grade: 'Grade 10', section: 'C', teacher: 'Dr. Emily Watson', room: 'S-402', students: 33, capacity: 35 },
]

export const recentActivity = [
  { id: 1, text: 'New application received from Harper Lewis (Grade 2)', time: '10 min ago', tone: 'blue' as BadgeTone },
  { id: 2, text: 'Application APP-2409 for Zara Hussain was approved', time: '1 hr ago', tone: 'green' as BadgeTone },
  { id: 3, text: 'Fee payment of $1,200 received for Aiden Carter', time: '3 hrs ago', tone: 'green' as BadgeTone },
  { id: 4, text: 'Application APP-2407 for Isabella Moore was rejected', time: 'Yesterday', tone: 'rose' as BadgeTone },
  { id: 5, text: 'Grade 2 – Section B reached full capacity', time: 'Yesterday', tone: 'amber' as BadgeTone },
]

export const upcomingEvents = [
  { date: 'Nov 20', title: 'Admission interviews – Grade 6', place: 'Main Hall' },
  { date: 'Nov 24', title: 'Parent orientation (new KG intake)', place: 'Auditorium' },
  { date: 'Dec 02', title: 'Registration deadline – Spring term', place: 'Online' },
]
