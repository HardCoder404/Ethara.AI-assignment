import { Table, Avatar, Badge, Empty } from 'antd'
import { Users, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'

interface RecentEmployee {
  id: number
  full_name: string
  designation: string
  department: string
  created_at?: string
  status: string
}

interface RecentHiresProps {
  employees: RecentEmployee[]
}

export default function RecentHires({ employees }: RecentHiresProps) {
  return (
    <div className="lg:col-span-2 glass-card bg-white border-slate-100 shadow-sm flex flex-col overflow-hidden h-[270px]">
      <div className="px-5 py-3 border-b border-slate-50 flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wide">
          <Users size={14} className="text-primary-600" />
          Recent Hires
        </h3>
        <Link to="/employees" className="text-[9px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 group">
          View All <ArrowUpRight size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
      
      <div className="flex-1 overflow-hidden no-scrollbar">
        <Table 
          dataSource={employees.slice(0, 3)}
          pagination={false}
          rowKey="id"
          size="small"
          className="custom-antd-table px-2"
          locale={{
            emptyText: (
              <div className="py-12 border-0">
                <Empty 
                  image={Empty.PRESENTED_IMAGE_SIMPLE} 
                  description={
                    <div className="space-y-1">
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">No Recent Hires</p>
                      <p className="text-slate-300 text-[9px] font-medium">Add employees to see them here.</p>
                    </div>
                  } 
                />
              </div>
            )
          }}
          columns={[
            {
              title: 'EMPLOYEE',
              key: 'name',
              render: (_, record) => (
                <div className="flex items-center gap-2.5">
                  <Avatar className="bg-slate-100 text-primary-600 font-bold text-[10px] uppercase shrink-0" size={32}>
                    {record.full_name.charAt(0)}
                  </Avatar>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-700 truncate">{record.full_name}</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase truncate">{record.designation}</div>
                  </div>
                </div>
              )
            },
            {
              title: 'DEPARTMENT',
              dataIndex: 'department',
              key: 'department',
              render: (dept) => <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">{dept}</span>
            },
            {
              title: 'JOINED',
              dataIndex: 'created_at',
              key: 'created_at',
              render: (date) => <span className="text-[9px] font-bold text-slate-400 uppercase">{date ? dayjs(date).format('MMM DD') : '--'}</span>
            },
            {
              title: 'STATUS',
              dataIndex: 'status',
              key: 'status',
              render: (status) => (
                <Badge status={status === 'Active' ? 'success' : 'default'} text={<span className="text-[9px] font-bold text-slate-400 uppercase">{status}</span>} />
              )
            }
          ]}
        />
      </div>
    </div>
  )
}
