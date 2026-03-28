import { ReactNode } from 'react'
import Sidebar from '../Sidebar/Sidebar'
import './DashboardLayout.css'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        {children}
      </div>
    </div>
  )
}
