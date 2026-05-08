import { NavLink } from 'react-router-dom'

export function AppSidebar() {
  return (
    <aside className="app-sidebar" aria-label="Primary">
      <div className="app-sidebar__brand">
        <span className="app-sidebar__brand-mark" aria-hidden="true" />
        <span className="app-sidebar__brand-text">Operations</span>
      </div>
      <nav className="app-sidebar__nav" aria-label="Application">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? 'sidebar-link sidebar-link--active' : 'sidebar-link'
          }
        >
          Dashboard
        </NavLink>
      </nav>
    </aside>
  )
}
