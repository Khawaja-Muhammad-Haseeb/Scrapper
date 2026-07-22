import { clampRating } from '../../utils/bookHelpers'

function StarRating({ rating = 0 }) {
  const safeRating = clampRating(rating)
  const stars = Array.from({ length: 5 }, (_, index) => {
    const filled = index < Math.round(safeRating)
    return filled ? '★' : '☆'
  })

  return (
    <div
      className="flex items-center gap-0.5 text-amber-400"
      aria-label={`Rating: ${safeRating} out of 5 stars`}
      role="img"
    >
      {stars.map((star, index) => (
        <span key={index} className="text-base leading-none" aria-hidden="true">
          {star}
        </span>
      ))}
    </div>
  )
}

export default StarRating
