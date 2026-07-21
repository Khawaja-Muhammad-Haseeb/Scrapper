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

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = categoryFilter ? { category: categoryFilter } : {}
        const data = await getBooks(params)
        const normalized = normalizeBooks(data)
        setBooks(filterByCategory(normalized, categoryFilter))
      } catch {
        setError('We could not load books right now. Please check your connection and try again.')
        setBooks([])
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [categoryFilter])

  const pageTitle = categoryFilter || 'All Books'

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

      {!loading && !error && <BookGrid books={books} />}
    </div>
  )
}

export default BrowsePage
