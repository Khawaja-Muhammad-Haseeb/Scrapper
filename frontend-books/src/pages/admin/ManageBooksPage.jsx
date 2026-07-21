import { useEffect, useState } from 'react'
import BookTable from '../../components/admin/BookTable'
import BookForm from '../../components/admin/BookForm'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import SuccessMessage from '../../components/common/SuccessMessage'
import { getBooks, createBook, updateBook, deleteBook } from '../../services/bookService'
import { getBookId, normalizeBooks } from '../../utils/bookHelpers'

function ManageBooksPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [mode, setMode] = useState('list')
  const [editingBook, setEditingBook] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchBooks = async () => {
    try {
      setError(null)
      const data = await getBooks()
      setBooks(normalizeBooks(data))
    } catch {
      setError('Unable to load books. Please check your connection and try again.')
      setBooks([])
    }
  }

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true)
        await fetchBooks()
      } finally {
        setLoading(false)
      }
    }

    loadBooks()
  }, [])

  const handleAddClick = () => {
    setSuccessMessage(null)
    setError(null)
    setEditingBook(null)
    setMode('add')
  }

  const handleEditClick = (book) => {
    setSuccessMessage(null)
    setError(null)
    setEditingBook(book)
    setMode('edit')
  }

  const handleCancelForm = () => {
    setMode('list')
    setEditingBook(null)
  }

  const handleCreate = async (payload) => {
    if (submitting) return

    try {
      setSubmitting(true)
      setError(null)
      await createBook(payload)
      await fetchBooks()
      setMode('list')
      setSuccessMessage('Book added successfully.')
    } catch {
      setError('Failed to add book. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async (payload) => {
    const id = getBookId(editingBook)
    if (!id || submitting) return

    try {
      setSubmitting(true)
      setError(null)
      await updateBook(id, payload)
      await fetchBooks()
      setMode('list')
      setEditingBook(null)
      setSuccessMessage('Book updated successfully.')
    } catch {
      setError('Failed to update book. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id)
  }

  const handleDeleteCancel = () => {
    if (submitting) return
    setDeleteId(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId || submitting) return

    try {
      setSubmitting(true)
      setError(null)
      await deleteBook(deleteId)
      await fetchBooks()
      setDeleteId(null)
      setSuccessMessage('Book deleted successfully.')
    } catch {
      setError('Failed to delete book. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Books</h1>
          <p className="mt-1 text-sm text-gray-500">Create, edit, and delete books in your catalog.</p>
        </div>

        {mode === 'list' && (
          <button
            type="button"
            onClick={handleAddClick}
            disabled={loading || submitting}
            className="btn-primary"
          >
            Add New Book
          </button>
        )}
      </div>

      <SuccessMessage message={successMessage} onDismiss={() => setSuccessMessage(null)} />

      {error && (
        <div className="mb-6">
          <ErrorMessage
            title="Something went wrong"
            message={error}
          />
        </div>
      )}

      {loading && <LoadingSpinner message="Loading books..." />}

      {!loading && mode === 'list' && (
        <BookTable
          books={books}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          disabled={submitting}
        />
      )}

      {!loading && mode === 'add' && (
        <BookForm
          onSubmit={handleCreate}
          onCancel={handleCancelForm}
          submitting={submitting}
          isEdit={false}
        />
      )}

      {!loading && mode === 'edit' && editingBook && (
        <BookForm
          key={getBookId(editingBook)}
          initialBook={editingBook}
          onSubmit={handleUpdate}
          onCancel={handleCancelForm}
          submitting={submitting}
          isEdit
        />
      )}

      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div className="card w-full max-w-md p-6 shadow-lg">
            <h3 id="delete-dialog-title" className="text-lg font-semibold text-gray-900">
              Delete Book
            </h3>
            <p className="mt-3 text-sm text-gray-600">
              Are you sure you want to delete this book?
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={submitting}
                className="btn-danger"
              >
                {submitting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                type="button"
                onClick={handleDeleteCancel}
                disabled={submitting}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageBooksPage
