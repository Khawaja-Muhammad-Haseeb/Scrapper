import BookCard from './BookCard'
import EmptyState from '../common/EmptyState'

function BookGrid({ books }) {
  if (!books?.length) {
    return (
      <EmptyState
        icon="📚"
        title="No books available."
        message="Check back later or try browsing a different category."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {books.map((book) => (
        <BookCard key={book._id ?? book.id} book={book} />
      ))}
    </div>
  )
}

export default BookGrid
