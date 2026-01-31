import { useEffect, useState } from 'react'
import { Calendar as CalendarIcon, Search, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { employeeService, attendanceService } from '../services/api'
import { DatePicker, message, Spin, Empty, Segmented } from 'antd'
import dayjs from 'dayjs'
import AttendanceSummary from '../components/attendance/AttendanceSummary'
import AttendanceHistoryCard from '../components/attendance/AttendanceHistoryCard'
import AttendanceSummaryTable from '../components/attendance/AttendanceSummaryTable'

interface Employee {
  id: number
  employee_id: string
  full_name: string
  department: string
}

interface AttendanceRecord {
  id: number
  date: string
  status: string
  check_in_time?: string
  remarks?: string
}

export default function AttendanceManager() {
  const [view, setView] = useState<'marking' | 'summary'>('marking')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [history, setHistory] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [marking, setMarking] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [date, setDate] = useState(dayjs())
  const [todayStats, setTodayStats] = useState({ present: 0, absent: 0, total: 0 })

  useEffect(() => {
    employeeService.getAll()
      .then(res => setEmployees(res.data))
      .catch(err => message.error('Failed to load employees'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchTodayStats()
  }, [date])

  const fetchTodayStats = async () => {
    try {
      const res = await attendanceService.getTodayStats(date.format('YYYY-MM-DD'))
      setTodayStats(res.data)
    } catch (err) {
      console.error('Failed to fetch stats')
    }
  }

  const fetchHistory = async (empId: number) => {
    setHistoryLoading(true)
    setHistory([])
    try {
      const res = await attendanceService.getForEmployee(empId)
      setHistory(res.data)
    } catch (err) {
      message.error('Failed to load history')
    } finally {
      setHistoryLoading(false)
    }
  }

  const handleMark = async (emp: Employee, status: 'Present' | 'Absent') => {
    setMarking(`${emp.id}-${status}`)
    const dateStr = date.format('YYYY-MM-DD')
    const timeStr = dayjs().format('hh:mm A')
    try {
      await attendanceService.mark({ 
        employee_id: emp.id, 
        date: dateStr, 
        status,
        check_in_time: status === 'Present' ? timeStr : null,
        remarks: status === 'Present' ? 'On-time' : 'No information'
      })
      message.success(`${status} marked for ${emp.full_name}`)
      fetchTodayStats()
      if (selectedEmployee?.id === emp.id) {
        fetchHistory(emp.id)
      }
    } catch (err) {
      message.error('Failed to mark attendance')
    } finally {
      setMarking(null)
    }
  }

  const viewHistory = (emp: Employee) => {
    setSelectedEmployee(emp)
    fetchHistory(emp.id)
  }

  const filteredEmployees = employees.filter(e => 
    e.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in lg:h-full lg:overflow-hidden h-auto">
      <div className="lg:col-span-2 flex flex-col lg:h-full h-[600px] overflow-hidden">
        <div className="glass-card p-6 flex flex-col h-full bg-white transition-all">
          <div className="flex items-center justify-between mb-6 shrink-0">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                <CalendarIcon size={18} className="text-primary-600" />
                Attendance
              </h2>
              <Segmented 
                size="small"
                options={[
                  { label: 'Control', value: 'marking' },
                  { label: 'Summary', value: 'summary' }
                ]}
                value={view}
                onChange={(val) => setView(val as any)}
                className="custom-segmented"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 mr-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Updates</span>
              </div>
              <DatePicker 
                className="h-9 rounded-lg border-slate-200"
                value={date}
                allowClear={false}
                onChange={(val) => val && setDate(val)}
              />
            </div>
          </div>

          {view === 'marking' ? (
            <div className="flex flex-col flex-1 min-h-0 overflow-hidden animate-fade-in">
              <AttendanceSummary 
                present={todayStats.present}
                absent={todayStats.absent}
                total={todayStats.total}
              />

              <div className="relative mb-4 shrink-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text"
                  placeholder="Search by name or department..."
                  className="input-field !pl-10 !h-9 text-[11px] font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {loading ? (
                  <div className="h-full flex items-center justify-center p-20"><Spin /></div>
                ) : filteredEmployees.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-20 animate-fade-in">
                    <Empty 
                      image={Empty.PRESENTED_IMAGE_SIMPLE} 
                      description={
                        <div className="text-center">
                          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No matching results</p>
                          <p className="text-[10px] text-slate-300 font-medium">Try searching for a different name or department.</p>
                        </div>
                      } 
                    />
                  </div>
                ) : filteredEmployees.map((emp) => (
                  <motion.div 
                    layout
                    key={emp.id} 
                    className={`flex items-center justify-between p-3 bg-white border rounded-2xl transition-all ${
                      selectedEmployee?.id === emp.id ? 'border-primary-500 bg-primary-50/10 shadow-sm' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/30'
                    }`}
                  >
                    <div onClick={() => viewHistory(emp)} className="cursor-pointer group flex-1 flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs uppercase transition-colors shrink-0 ${
                        selectedEmployee?.id === emp.id ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600'
                      }`}>
                        {emp.full_name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-700 text-xs group-hover:text-primary-600 transition-colors truncate">{emp.full_name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight truncate">{emp.employee_id} • {emp.department}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        disabled={marking !== null}
                        onClick={() => handleMark(emp, 'Present')}
                        className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-[9px] uppercase tracking-wider transition-all w-[85px] ${
                          marking === `${emp.id}-Present` ? 'opacity-50 pointer-events-none' : 'hover:bg-emerald-100 active:scale-95'
                        } bg-emerald-50/50 text-emerald-600 border border-emerald-100/50`}
                      >
                        {marking === `${emp.id}-Present` ? <Loader2 className="animate-spin" size={14} /> : 'Present'}
                      </button>
                      <button 
                        disabled={marking !== null}
                        onClick={() => handleMark(emp, 'Absent')}
                        className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-[9px] uppercase tracking-wider transition-all w-[85px] ${
                          marking === `${emp.id}-Absent` ? 'opacity-50 pointer-events-none' : 'hover:bg-rose-100 active:scale-95'
                        } bg-rose-50/50 text-rose-600 border border-rose-100/50`}
                      >
                        {marking === `${emp.id}-Absent` ? <Loader2 className="animate-spin" size={14} /> : 'Absent'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 min-h-0 overflow-hidden animate-fade-in">
              <AttendanceSummaryTable />
            </div>
          )}
        </div>
      </div>

      <AttendanceHistoryCard 
        selectedEmployee={selectedEmployee}
        history={history}
        loading={historyLoading}
      />
    </div>
  )
}
