import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import { getDashboardStats } from '../../services/adminService'
import { useAuthStore } from '../../store/authStore'
import { ROUTES } from '../../constants/routes'

function StatCard({ label, value, icon, color = 'text-blue-600' }) {
  return (
    <div className="card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className={`mt-3 text-3xl font-bold tracking-tight ${color}`}>{value}</p>
        </div>
        <span className="text-2xl" aria-hidden="true">
          {icon}
        </span>
      </div>
    </div>
  )
}

function AdminHomePage() {
  const username = useAuthStore((state) => state.username) ?? 'Admin'

  const [stats, setStats] = useState({
    total_books: 0,
    categories: 0,
    average_rating: 0,
    in_stock: 0,
    out_of_stock: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await getDashboardStats()
        setStats(data)
      } catch {
        setError('Unable to load dashboard statistics. Please check your connection and try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {username}</h1>
        <p className="mt-1 text-gray-500">Here is an overview of your bookstore catalog and inventory.</p>
      </div>

      {loading && <LoadingSpinner message="Loading dashboard statistics..." compact />}

      {!loading && error && (
        <ErrorMessage title="Dashboard unavailable" message={error} />
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <StatCard label="Total Books" value={stats.total_books} icon="📚" color="text-blue-600" />
            <StatCard label="Categories" value={stats.categories} icon="📂" color="text-indigo-600" />
            <StatCard label="Average Rating" value={`⭐ ${stats.average_rating}`} icon="★" color="text-amber-500" />
            <StatCard label="Books In Stock" value={stats.in_stock} icon="✅" color="text-emerald-600" />
            <StatCard label="Books Out of Stock" value={stats.out_of_stock} icon="⚠️" color="text-rose-600" />
          </div>

          <div className="mt-10">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            <p className="mt-1 text-sm text-gray-500">Manage your catalog, filter books, and add new titles.</p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link to={ROUTES.ADMIN.BOOKS} className="btn-primary">
                Manage Books Catalog
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminHomePage
