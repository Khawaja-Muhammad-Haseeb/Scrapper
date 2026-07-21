import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

const sidebarLinkClass = ({ isActive }) =>
  [
    'flex items-center rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
    isActive
      ? 'bg-blue-600 text-white shadow-sm'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  ].join(' ')

const adminLinks = [
  { to: ROUTES.ADMIN.DASHBOARD, label: 'Dashboard', end: true },
  { to: ROUTES.ADMIN.BOOKS, label: 'Manage Books', end: false },
]

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50">
      <div className="mx-auto flex max-w-7xl">
        <aside
          className={[
            'fixed inset-y-0 left-0 z-40 w-64 transform border-r border-gray-200 bg-white shadow-sm transition-transform duration-200 lg:static lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          ].join(' ')}
          aria-label="Admin navigation"
        >
          <div className="flex h-full flex-col px-4 py-6">
            <div className="mb-8 px-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Admin</p>
              <h2 className="mt-1 text-lg font-semibold text-gray-900">BookSite</h2>
            </div>

            <nav className="flex flex-col gap-1">
              {adminLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={sidebarLinkClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {sidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-gray-900/20 lg:hidden"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-gray-200 bg-white/80 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:hidden"
              aria-expanded={sidebarOpen}
              aria-label="Toggle sidebar"
              onClick={() => setSidebarOpen((open) => !open)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
          </header>

          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
