import { useState } from 'react'

function BookImageFallback({ compact = false }) {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center bg-gray-100 ${
        compact ? 'min-h-[4rem] min-w-[2.75rem]' : 'min-h-[200px]'
      }`}
      role="img"
      aria-label="No image available"
    >
      <span className={compact ? 'text-xl' : 'text-5xl'} aria-hidden="true">
        📚
      </span>
      {!compact && (
        <span className="mt-3 text-sm font-medium text-gray-400">No Image Available</span>
      )}
    </div>
  )
}

function BookImage({ src, alt = 'Book cover', className = '', containerClassName = '', compact = false }) {
  const [hasError, setHasError] = useState(false)

  if (hasError || !src) {
    return (
      <div className={containerClassName}>
        <BookImageFallback compact={compact} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  )
}

export default BookImage
