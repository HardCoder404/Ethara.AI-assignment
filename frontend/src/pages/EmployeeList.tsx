import { useEffect, useState } from 'react'
import { Plus, Search, Trash2, User, Loader2 } from 'lucide-react'
import { employeeService } from '../services/api'
import { Modal, message, Table, Tag, Tooltip, Pagination, Badge, Button, Input, Select, Space, Empty } from 'antd'
import dayjs from 'dayjs'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import AddEmployeeModal from '../components/modals/AddEmployeeModal'

const { confirm } = Modal;

interface Employee {
  id: number
  employee_id: string
  full_name: string
  email: string
  department: string
  designation: string
  status: string
  created_at?: string
}

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const fetchEmployees = () => {
    setLoading(true)
    employeeService.getAll()
      .then(res => setEmployees(res.data))
      .catch(err => message.error('Failed to fetch employees'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleDelete = (id: number) => {
    confirm({
      title: 'Delete employee permanently?',
      icon: <ExclamationCircleOutlined />,
      content: 'This operation is irreversible.',
      okText: 'Delete',
      okType: 'danger',
      centered: true,
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await employeeService.delete(id)
          message.success('Employee deleted')
          fetchEmployees()
        } catch (err) {
          message.error('Failed to delete')
        }
      },
    });
  }

  const filtered = employees.filter(emp => 
    emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const columns = [
    {
      title: 'EMPLOYEE ID',
      dataIndex: 'employee_id',
      key: 'employee_id',
      render: (text: string) => (
        <span className="font-mono text-xs font-medium text-primary-600 uppercase tracking-tight">{text}</span>
      ),
    },
    {
      title: 'FULL NAME',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (text: string) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
            <User size={14} />
          </div>
          <span className="font-semibold text-slate-700 text-xs">{text}</span>
        </div>
      ),
    },
    {
      title: 'EMAIL',
      dataIndex: 'email',
      key: 'email',
      render: (text: string) => <span className="text-xs text-slate-500">{text}</span>,
    },
    {
      title: 'DEPARTMENT',
      dataIndex: 'department',
      key: 'department',
      render: (dept: string) => (
        <Tag className="border-0 bg-slate-100 text-slate-600 px-3 py-1 rounded font-bold text-[9px] uppercase tracking-wider m-0">
          {dept}
        </Tag>
      ),
    },
    {
      title: 'DESIGNATION',
      dataIndex: 'designation',
      key: 'designation',
      render: (role: string) => <span className="text-xs font-medium text-slate-500">{role}</span>,
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'Active' ? 'success' : 'default'} 
          text={<span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{status}</span>} 
        />
      ),
    },
    {
      title: 'JOINED DATE',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => <span className="text-xs font-medium text-slate-400">{date ? dayjs(date).format('MMM DD, YYYY') : '--'}</span>,
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      align: 'right' as const,
      render: (_: any, record: Employee) => (
        <Tooltip title="Delete">
          <button 
            onClick={() => handleDelete(record.id)}
            className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
          >
            <Trash2 size={18} />
          </button>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in relative flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={16} />
          <input 
            type="text" 
            placeholder="Search employees by name, ID or department..." 
            className="input-field !pl-10 h-10 shadow-sm text-xs font-medium"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary h-10 px-5 shadow-sm">
          <Plus size={18} /> Add Employee
        </button>
      </div>

      <div className="glass-card flex-1 overflow-hidden bg-white flex flex-col">
        <div className="flex-1 overflow-auto no-scrollbar">
          <Table 
            columns={columns} 
            dataSource={filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)} 
            rowKey="id"
            loading={loading}
            pagination={false}
            scroll={{ x: 800 }}
            className="custom-antd-table"
            locale={{
              emptyText: (
                <div className="py-10">
                  <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                    description={
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">No employees found</span>
                    } 
                  />
                </div>
              )
            }}
          />
        </div>
        
        <div className="px-6 py-4 border-t border-slate-50 flex justify-between items-center bg-white">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Showing {Math.min((currentPage - 1) * pageSize + 1, filtered.length)}-{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} employees
          </div>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filtered.length}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      </div>

      <AddEmployeeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchEmployees} 
      />
    </div>
  )
}
