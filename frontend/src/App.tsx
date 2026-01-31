import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './pages/Dashboard'
import EmployeeList from './pages/EmployeeList'
import AttendanceManager from './pages/AttendanceManager'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) setIsSidebarOpen(false)
      else setIsSidebarOpen(true)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="h-screen w-screen bg-[#F1F5F9] p-2 md:p-4 flex gap-2 md:gap-4 overflow-hidden text-slate-900 relative">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Sidebar - Mobile: Fixed, Desktop: Relative */}
      <div className={`${isMobile ? 'fixed left-2 top-2 bottom-2 z-50' : 'relative h-full'}`}>
        <Sidebar 
          isOpen={isSidebarOpen} 
          isMobile={isMobile}
          onClose={() => isMobile && setIsSidebarOpen(false)}
        />
      </div>

      <main className="flex-1 flex flex-col min-w-0 bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-slate-200/50 overflow-hidden relative transition-all">
        <Header 
          isSidebarOpen={isSidebarOpen} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />

        <section className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-10 bg-white relative">
           <Routes>
             <Route path="/" element={<Dashboard />} />
             <Route path="/employees" element={<EmployeeList />} />
             <Route path="/attendance" element={<AttendanceManager />} />
           </Routes>
        </section>
      </main>
    </div>
  )
}

export default App
