import { Link } from 'react-router-dom'
import BookImage from '../common/BookImage'
import StarRating from './StarRating'
import { formatPrice, getBookFields } from '../../utils/bookHelpers'

function BookCard({ book }) {
  const { id, title, price, rating, image, category } = getBookFields(book)

  if (!id) return null

  return (
    <Link
      to={`/books/${id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      aria-label={`View ${title}`}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-100">
        <BookImage
          src={image}
          alt={`Cover of ${title}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          containerClassName="h-full w-full"
        />
        <span className="absolute left-3 top-3 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm backdrop-blur-sm">
          {category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="line-clamp-2 min-h-[3rem] text-base font-semibold leading-snug text-gray-900 transition-colors group-hover:text-blue-600">
          {title}
        </h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="text-lg font-bold text-gray-900">{formatPrice(price)}</span>
          <StarRating rating={rating} />
        </div>
      </div>
    </Link>
  )
}

export default BookCard
