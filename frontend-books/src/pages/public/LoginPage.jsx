import LoginForm from '../../components/auth/LoginForm'

function LoginPage() {
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
