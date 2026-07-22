import { useEffect, useState, useCallback } from 'react'
import BookGrid from '../../components/book/BookGrid'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import { getBooks } from '../../services/bookService'
import { getCategories } from '../../services/categoryService'
import { normalizeBooks, normalizeCategories } from '../../utils/bookHelpers'

function FindBookPage() {
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Search & Filter States
  const [searchInput, setSearchInput] = useState('')
  const [activeSearch, setActiveSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState('')
  const [minRatingFilter, setMinRatingFilter] = useState('')
  const [sortBy, setSortBy] = useState('Title')
  const [sortOrder, setSortOrder] = useState('asc')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [total, setTotal] = useState(0)

  // Fetch categories list once
  useEffect(() => {
    const fetchCatList = async () => {
      try {
        const data = await getCategories()
        setCategories(normalizeCategories(data))
      } catch {
        // Silently ignore category fetch errors
      }
    }
    fetchCatList()
  }, [])

  const fetchBooks = useCallback(async () => {
    try {
      setError(null)
      const params = {
        page,
        limit,
        sort_by: sortBy,
        order: sortOrder,
      }

      if (activeSearch.trim()) params.search = activeSearch.trim()
      if (categoryFilter) params.category = categoryFilter
      if (availabilityFilter) params.availability = availabilityFilter
      if (minRatingFilter) params.min_rating = minRatingFilter

      const data = await getBooks(params)
      setTotal(data?.total ?? 0)
      setBooks(normalizeBooks(data?.books ?? data))
    } catch {
      setError('We could not load books right now. Please check your connection and try again.')
      setBooks([])
    }
  }, [page, limit, sortBy, sortOrder, activeSearch, categoryFilter, availabilityFilter, minRatingFilter])

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        await fetchBooks()
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [fetchBooks])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setActiveSearch(searchInput)
    setPage(1)
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setActiveSearch('')
    setPage(1)
  }

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value)
    setPage(1)
  }

  const handleAvailabilityChange = (e) => {
    setAvailabilityFilter(e.target.value)
    setPage(1)
  }

  const handleMinRatingChange = (e) => {
    setMinRatingFilter(e.target.value)
    setPage(1)
  }

  const handleSortByChange = (e) => {
    setSortBy(e.target.value)
    setPage(1)
  }

  const handleSortOrderToggle = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    setPage(1)
  }

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value))
    setPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Find Book</h1>
        <p className="mt-2 text-gray-500">
          Search, filter by category or rating, and sort through our complete library.
        </p>
      </div>

      {/* Search and Filters Control Box */}
      <form onSubmit={handleSearchSubmit} className="mb-8 card p-5 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search Bar */}
          <div>
            <label htmlFor="publicSearchInput" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Search Keywords
            </label>
            <div className="flex items-center gap-1.5">
              <input
                id="publicSearchInput"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Title, category, keyword..."
                className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button type="submit" className="btn-primary text-xs py-2 px-3.5 shrink-0">
                Search
              </button>
              {activeSearch && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="rounded-lg border border-gray-200 px-2 py-2 text-xs text-gray-500 hover:bg-gray-100"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="findCategory" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Category
            </label>
            <select
              id="findCategory"
              value={categoryFilter}
              onChange={handleCategoryChange}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => {
                const name = cat.name ?? cat.Name
                return (
                  <option key={name} value={name}>
                    {name}
                  </option>
                )
              })}
            </select>
          </div>

          {/* Availability Filter */}
          <div>
            <label htmlFor="findAvailability" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Availability
            </label>
            <select
              id="findAvailability"
              value={availabilityFilter}
              onChange={handleAvailabilityChange}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All Statuses</option>
              <option value="in stock">In Stock</option>
            </select>
          </div>

          {/* Minimum Rating */}
          <div>
            <label htmlFor="findRating" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Min Rating
            </label>
            <select
              id="findRating"
              value={minRatingFilter}
              onChange={handleMinRatingChange}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
            </select>
          </div>
        </div>

        {/* Sort & Page Size Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={handleSortByChange}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
            >
              <option value="Title">Title</option>
              <option value="Price">Price</option>
              <option value="Rating">Rating</option>
              <option value="Reviews">Number of Reviews</option>
              <option value="Newest">Newest</option>
            </select>

            <button
              type="button"
              onClick={handleSortOrderToggle}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Show per page:</span>
            <select
              value={limit}
              onChange={handleLimitChange}
              className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
            >
              <option value="12">12 per page</option>
              <option value="20">20 per page</option>
              <option value="40">40 per page</option>
            </select>
          </div>
        </div>
      </form>

      {/* Results Header */}
      {!loading && !error && (
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-600">
            Found <strong>{total}</strong> {total === 1 ? 'book' : 'books'}
          </p>
        </div>
      )}

      {loading && <LoadingSpinner message="Searching books..." compact />}

      {!loading && error && (
        <ErrorMessage title="Unable to load books" message={error} />
      )}

      {!loading && !error && (
        <>
          <BookGrid books={books} />

          {total > 0 && (
            <div className="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row border-t border-gray-200 pt-6">
              <p className="text-xs text-gray-500">
                Page {page} of {totalPages} ({total} total items)
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default FindBookPage
