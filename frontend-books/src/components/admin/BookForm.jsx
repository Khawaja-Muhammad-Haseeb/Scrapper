import { useState } from 'react'
import BookImage from '../common/BookImage'

const EMPTY_FORM = {
  Title: '',
  Price: '',
  Rating: '',
  Availability: '',
  category: '',
  Description: '',
  Book_URL: '',
  Image_URL: '',
  UPC: '',
  Number_of_Reviews: '',
}

function isValidUrl(string) {
  if (!string) return true
  try {
    const url = new URL(string)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function bookToForm(book) {
  if (!book) return { ...EMPTY_FORM }

  return {
    Title: book.Title ?? book.title ?? '',
    Price: book.Price ?? book.price ?? '',
    Rating: book.Rating ?? book.rating ?? '',
    Availability: book.Availability ?? book.availability ?? '',
    category: book.category ?? book.Category ?? '',
    Description: book.Description ?? book.description ?? '',
    Book_URL: book.Book_URL ?? book.book_url ?? book.url ?? '',
    Image_URL: book.Image_URL ?? book.image_url ?? book.imageUrl ?? '',
    UPC: book.UPC ?? book.upc ?? '',
    Number_of_Reviews:
      book.Number_of_Reviews ?? book['Number of reviews'] ?? book.number_of_reviews ?? '',
  }
}

function BookForm({ initialBook, onSubmit, onCancel, submitting, isEdit }) {
  const [form, setForm] = useState(() => bookToForm(initialBook))
  const [errors, setErrors] = useState({})

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!form.Title.trim()) {
      nextErrors.Title = 'Please enter a book title.'
    }

    if (form.Price === '' || form.Price == null) {
      nextErrors.Price = 'Please enter a price.'
    } else {
      const price = parseFloat(form.Price)
      if (Number.isNaN(price)) nextErrors.Price = 'Price must be a valid number.'
      else if (price < 0) nextErrors.Price = 'Price cannot be negative.'
    }

    if (form.Rating === '' || form.Rating == null) {
      nextErrors.Rating = 'Please enter a rating.'
    } else {
      const rating = parseFloat(form.Rating)
      if (Number.isNaN(rating)) nextErrors.Rating = 'Rating must be a valid number.'
      else if (rating < 1 || rating > 5) nextErrors.Rating = 'Rating must be between 1 and 5.'
    }

    if (!form.category.trim()) {
      nextErrors.category = 'Please enter a category.'
    }

    if (form.Image_URL.trim() && !isValidUrl(form.Image_URL.trim())) {
      nextErrors.Image_URL = 'Please enter a valid HTTP or HTTPS image URL.'
    }

    if (form.Book_URL.trim() && !isValidUrl(form.Book_URL.trim())) {
      nextErrors.Book_URL = 'Please enter a valid HTTP or HTTPS book URL.'
    }

    if (form.Description.length > 2000) {
      nextErrors.Description = 'Description must not exceed 2000 characters.'
    }

    if (form.Number_of_Reviews !== '') {
      const reviews = parseFloat(form.Number_of_Reviews)
      if (Number.isNaN(reviews)) {
        nextErrors.Number_of_Reviews = 'Review count must be a valid number.'
      } else if (reviews < 0) {
        nextErrors.Number_of_Reviews = 'Review count cannot be negative.'
      }
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (submitting || !validate()) return

    const payload = {
      title: form.Title.trim(),
      category: form.category.trim(),
      price: parseFloat(form.Price),
      rating: parseInt(form.Rating, 10),
      availability: form.Availability.trim() || undefined,
      description: form.Description.trim() || undefined,
      book_url: form.Book_URL.trim() || undefined,
      image_url: form.Image_URL.trim() || undefined,
      upc: form.UPC.trim() || undefined,
      number_of_reviews:
        form.Number_of_Reviews !== '' ? parseInt(form.Number_of_Reviews, 10) : undefined,
    }

    onSubmit(payload)
  }

  const inputClass = (field) =>
    [
      'w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60',
      errors[field] ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-200',
    ].join(' ')

  const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700'

  return (
    <form onSubmit={handleSubmit} noValidate className="card p-6 sm:p-8">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        {isEdit ? 'Edit Book' : 'Add New Book'}
      </h2>

      <div className="mb-8 flex flex-col items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:flex-row">
        <div className="h-28 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <BookImage
            src={form.Image_URL.trim()}
            alt="Preview"
            className="h-full w-full object-cover"
            containerClassName="h-full w-full"
            compact
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">Cover Image Preview</p>
          <p className="mt-1 text-xs text-gray-500">
            Paste a valid image URL below to see a real-time cover preview.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className={labelClass}>
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={form.Title}
            onChange={handleChange('Title')}
            disabled={submitting}
            className={inputClass('Title')}
            placeholder="Book title"
          />
          {errors.Title && <p className="mt-1 text-xs text-red-600">{errors.Title}</p>}
        </div>

        <div>
          <label htmlFor="price" className={labelClass}>
            Price (£) <span className="text-red-500">*</span>
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={form.Price}
            onChange={handleChange('Price')}
            disabled={submitting}
            className={inputClass('Price')}
            placeholder="0.00"
          />
          {errors.Price && <p className="mt-1 text-xs text-red-600">{errors.Price}</p>}
        </div>

        <div>
          <label htmlFor="rating" className={labelClass}>
            Rating (1–5) <span className="text-red-500">*</span>
          </label>
          <input
            id="rating"
            type="number"
            step="1"
            min="1"
            max="5"
            value={form.Rating}
            onChange={handleChange('Rating')}
            disabled={submitting}
            className={inputClass('Rating')}
            placeholder="1–5"
          />
          {errors.Rating && <p className="mt-1 text-xs text-red-600">{errors.Rating}</p>}
        </div>

        <div>
          <label htmlFor="availability" className={labelClass}>
            Availability
          </label>
          <input
            id="availability"
            type="text"
            value={form.Availability}
            onChange={handleChange('Availability')}
            disabled={submitting}
            className={inputClass('Availability')}
            placeholder="In stock (22 available)"
          />
        </div>

        <div>
          <label htmlFor="category" className={labelClass}>
            Category <span className="text-red-500">*</span>
          </label>
          <input
            id="category"
            type="text"
            value={form.category}
            onChange={handleChange('category')}
            disabled={submitting}
            className={inputClass('category')}
            placeholder="e.g. Fiction"
          />
          {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className={labelClass}>
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={form.Description}
            onChange={handleChange('Description')}
            disabled={submitting}
            className={inputClass('Description')}
            placeholder="Book description"
          />
          {errors.Description && <p className="mt-1 text-xs text-red-600">{errors.Description}</p>}
        </div>

        <div>
          <label htmlFor="bookUrl" className={labelClass}>
            Book URL
          </label>
          <input
            id="bookUrl"
            type="url"
            value={form.Book_URL}
            onChange={handleChange('Book_URL')}
            disabled={submitting}
            className={inputClass('Book_URL')}
            placeholder="https://..."
          />
          {errors.Book_URL && <p className="mt-1 text-xs text-red-600">{errors.Book_URL}</p>}
        </div>

        <div>
          <label htmlFor="imageUrl" className={labelClass}>
            Image URL
          </label>
          <input
            id="imageUrl"
            type="url"
            value={form.Image_URL}
            onChange={handleChange('Image_URL')}
            disabled={submitting}
            className={inputClass('Image_URL')}
            placeholder="https://..."
          />
          {errors.Image_URL && <p className="mt-1 text-xs text-red-600">{errors.Image_URL}</p>}
        </div>

        <div>
          <label htmlFor="upc" className={labelClass}>
            UPC
          </label>
          <input
            id="upc"
            type="text"
            value={form.UPC}
            onChange={handleChange('UPC')}
            disabled={submitting}
            className={inputClass('UPC')}
            placeholder="Product code"
          />
        </div>

        <div>
          <label htmlFor="reviews" className={labelClass}>
            Number of Reviews
          </label>
          <input
            id="reviews"
            type="number"
            min="0"
            value={form.Number_of_Reviews}
            onChange={handleChange('Number_of_Reviews')}
            disabled={submitting}
            className={inputClass('Number_of_Reviews')}
            placeholder="0"
          />
          {errors.Number_of_Reviews && (
            <p className="mt-1 text-xs text-red-600">{errors.Number_of_Reviews}</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Book'}
        </button>
        <button type="button" onClick={onCancel} disabled={submitting} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default BookForm
