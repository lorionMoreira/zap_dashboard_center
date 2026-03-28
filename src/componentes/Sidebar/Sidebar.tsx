import './Sidebar.css'
import { NavLink } from 'react-router-dom'
import { ROUTES } from '../../routes/paths'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Menu</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink 
          to={ROUTES.dashboard} 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          end
        >
          Dashboard
        </NavLink>
        <NavLink 
          to={ROUTES.chat} 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          Chat
        </NavLink>
        <NavLink 
          to={ROUTES.connect} 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          Connect
        </NavLink>
      </nav>
    </aside>
  )
}
