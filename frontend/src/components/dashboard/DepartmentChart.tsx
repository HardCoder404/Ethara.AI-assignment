import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { PieChart as PieChartIcon } from 'lucide-react'
import { Empty } from 'antd'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

interface DepartmentChartProps {
  data: { name: string; value: number }[]
}

export default function DepartmentChart({ data }: DepartmentChartProps) {
  const isEmpty = data.length === 0

  return (
    <div className="glass-card bg-white border-slate-100 shadow-sm flex flex-col h-[270px]">
      <div className="px-5 py-3 border-b border-slate-50">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wide">
          <PieChartIcon size={14} className="text-primary-600" />
          Distribution
        </h3>
      </div>
      <div className="flex-1 min-h-0 relative flex items-center justify-center">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center p-8 space-y-2">
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE} 
              description={
                <div className="space-y-1">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">No Distribution Data</p>
                  <p className="text-slate-300 text-[9px] font-medium text-center">Charts will populate once employees are added.</p>
                </div>
              } 
            />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={50}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '6px' }}
                 itemStyle={{ fontSize: '10px', fontWeight: 'bold', padding: 0 }}
              />
              <Legend 
                iconType="circle" 
                verticalAlign="bottom"
                layout="horizontal"
                align="center"
                wrapperStyle={{ fontSize: '8px', fontWeight: 'bold', textTransform: 'uppercase', bottom: '10px' }} 
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
