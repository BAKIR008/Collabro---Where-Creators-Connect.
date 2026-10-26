export function getDashboardPath({ accountType, primaryRole } = {}) {
  if (accountType === 'client') return '/client-dashboard'
  if (primaryRole === 'photographer') return '/photographer-dashboard'
  if (primaryRole === 'script-writer') return '/script-dashboard'
  return '/dashboard'
}

/**
 * Returns the URL of the Photography Dashboard.
 *
 * Priority:
 *  1. VITE_PHOTOGRAPHY_DASHBOARD_URL env var (explicit configuration — works in
 *     any environment: local dev, staging, or production).
 *  2. Same origin with port 5175 (the Photography Dashboard's fixed Vite dev-server
 *     port defined in photography-dashbaord/vite.config.js). Local dev fallback only.
 *
 * To configure, add to  CollaBro Login Page/.env:
 *   VITE_PHOTOGRAPHY_DASHBOARD_URL=http://localhost:5175
 * In production, set it to the deployed Photography Dashboard URL.
 *
 * Do NOT assume the dashboard runs on port 2534 — that port is not used.
 */
export function getPhotographyDashboardUrl() {
  const configured = import.meta.env.VITE_PHOTOGRAPHY_DASHBOARD_URL
  if (configured) {
    try {
      return new URL(configured).toString()
    } catch {
      return new URL(configured, window.location.origin).toString()
    }
  }
  // Local-dev fallback: Photography Dashboard Vite server runs on port 5175
  const url = new URL(window.location.origin)
  url.port = '5175'
  url.pathname = '/'
  url.search = ''
  url.hash = ''
  return url.toString()
}
