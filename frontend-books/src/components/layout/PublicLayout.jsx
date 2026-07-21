import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} BookSite. All rights reserved.
          </p>
          <p className="text-sm text-gray-400">Discover your next great read.</p>
        </div>
      </footer>
    </div>
  )
}

export default PublicLayout
