import { Outlet } from 'react-router-dom'

import { AppSidebar } from '../components/AppSidebar'

export function AppShell() {
  return (
    <div className="app-shell">
      <AppSidebar />
      <div className="app-main">
        <Outlet />
      </div>
    </div>
  )
}
