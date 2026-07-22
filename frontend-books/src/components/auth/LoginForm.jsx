import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ErrorMessage from '../common/ErrorMessage'
import { login as loginRequest } from '../../services/authService'
import { useAuthStore } from '../../store/authStore'
import { useToastStore } from '../../store/toastStore'
import { ROUTES } from '../../constants/routes'

function LoginForm() {
  const navigate = useNavigate()
  const authLogin = useAuthStore((state) => state.login)
  const toast = useToastStore()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (loading) return

    setError(null)

    if (!username.trim() || !password) {
      setError('Please enter both username and password.')
      return
    }

    try {
      setLoading(true)
      const data = await loginRequest({ username: username.trim(), password })

      const token = data.token ?? data.access_token ?? data.jwt
      const resolvedUsername = data.username ?? data.user?.username ?? username.trim()

      if (!token) {
        setError('Login failed. Invalid response from server.')
        return
      }

      authLogin(token, resolvedUsername)
      toast.success('Signed in successfully!')
      navigate(ROUTES.ADMIN.DASHBOARD)
    } catch {
      setError('Invalid username or password. Please try again.')
      toast.error('Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60'

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {error && (
        <ErrorMessage title="Login failed" message={error} />
      )}

      <div>
        <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          disabled={loading}
          className={inputClass}
          placeholder="Enter your username"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={loading}
          className={inputClass}
          placeholder="Enter your password"
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Signing in...' : 'Login'}
      </button>

      <p className="text-center text-sm text-gray-500">For administrators only.</p>
    </form>
  )
}

export default LoginForm
