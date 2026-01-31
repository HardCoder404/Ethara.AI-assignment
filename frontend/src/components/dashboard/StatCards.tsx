import { motion } from 'framer-motion'
import { Users, UserMinus, UserPlus, TrendingUp, LucideIcon } from 'lucide-react'

interface Stat {
  title: string
  value: string | number
  icon: LucideIcon
  color: string
  bg: string
}

interface StatCardsProps {
  total: number
  present: number
  absent: number
}

export default function StatCards({ total, present, absent }: StatCardsProps) {
  const attendanceRate = total ? Math.round((present / total) * 100) : 0

  const cards: Stat[] = [
    { title: 'Total Employees', value: total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Present Today', value: present, icon: UserPlus, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Absent Today', value: absent, icon: UserMinus, color: 'text-rose-600', bg: 'bg-rose-50' },
    { title: 'Attendance Rate', value: `${attendanceRate}%`, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {cards.map((card, i) => (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          key={card.title}
          className="glass-card p-5 flex items-center justify-between bg-white border-slate-100 shadow-sm transition-all hover:shadow-md"
        >
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">{card.title}</p>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">{card.value}</h3>
          </div>
          <div className={`${card.bg} ${card.color} p-3 rounded-xl`}>
            <card.icon size={20} />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
