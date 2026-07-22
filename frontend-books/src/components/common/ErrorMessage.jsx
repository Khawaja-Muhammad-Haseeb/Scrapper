function ErrorMessage({ message = 'Something went wrong. Please try again later.', title = 'Error' }) {
  return (
    <div
      className="rounded-xl border border-red-100 border-l-4 border-l-red-500 bg-white p-5 shadow-sm"
      role="alert"
      aria-live="assertive"
    >
      <p className="text-sm font-semibold text-red-900">{title}</p>
      <p className="mt-1 text-sm text-red-700">{message}</p>
    </div>
  )
}

export default ErrorMessage
