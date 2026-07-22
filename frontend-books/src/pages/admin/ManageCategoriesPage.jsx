import { useEffect, useState, useCallback } from 'react'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import EmptyState from '../../components/common/EmptyState'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService'
import { normalizeCategories } from '../../utils/bookHelpers'
import { useToastStore } from '../../store/toastStore'

function ManageCategoriesPage() {
  const toast = useToastStore()

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Mode: 'add' | 'edit'
  const [editingCategory, setEditingCategory] = useState(null)
  const [deletingCategory, setDeletingCategory] = useState(null)

  // Form State
  const [categoryName, setCategoryName] = useState('')
  const [categoryUrl, setCategoryUrl] = useState('')
  const [formError, setFormError] = useState('')

  // Search filter
  const [search, setSearch] = useState('')

  const fetchCategoryList = useCallback(async () => {
    try {
      setError(null)
      const data = await getCategories()
      setCategories(normalizeCategories(data))
    } catch {
      setError('Unable to load categories. Please check your connection.')
      setCategories([])
    }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        await fetchCategoryList()
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [fetchCategoryList])

  const handleStartEdit = (category) => {
    setEditingCategory(category)
    setCategoryName(category.name ?? category.Name ?? '')
    setCategoryUrl(category.url ?? category.URL ?? '')
    setFormError('')
  }

  const handleCancelForm = () => {
    setEditingCategory(null)
    setCategoryName('')
    setCategoryUrl('')
    setFormError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return

    setFormError('')

    if (!categoryName.trim()) {
      setFormError('Please enter a category name.')
      return
    }

    try {
      setSubmitting(true)
      const payload = {
        name: categoryName.trim(),
        url: categoryUrl.trim() || undefined,
      }

      if (editingCategory) {
        const catId = editingCategory._id || editingCategory.id
        await updateCategory(catId, payload)
        toast.success(`Category "${categoryName.trim()}" updated successfully!`)
      } else {
        await createCategory(payload)
        toast.success(`Category "${categoryName.trim()}" created successfully!`)
      }

      handleCancelForm()
      await fetchCategoryList()
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to save category.'
      setFormError(msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteClick = (category) => {
    setDeletingCategory(category)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingCategory || submitting) return
    const catId = deletingCategory._id || deletingCategory.id
    const name = deletingCategory.name ?? deletingCategory.Name ?? 'Category'

    try {
      setSubmitting(true)
      await deleteCategory(catId)
      toast.success(`Category "${name}" deleted successfully!`)
      setDeletingCategory(null)
      await fetchCategoryList()
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to delete category.'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const filteredCategories = categories.filter((cat) => {
    const name = cat.name ?? cat.Name ?? ''
    return name.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Categories</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create, edit, search, and delete categories in your catalog.
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage title="Unable to load categories" message={error} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Create / Edit Category Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="card p-6 shadow-sm sticky top-24" noValidate>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              {editingCategory && (
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  + Add New
                </button>
              )}
            </div>

            {formError && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600">
                {formError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="catName" className="block text-xs font-medium text-gray-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="catName"
                  type="text"
                  value={categoryName}
                  onChange={(e) => {
                    setCategoryName(e.target.value)
                    setFormError('')
                  }}
                  disabled={submitting}
                  placeholder="e.g. Science Fiction"
                  className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
                />
              </div>

              <div>
                <label htmlFor="catUrl" className="block text-xs font-medium text-gray-700 mb-1">
                  Category URL (Optional)
                </label>
                <input
                  id="catUrl"
                  type="text"
                  value={categoryUrl}
                  onChange={(e) => setCategoryUrl(e.target.value)}
                  disabled={submitting}
                  placeholder="category/books_1/index.html"
                  className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1"
                >
                  {submitting
                    ? 'Saving...'
                    : editingCategory
                    ? 'Save Changes'
                    : '+ Create Category'}
                </button>

                {editingCategory && (
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    disabled={submitting}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Existing Categories List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-4 flex items-center justify-between gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search category list..."
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
              {filteredCategories.length} categories
            </span>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading categories..." compact />
          ) : filteredCategories.length === 0 ? (
            <EmptyState
              icon="📂"
              title="No categories found"
              message={search ? 'No categories match your search.' : 'No categories exist yet.'}
            />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {filteredCategories.map((category) => {
                const name = category.name ?? category.Name ?? 'Unnamed'
                const isSelected = editingCategory && (editingCategory._id === category._id || editingCategory.id === category.id)

                return (
                  <div
                    key={category._id || name}
                    className={`card flex items-center justify-between p-4 transition-all duration-200 hover:shadow-md ${
                      isSelected ? 'ring-2 ring-blue-500 bg-blue-50/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-bold text-sm">
                        📁
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
                        {category.url && (
                          <p className="text-xs text-gray-400 truncate max-w-[160px]">
                            {category.url}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(category)}
                        disabled={submitting}
                        className="rounded-lg px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(category)}
                        disabled={submitting}
                        className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Category Confirmation Modal */}
      {deletingCategory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-category-title"
        >
          <div className="card w-full max-w-md p-6 shadow-lg">
            <h3 id="delete-category-title" className="text-lg font-semibold text-gray-900">
              Delete Category
            </h3>
            <p className="mt-3 text-sm text-gray-600">
              Are you sure you want to delete <strong className="text-gray-900">"{deletingCategory.name ?? deletingCategory.Name}"</strong>?
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={submitting}
                className="btn-danger"
              >
                {submitting ? 'Deleting...' : 'Delete Category'}
              </button>
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
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

export default ManageCategoriesPage
