import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import StarRating from '../../components/book/StarRating'
import BookImage from '../../components/common/BookImage'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import EmptyState from '../../components/common/EmptyState'
import { getBookById } from '../../services/bookService'
import { formatPrice, getAvailabilityClass, getBookFields } from '../../utils/bookHelpers'
import { ROUTES } from '../../constants/routes'

function BookDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) {
        setLoading(false)
        setBook(null)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await getBookById(id)
        setBook(data?.book ?? data ?? null)
      } catch {
        setError('We could not load this book. It may not exist or the server may be offline.')
        setBook(null)
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [id])

  if (loading) {
    return <LoadingSpinner message="Loading book details..." />
  }

  if (error) {
    return (
      <div className="space-y-6">
        <ErrorMessage title="Unable to load book" message={error} />
        <button type="button" onClick={() => navigate(ROUTES.BOOKS)} className="btn-secondary">
          &larr; Back to Books
        </button>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon="📚"
          title="Book not found"
          message="This book may have been removed or the link is incorrect."
        />
        <Link to={ROUTES.BOOKS} className="btn-secondary">
          &larr; Back to Books
        </Link>
      </div>
    )
  }

  const {
    title,
    price,
    rating,
    image,
    category,
    availability,
    description,
    upc,
    reviews,
    bookUrl,
  } = getBookFields(book)

  return (
    <div>
      <button type="button" onClick={() => navigate(-1)} className="btn-secondary mb-8" aria-label="Go back">
        &larr; Back
      </button>

      <article className="card overflow-hidden">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10">
          <div className="overflow-hidden rounded-xl bg-gray-100">
            <BookImage
              src={image}
              alt={`Cover of ${title}`}
              className="mx-auto h-full max-h-[560px] w-full object-contain"
              containerClassName="flex min-h-[280px] items-center justify-center lg:min-h-[480px]"
            />
          </div>

          <div className="flex flex-col">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
                {category}
              </span>
              {availability && (
                <span
                  className={`rounded-lg px-3 py-1 text-sm font-medium ${getAvailabilityClass(availability)}`}
                >
                  {availability}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">{title}</h1>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <span className="text-3xl font-bold text-blue-600">{formatPrice(price)}</span>
              <StarRating rating={rating} />
            </div>

            {description ? (
              <div className="mt-8">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                  Description
                </h2>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-gray-600">{description}</p>
              </div>
            ) : (
              <p className="mt-8 text-sm text-gray-400">No description available for this book.</p>
            )}

            <dl className="mt-8 space-y-4 border-t border-gray-100 pt-8">
              {upc && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">UPC</dt>
                  <dd className="mt-1 text-sm text-gray-900">{upc}</dd>
                </div>
              )}
              {reviews != null && reviews !== '' && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Reviews</dt>
                  <dd className="mt-1 text-sm text-gray-900">{reviews}</dd>
                </div>
              )}
            </dl>

            {bookUrl ? (
              <a
                href={bookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-8 w-fit"
              >
                View Original Listing
              </a>
            ) : (
              <Link to={ROUTES.BOOKS} className="btn-secondary mt-8 w-fit">
                Browse More Books
              </Link>
            )}
          </div>
        </div>
      </article>
    </div>
  )
}

export default BookDetailPage
