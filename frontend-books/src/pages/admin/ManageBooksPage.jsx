import { useEffect, useState, useCallback } from 'react'
import BookTable from '../../components/admin/BookTable'
import BookForm from '../../components/admin/BookForm'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import { getBooks, createBook, updateBook, deleteBook } from '../../services/bookService'
import { getCategories } from '../../services/categoryService'
import { getBookFields, getBookId, normalizeBooks, normalizeCategories } from '../../utils/bookHelpers'
import { useToastStore } from '../../store/toastStore'

function ManageBooksPage() {
  const toast = useToastStore()

  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mode, setMode] = useState('list')
  const [editingBook, setEditingBook] = useState(null)
  const [deletingBook, setDeletingBook] = useState(null)
  const [submitting, setSubmitting] = useState(false)

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

  // Fetch Categories once for dropdown
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
      setError('Unable to load books. Please check your connection and try again.')
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

  // Handle Search Submission on Enter or Click
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

  const handleAddClick = () => {
    setError(null)
    setEditingBook(null)
    setMode('add')
  }

  const handleEditClick = (book) => {
    setError(null)
    setEditingBook(book)
    setMode('edit')
  }

  const handleCancelForm = () => {
    setMode('list')
    setEditingBook(null)
  }

  const handleCreate = async (payload) => {
    if (submitting) return

    try {
      setSubmitting(true)
      setError(null)
      await createBook(payload)
      toast.success('Book created successfully!')
      await fetchBooks()
      setMode('list')
    } catch {
      setError('Failed to add book. Please verify your inputs and try again.')
      toast.error('Failed to add book.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async (payload) => {
    const id = getBookId(editingBook)
    if (!id || submitting) return

    try {
      setSubmitting(true)
      setError(null)
      await updateBook(id, payload)
      toast.success('Book updated successfully!')
      await fetchBooks()
      setMode('list')
      setEditingBook(null)
    } catch {
      setError('Failed to update book. Please try again.')
      toast.error('Failed to update book.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteClick = (id) => {
    const targetBook = books.find((b) => getBookId(b) === id)
    setDeletingBook(targetBook || { id })
  }

  const handleDeleteCancel = () => {
    if (submitting) return
    setDeletingBook(null)
  }

  const handleDeleteConfirm = async () => {
    const id = getBookId(deletingBook)
    if (!id || submitting) return

    try {
      setSubmitting(true)
      setError(null)
      await deleteBook(id)
      toast.success('Book deleted successfully!')
      await fetchBooks()
      setDeletingBook(null)
    } catch {
      setError('Failed to delete book. Please try again.')
      toast.error('Failed to delete book.')
    } finally {
      setSubmitting(false)
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / limit))
  const deletingTitle = deletingBook ? getBookFields(deletingBook).title : 'this book'

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Books</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create, search, filter, edit, and delete books in your catalog.
          </p>
        </div>

        {mode === 'list' && (
          <button
            type="button"
            onClick={handleAddClick}
            disabled={submitting}
            className="btn-primary flex items-center gap-2"
          >
            <span>+</span> Add New Book
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage title="Action Failed" message={error} />
        </div>
      )}

      {mode === 'list' && (
        <>
          {/* Always Keep Search and Filters Mounted so Input Never Loses Focus */}
          <form onSubmit={handleSearchSubmit} className="mb-6 card p-4 space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* Search Bar with Submit Button */}
              <div>
                <label htmlFor="adminSearchInput" className="block text-xs font-medium text-gray-600 mb-1">
                  Search Catalog (Press Enter)
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    id="adminSearchInput"
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Type full title or keyword..."
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button type="submit" className="btn-primary text-xs py-2 px-3 shrink-0">
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
                <label htmlFor="categorySelect" className="block text-xs font-medium text-gray-600 mb-1">
                  Category
                </label>
                <select
                  id="categorySelect"
                  value={categoryFilter}
                  onChange={handleCategoryChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
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
                <label htmlFor="availSelect" className="block text-xs font-medium text-gray-600 mb-1">
                  Availability
                </label>
                <select
                  id="availSelect"
                  value={availabilityFilter}
                  onChange={handleAvailabilityChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="">All Availability</option>
                  <option value="in stock">In Stock</option>
                </select>
              </div>

              {/* Min Rating Filter */}
              <div>
                <label htmlFor="ratingSelect" className="block text-xs font-medium text-gray-600 mb-1">
                  Min Rating
                </label>
                <select
                  id="ratingSelect"
                  value={minRatingFilter}
                  onChange={handleMinRatingChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
              </div>
            </div>

            {/* Sort & Order Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={handleSortByChange}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:border-blue-500 focus:outline-none bg-white"
                >
                  <option value="Title">Title</option>
                  <option value="Price">Price</option>
                  <option value="Rating">Rating</option>
                  <option value="Reviews">Number of Reviews</option>
                  <option value="Newest">Newest Added</option>
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
                <span className="text-xs font-medium text-gray-500">Page size:</span>
                <select
                  value={limit}
                  onChange={handleLimitChange}
                  className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs focus:border-blue-500 focus:outline-none bg-white"
                >
                  <option value="10">10 per page</option>
                  <option value="20">20 per page</option>
                  <option value="50">50 per page</option>
                </select>
              </div>
            </div>
          </form>

          {/* Render Table or Spinner */}
          {loading ? (
            <LoadingSpinner message="Searching & loading books..." compact />
          ) : (
            <>
              <BookTable
                books={books}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                disabled={submitting}
              />

              {total > 0 && (
                <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <p className="text-xs text-gray-500">
                    Showing {Math.min((page - 1) * limit + 1, total)}–{Math.min(page * limit, total)} of{' '}
                    <strong>{total}</strong> books
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1 || submitting}
                      className="rounded-lg border border-gray-200 px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    <span className="text-xs font-medium text-gray-700 px-2">
                      Page {page} of {totalPages}
                    </span>

                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages || submitting}
                      className="rounded-lg border border-gray-200 px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {!loading && mode === 'add' && (
        <BookForm
          onSubmit={handleCreate}
          onCancel={handleCancelForm}
          submitting={submitting}
          isEdit={false}
        />
      )}

      {!loading && mode === 'edit' && editingBook && (
        <BookForm
          key={getBookId(editingBook)}
          initialBook={editingBook}
          onSubmit={handleUpdate}
          onCancel={handleCancelForm}
          submitting={submitting}
          isEdit
        />
      )}

      {deletingBook && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div className="card w-full max-w-md p-6 shadow-lg">
            <h3 id="delete-dialog-title" className="text-lg font-semibold text-gray-900">
              Delete Book
            </h3>
            <p className="mt-3 text-sm text-gray-600">
              Are you sure you want to delete <strong className="text-gray-900">"{deletingTitle}"</strong>? This action cannot be undone.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={submitting}
                className="btn-danger"
              >
                {submitting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                type="button"
                onClick={handleDeleteCancel}
                disabled={submitting}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageBooksPage
