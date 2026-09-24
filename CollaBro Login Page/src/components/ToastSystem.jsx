/**
 * CollaBro — Toast Notification System
 */

import { useState, useCallback, useEffect } from 'react'

let toastId = 0

// Toast hook — returns { toasts, addToast, removeToast }
export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((type, title, message, duration = 4000) => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, type, title, message }])

    // Auto-dismiss
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
      )
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 400)
    }, duration)

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    )
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 400)
  }, [])

  return { toasts, addToast, removeToast }
}

const ICONS = {
  success: '✅',
  error: '💥',
  warning: '⚠️',
  info: 'ℹ️',
}

// Toast Container Component
export default function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container" role="alert" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type} ${toast.exiting ? 'exiting' : ''}`}
          role="status"
        >
          <span className="toast-icon" aria-hidden="true">
            {ICONS[toast.type] || 'ℹ️'}
          </span>
          <div className="toast-body">
            {toast.title && <div className="toast-title">{toast.title}</div>}
            <div className="toast-message">{toast.message}</div>
          </div>
          <button
            className="toast-close"
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
