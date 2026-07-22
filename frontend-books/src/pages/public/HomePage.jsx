import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import EmptyState from '../../components/common/EmptyState'
import { getCategories } from '../../services/categoryService'
import { getCategoryName, normalizeCategories } from '../../utils/bookHelpers'
import { ROUTES } from '../../constants/routes'

function CategoryCard({ name }) {
  return (
    <Link
      to={`${ROUTES.BOOKS}?category=${encodeURIComponent(name)}`}
      className="group card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      aria-label={`Browse ${name} books`}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
          />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
        {name}
      </h3>
      <p className="mt-1 text-sm text-gray-500">Browse collection</p>
    </Link>
  )
}

function HomePage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getCategories()
        setCategories(normalizeCategories(data))
      } catch {
        setError('We could not load categories right now. Please check your connection and try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="-mx-4 -mt-10 sm:-mx-6 lg:-mx-8">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden="true">
          <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-blue-400 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-indigo-400 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Find Your Next Book
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-blue-100 sm:text-xl">
            Explore thousands of titles across every genre. Discover your next favorite read from our
            curated collection.
          </p>
          <Link to={ROUTES.BOOKS} className="btn-primary mt-10 bg-white px-8 py-3.5 text-base text-blue-600 hover:bg-blue-50">
            Browse Books
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Browse Categories</h2>
          <p className="mt-2 text-gray-500">Explore books organized by genre and topic.</p>
        </div>

        {loading && <LoadingSpinner message="Loading categories..." compact />}

        {!loading && error && (
          <ErrorMessage title="Unable to load categories" message={error} />
        )}

        {!loading && !error && categories.length === 0 && (
          <EmptyState
            icon="📂"
            title="No categories available."
            message="Categories will appear here once they are added."
          />
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => {
              const name = getCategoryName(category)
              return <CategoryCard key={name} name={name} />
            })}
          </div>
        )}
      </section>
    </div>
  )
}

export default HomePage
