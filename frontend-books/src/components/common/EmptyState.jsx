function EmptyState({ icon = '📭', title, message }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
      <span className="text-5xl" aria-hidden="true">
        {icon}
      </span>
      <p className="mt-4 text-lg font-medium text-gray-900">{title}</p>
      {message && <p className="mt-2 text-sm text-gray-500">{message}</p>}
    </div>
  )
}

export default EmptyState
