import { useCallback, useState } from 'react'

let nextToastId = 0

export function useToast() {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((current) => current.map((toast) => (
      toast.id === id ? { ...toast, exiting: true } : toast
    )))
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 250)
  }, [])

  const addToast = useCallback((type, title, message, duration = 4000) => {
    const id = ++nextToastId
    setToasts((current) => [...current, { id, type, title, message }])
    window.setTimeout(() => removeToast(id), duration)
  }, [removeToast])

  return { toasts, addToast, removeToast }
}

const icons = { success: '✓', error: '!', warning: '⚠', info: 'i' }

export default function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div className={`toast toast-${toast.type} ${toast.exiting ? 'exiting' : ''}`} key={toast.id} role="status">
          <span className="toast-icon" aria-hidden="true">{icons[toast.type] || icons.info}</span>
          <div className="toast-body">
            {toast.title && <div className="toast-title">{toast.title}</div>}
            <div className="toast-message">{toast.message}</div>
          </div>
          <button className="toast-close" onClick={() => removeToast(toast.id)} aria-label="Dismiss notification">×</button>
        </div>
      ))}
    </div>
  )
}
