function LoadingSpinner({ message = 'Loading...', compact = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center ${compact ? 'py-10' : 'min-h-[40vh] py-20'}`}
      role="status"
      aria-live="polite"
    >
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"
        aria-hidden="true"
      />
      {message && <p className="mt-4 text-sm text-gray-500">{message}</p>}
      <span className="sr-only">{message || 'Loading'}</span>
    </div>
  )
}

export default LoadingSpinner
