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
import { useAuthStore } from './store/authStore'
import { ROUTES } from './constants/routes'

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return children
}

function App() {
  return (
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
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminHomePage />} />
        <Route path="books" element={<ManageBooksPage />} />
      </Route>
    </Routes>
  )
}

export default App
