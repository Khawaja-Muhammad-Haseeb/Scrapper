export function normalizeBooks(data) {
  if (Array.isArray(data)) return data
  if (data?.books) return data.books
  if (data?.data) return data.data
  return []
}

export function normalizeCategories(data) {
  if (Array.isArray(data)) return data
  if (data?.categories) return data.categories
  if (data?.data) return data.data
  return []
}

export function normalizeList(data) {
  if (Array.isArray(data)) return data
  if (data?.books) return data.books
  if (data?.categories) return data.categories
  if (data?.data) return data.data
  return []
}

export function getBookId(book) {
  return book?._id ?? book?.id ?? null
}

export function getCategoryName(category) {
  return category?.name ?? category?.Name ?? 'Unknown'
}

export function formatPrice(price) {
  if (price == null || price === '') return 'Price unavailable'
  const num = typeof price === 'number' ? price : parseFloat(price)
  if (Number.isNaN(num) || num < 0) return 'Price unavailable'
  return `£${num.toFixed(2)}`
}

export function getBookFields(book) {
  return {
    id: getBookId(book),
    title: book?.Title ?? book?.title ?? 'Untitled',
    price: book?.Price ?? book?.price,
    rating: book?.Rating ?? book?.rating ?? 0,
    image: book?.Image_URL ?? book?.image_url ?? book?.imageUrl ?? null,
    category: book?.category ?? book?.Category ?? 'Uncategorized',
    availability: book?.Availability ?? book?.availability ?? 'Unknown',
    description: book?.Description ?? book?.description ?? '',
    upc: book?.UPC ?? book?.upc ?? '',
    reviews: book?.Number_of_Reviews ?? book?.['Number of reviews'] ?? book?.number_of_reviews ?? '',
    bookUrl: book?.Book_URL ?? book?.book_url ?? book?.url ?? '',
  }
}

export function filterByCategory(books, category) {
  if (!category || !Array.isArray(books)) return books ?? []
  return books.filter((book) => {
    const bookCategory = book?.category ?? book?.Category ?? ''
    return bookCategory.toLowerCase() === category.toLowerCase()
  })
}

export function getAvailabilityClass(availability) {
  if (!availability) return 'bg-gray-100 text-gray-700'
  const lower = String(availability).toLowerCase()
  if (lower.includes('in stock')) return 'bg-green-100 text-green-800'
  return 'bg-gray-100 text-gray-700'
}

export function clampRating(rating) {
  const num = typeof rating === 'number' ? rating : parseFloat(rating)
  if (Number.isNaN(num)) return 0
  return Math.min(5, Math.max(0, num))
}
