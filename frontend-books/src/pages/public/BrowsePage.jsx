import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import BookGrid from '../../components/book/BookGrid'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import { getBooks } from '../../services/bookService'
import { filterByCategory, normalizeBooks } from '../../utils/bookHelpers'

function BrowsePage() {
  const [searchParams] = useSearchParams()
  const categoryFilter = searchParams.get('category')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 20  
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  
  useEffect(() => {
  setPage(1)
  }, [categoryFilter])

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = {
          page,
          limit,
        }

        if (categoryFilter) {
            params.category = categoryFilter
        }
        const data = await getBooks(params)
        setTotal(data.total)

        const normalized = normalizeBooks(data.books)
        setBooks(filterByCategory(normalized, categoryFilter))
      } catch {
        setError('We could not load books right now. Please check your connection and try again.')
        setBooks([])
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [categoryFilter, page])

  const pageTitle = categoryFilter || 'All Books'
  const totalPages = Math.ceil(total / limit)
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{pageTitle}</h1>
        {!loading && !error && (
          <p className="mt-2 text-gray-500">
            {books.length} {books.length === 1 ? 'book' : 'books'} found
          </p>
        )}
      </div>

      {loading && <LoadingSpinner message="Loading books..." compact />}

      {!loading && error && (
        <ErrorMessage title="Unable to load books" message={error} />
      )}

      {!loading && !error && (
  <>
    <BookGrid books={books} />

    <div className="flex justify-center items-center gap-4 mt-8">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 border rounded disabled:opacity-50"
      >
        Previous
      </button>

      <span>
        Page {page} of {totalPages}
      </span>

      <button
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        className="px-4 py-2 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </>
)}
    </div>
  )
}

export default BrowsePage
