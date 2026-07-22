import { useEffect } from 'react'

function SuccessMessage({ message, onDismiss, duration = 4000 }) {
  useEffect(() => {
    if (!message || !onDismiss) return undefined

    const timer = setTimeout(onDismiss, duration)
    return () => clearTimeout(timer)
  }, [message, onDismiss, duration])

  if (!message) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="mb-6 rounded-xl border border-green-100 border-l-4 border-l-green-500 bg-green-50 p-4 shadow-sm transition-opacity duration-300"
    >
      <p className="text-sm font-medium text-green-800">{message}</p>
    </div>
  )
}

export default SuccessMessage
