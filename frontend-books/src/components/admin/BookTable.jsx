import StarRating from '../book/StarRating'
import BookImage from '../common/BookImage'
import EmptyState from '../common/EmptyState'
import { formatPrice, getAvailabilityClass, getBookFields, getBookId } from '../../utils/bookHelpers'

function BookTable({ books, onEdit, onDelete, disabled }) {
  if (!books?.length) {
    return (
      <EmptyState
        icon="📚"
        title="No books have been added yet."
        message="Click Add New Book to create your first entry."
      />
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">
            <tr>
              <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Book Cover
              </th>
              <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Title
              </th>
              <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Category
              </th>
              <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Price
              </th>
              <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Rating
              </th>
              <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Availability
              </th>
              <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {books.map((book) => {
              const id = getBookId(book)
              const { title, category, price, rating, image, availability } = getBookFields(book)

              return (
                <tr key={id} className="transition-colors hover:bg-blue-50/40">
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="h-16 w-11 overflow-hidden rounded-lg shadow-sm">
                      <BookImage
                        src={image}
                        alt={`Cover of ${title}`}
                        className="h-full w-full object-cover"
                        containerClassName="h-full w-full"
                        compact
                      />
                    </div>
                  </td>
                  <td className="max-w-[220px] px-5 py-4">
                    <p className="truncate text-sm font-medium text-gray-900" title={title}>
                      {title}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                      {category}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-gray-900">
                    {formatPrice(price)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <StarRating rating={rating} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium ${getAvailabilityClass(availability)}`}
                    >
                      {availability}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(book)}
                        disabled={disabled}
                        aria-label={`Edit ${title}`}
                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(id)}
                        disabled={disabled}
                        aria-label={`Delete ${title}`}
                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BookTable
