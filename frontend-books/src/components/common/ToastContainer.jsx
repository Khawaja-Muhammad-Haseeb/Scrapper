import { useToastStore } from '../../store/toastStore'

const typeStyles = {
  success: 'bg-green-600 text-white shadow-lg shadow-green-600/20',
  error: 'bg-red-600 text-white shadow-lg shadow-red-600/20',
  info: 'bg-blue-600 text-white shadow-lg shadow-blue-600/20',
}

const typeIcons = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
}

function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts)
  const removeToast = useToastStore((state) => state.removeToast)

  if (!toasts.length) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 animate-slide-up ${
            typeStyles[toast.type] || typeStyles.info
          }`}
          role="alert"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
              {typeIcons[toast.type] || 'ℹ'}
            </span>
            <span>{toast.message}</span>
          </div>

          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="rounded-lg p-1 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

export default ToastContainer
