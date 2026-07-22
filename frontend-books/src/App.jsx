import { useEffect } from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import PublicLayout from './components/layout/PublicLayout'
import AdminLayout from './components/layout/AdminLayout'
import HomePage from './pages/public/HomePage'
import BrowsePage from './pages/public/BrowsePage'
import BookDetailPage from './pages/public/BookDetailPage'
import CategoriesPage from './pages/public/CategoriesPage'
import LoginPage from './pages/public/LoginPage'
import AdminHomePage from './pages/admin/AdminHomePage'
import ManageBooksPage from './pages/admin/ManageBooksPage'
import ManageCategoriesPage from './pages/admin/ManageCategoriesPage'
import LoadingSpinner from './components/common/LoadingSpinner'
import ErrorBoundary from './components/common/ErrorBoundary'
import ToastContainer from './components/common/ToastContainer'
import { useAuthStore } from './store/authStore'
import { ROUTES } from './constants/routes'

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isInitializing = useAuthStore((state) => state.isInitializing)

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoadingSpinner message="Verifying authentication..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return children
}

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth)

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.BOOKS} element={<BrowsePage />} />
          <Route path={`${ROUTES.BOOKS}/:id`} element={<BookDetailPage />} />
          <Route path={ROUTES.CATEGORIES} element={<CategoriesPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        </Route>

        <Route
          path={ROUTES.ADMIN.ROOT}
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <AdminLayout />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHomePage />} />
          <Route path="books" element={<ManageBooksPage />} />
          <Route path="categories" element={<ManageCategoriesPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
