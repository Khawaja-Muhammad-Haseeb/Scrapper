import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useAuthStore } from '../../store/authStore'

const navLinkClass = ({ isActive }) =>
  [
    'rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
    isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  ].join(' ')

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    setMobileOpen(false)
    navigate(ROUTES.HOME)
  }

  const publicLinks = [
    { to: ROUTES.HOME, label: 'Home' },
    { to: ROUTES.BOOKS, label: 'Books' },
    { to: ROUTES.CATEGORIES, label: 'Categories' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/80 shadow-sm backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link
          to={ROUTES.HOME}
          className="text-lg font-semibold tracking-tight text-gray-900 transition-colors hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          BookSite
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {publicLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}

          <div className="ml-4 flex items-center gap-2 border-l border-gray-200 pl-4">
            {isAuthenticated ? (
              <>
                <NavLink to={ROUTES.ADMIN.DASHBOARD} className={navLinkClass}>
                  Admin
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Log out"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to={ROUTES.LOGIN} className="btn-primary px-4 py-2">
                Admin Login
              </Link>
            )}
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
          onClick={() => setMobileOpen((open) => !open)}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {mobileOpen && (
        <div id="mobile-menu" className="border-t border-gray-200/80 bg-white/95 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {publicLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={navLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}

            <div className="mt-3 border-t border-gray-200 pt-3">
              {isAuthenticated ? (
                <>
                  <NavLink
                    to={ROUTES.ADMIN.DASHBOARD}
                    className={navLinkClass}
                    onClick={() => setMobileOpen(false)}
                  >
                    Admin
                  </NavLink>
                  <button
                    type="button"
                    onClick={handleLogout}
                    aria-label="Log out"
                    className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to={ROUTES.LOGIN}
                  className="btn-primary px-4 py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
