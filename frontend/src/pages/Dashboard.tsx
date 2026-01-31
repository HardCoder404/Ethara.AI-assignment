import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { employeeService } from '../services/api'
import { message } from 'antd'
import StatCards from '../components/dashboard/StatCards'
import RecentHires from '../components/dashboard/RecentHires'
import DepartmentChart from '../components/dashboard/DepartmentChart'
import DepartmentLoad from '../components/dashboard/DepartmentLoad'
import ReportGenerator from '../components/dashboard/ReportGenerator'

interface RecentEmployee {
  id: number
  employee_id: string
  full_name: string
  email: string
  department: string
  designation: string
  status: string
  created_at?: string
}

interface Stats {
  total_employees: number
  present_today: number
  absent_today: number
  department_distribution: Record<string, number>
  recent_employees: RecentEmployee[]
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    employeeService.getStats()
      .then(res => setStats(res.data))
      .catch(err => message.error('Failed to load dashboard statistics'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 space-y-4">
      <Loader2 className="animate-spin text-primary-600" size={32} />
      <p className="text-slate-400 font-semibold text-xs uppercase tracking-widest">Loading Dashboard</p>
    </div>
  )

  const chartData = stats ? Object.entries(stats.department_distribution).map(([name, value]) => ({ name, value })) : []

  return (
    <div className="space-y-5 animate-fade-in pb-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-0.5">Workforce activity and analytics at a glance.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Live System Online</span>
        </div>
      </div>

      <StatCards 
        total={stats?.total_employees || 0} 
        present={stats?.present_today || 0} 
        absent={stats?.absent_today || 0} 
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-5"
      >
        <RecentHires employees={stats?.recent_employees || []} />
        <DepartmentChart data={chartData} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DepartmentLoad 
          distribution={stats?.department_distribution || {}} 
          total={stats?.total_employees || 0} 
        />
        <ReportGenerator />
      </div>
    </div>
  )
}
