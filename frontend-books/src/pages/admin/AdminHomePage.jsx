import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import { getBooks } from '../../services/bookService'
import { getCategories } from '../../services/categoryService'
import { useAuthStore } from '../../store/authStore'
import { normalizeList } from '../../utils/bookHelpers'
import { ROUTES } from '../../constants/routes'

function StatCard({ label, value, icon }) {
  return (
    <div className="card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-3 text-4xl font-bold tracking-tight text-blue-600">{value}</p>
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

  const [stats, setStats] = useState({ books: 0, categories: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)

        const [booksData, categoriesData] = await Promise.all([getBooks(), getCategories()])

        setStats({
          books: normalizeList(booksData).length,
          categories: normalizeList(categoriesData).length,
        })
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
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {username}</h1>
        <p className="mt-2 text-gray-500">Here is an overview of your bookstore.</p>
      </div>

      {loading && <LoadingSpinner message="Loading dashboard..." compact />}

      {!loading && error && (
        <ErrorMessage title="Dashboard unavailable" message={error} />
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <StatCard label="Total Books" value={stats.books} icon="📚" />
            <StatCard label="Total Categories" value={stats.categories} icon="📂" />
          </div>

          <div className="mt-10">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            <p className="mt-1 text-sm text-gray-500">Manage your catalog and add new titles.</p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link to={ROUTES.ADMIN.BOOKS} className="btn-primary">
                Manage Books
              </Link>
              <Link to={ROUTES.ADMIN.BOOKS} className="btn-secondary">
                Add New Book
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminHomePage
