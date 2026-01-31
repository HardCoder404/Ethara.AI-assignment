import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, CalendarCheck, Settings, HelpCircle, Zap, ChevronRight } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  isMobile?: boolean
  onClose?: () => void
}

export default function Sidebar({ isOpen, isMobile, onClose }: SidebarProps) {
  const location = useLocation()

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Employees', path: '/employees', icon: Users },
    { name: 'Attendance', path: '/attendance', icon: CalendarCheck },
  ]

  const widthClass = isMobile 
    ? (isOpen ? 'w-64' : 'w-0 opacity-0 border-0 pointer-events-none') 
    : (isOpen ? 'w-64' : 'w-20')

  return (
    <aside className={`bg-white rounded-[2rem] shadow-sm border border-slate-200/50 flex flex-col transition-all duration-300 ${widthClass} shrink-0 relative z-40 overflow-hidden h-full`}>
      <div className={`flex items-center shrink-0 ${isOpen ? 'p-8 justify-between' : 'py-8 justify-center'} ${isMobile && !isOpen && 'hidden'}`}>
        {isOpen ? (
          <div className="flex items-center gap-2">
             <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-600/30 shrink-0">
                <Zap size={20} fill="white" />
             </div>
             <span className="text-xl font-bold tracking-tight text-slate-800">HRMS<span className="text-primary-600">.</span></span>
          </div>
        ) : (
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-600/30 shrink-0">
             <Zap size={22} fill="white" />
          </div>
        )}
      </div>

      <nav className={`mt-2 px-4 space-y-1.5 flex-1 overflow-y-auto no-scrollbar ${isMobile && !isOpen && 'hidden'}`}>
        <p className={`px-4 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ${!isOpen && 'text-center'}`}>
          {isOpen ? 'Main Menu' : '••'}
        </p>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => isMobile && onClose?.()}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group ${
              location.pathname === item.path 
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' 
                : 'hover:bg-slate-50 text-slate-500'
            } ${!isOpen && 'justify-center'}`}
          >
            <item.icon size={20} strokeWidth={location.pathname === item.path ? 2.5 : 2} className="shrink-0" />
            {isOpen && (
              <div className="flex-1 flex items-center justify-between overflow-hidden">
                <span className="font-semibold text-sm truncate">{item.name}</span>
                {location.pathname === item.path && <ChevronRight size={14} className="opacity-50 shrink-0" />}
              </div>
            )}
          </Link>
        ))}
        
        <div className="pt-6">
           <p className={`px-4 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ${!isOpen && 'text-center'}`}>
             {isOpen ? 'Support' : '••'}
           </p>
           <div className={`flex items-center gap-3 px-4 py-3.5 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors ${!isOpen && 'justify-center'}`}>
              <HelpCircle size={20} className="shrink-0" />
              {isOpen && <span className="font-semibold text-sm truncate">Help Center</span>}
           </div>
           <div className={`flex items-center gap-3 px-4 py-3.5 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors ${!isOpen && 'justify-center'}`}>
              <Settings size={20} className="shrink-0" />
              {isOpen && <span className="font-semibold text-sm truncate">Settings</span>}
           </div>
        </div>
      </nav>

      {isOpen && (
        <div className={`p-4 m-4 bg-primary-50 rounded-2xl border border-primary-100 relative overflow-hidden group shrink-0 ${isMobile && !isOpen && 'hidden'}`}>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 bg-primary-600 rounded-md flex items-center justify-center text-white scale-75 shrink-0">
                <Zap size={12} fill="white" />
              </div>
              <span className="text-[10px] font-extrabold text-primary-700 uppercase tracking-widest">Upgrade Pro</span>
            </div>
            <p className="text-[9px] text-primary-600/80 font-bold leading-tight uppercase">Get AI analytics & support.</p>
          </div>
        </div>
      )}

      <div className={`p-4 border-t border-slate-50 shrink-0 ${isMobile && !isOpen && 'hidden'}`}>
         <div className={`flex items-center ${isOpen ? 'gap-3 px-4' : 'justify-center'} py-2`}>
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-600 shrink-0">
               AD
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0">
                 <div className="text-xs font-bold text-slate-800 truncate">Admin User</div>
                 <div className="text-[9px] text-slate-400 font-bold uppercase truncate">HR Manager</div>
              </div>
            )}
         </div>
      </div>
    </aside>
  )
}
