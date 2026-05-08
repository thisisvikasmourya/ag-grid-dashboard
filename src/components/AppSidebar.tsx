import { NavLink } from 'react-router-dom'

type SidebarLink = {
  label: string
  to: string
}

type SidebarSection = {
  title: string
  links: SidebarLink[]
}

const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: 'Main',
    links: [
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'Orders', to: '/dashboard' },
      { label: 'Analytics', to: '/dashboard' },
      { label: 'Categories', to: '/dashboard' },
      { label: 'Products', to: '/dashboard' },
      { label: 'Customers', to: '/dashboard' },
    ],
  },
  {
    title: 'Sales Channels',
    links: [
      { label: 'Online Store', to: '/dashboard' },
      { label: 'Marketing', to: '/dashboard' },
    ],
  },
]

export function AppSidebar() {
  return (
    <aside className="app-sidebar" aria-label="Primary">
      <div className="app-sidebar__brand">
        <span className="app-sidebar__brand-mark" aria-hidden="true" />
        <span className="app-sidebar__brand-text">PowerPixel</span>
      </div>
      {SIDEBAR_SECTIONS.map((section) => (
        <nav key={section.title} className="app-sidebar__nav" aria-label={section.title}>
          <p className="app-sidebar__section-title">{section.title}</p>
          {section.links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                isActive && link.label === 'Dashboard'
                  ? 'sidebar-link sidebar-link--active'
                  : 'sidebar-link'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      ))}
    </aside>
  )
}
