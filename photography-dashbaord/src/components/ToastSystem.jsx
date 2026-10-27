/**
 * CollaBro Photography Dashboard — Toast Notification System
 *
 * Provides:
 *   - useToast() hook  →  { toasts, addToast, removeToast }
 *   - <ToastContainer> →  renders the live toast stack
 *
 * Toast types: 'success' | 'error' | 'warning' | 'info'
 * Auto-dismiss after `duration` ms (default 4 000 ms).
 */

import { useCallback, useEffect, useRef, useState } from 'react'

/* ─── Hook ─────────────────────────────────────────────────── */

export function useToast() {
  const [toasts, setToasts] = useState([])
  const counter = useRef(0)

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback((type, title, message = '', duration = 4000) => {
    const id = ++counter.current
    setToasts((current) => [
      ...current,
      { id, type, title, message, duration },
    ])
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
    return id
  }, [removeToast])

  return { toasts, addToast, removeToast }
}

/* ─── Single toast item ─────────────────────────────────────── */

function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false)

  // Trigger enter animation on mount
  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  }

  return (
    <div
      className={`photo-toast photo-toast-${toast.type} ${visible ? 'photo-toast-enter' : ''}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <span className="photo-toast-icon" aria-hidden="true">
        {icons[toast.type] || icons.info}
      </span>
      <div className="photo-toast-body">
        <strong className="photo-toast-title">{toast.title}</strong>
        {toast.message && (
          <span className="photo-toast-message">{toast.message}</span>
        )}
      </div>
      <button
        className="photo-toast-close"
        aria-label={`Dismiss: ${toast.title}`}
        onClick={() => onRemove(toast.id)}
      >
        ×
      </button>
    </div>
  )
}

/* ─── Container ─────────────────────────────────────────────── */

export default function ToastContainer({ toasts, removeToast }) {
  if (!toasts.length) return null

  return (
    <div className="photo-toast-stack" aria-label="Notifications" role="region">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}
