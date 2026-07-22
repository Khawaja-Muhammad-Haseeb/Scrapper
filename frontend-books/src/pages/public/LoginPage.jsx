import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../../components/auth/LoginForm'
import { useAuthStore } from '../../store/authStore'
import { ROUTES } from '../../constants/routes'

function LoginPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isInitializing = useAuthStore((state) => state.isInitializing)

  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      navigate(ROUTES.ADMIN.DASHBOARD, { replace: true })
    }
  }, [isAuthenticated, isInitializing, navigate])

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="card w-full max-w-[400px] p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="mt-2 text-sm text-gray-500">Sign in to access the admin panel</p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage
