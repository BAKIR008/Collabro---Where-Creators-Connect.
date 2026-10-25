export function getDashboardPath({ accountType, primaryRole } = {}) {
  if (accountType === 'client') return '/dashboard'
  if (primaryRole === 'photographer') return '/photographer-dashboard'
  if (primaryRole === 'script-writer') return '/script-dashboard'
  return '/dashboard'
}

export function getPhotographyDashboardUrl() {
  const configuredUrl = import.meta.env.VITE_PHOTOGRAPHY_DASHBOARD_URL
  if (configuredUrl) return new URL(configuredUrl, window.location.origin).toString()

  const dashboardUrl = new URL(window.location.origin)
  dashboardUrl.port = '2534'
  dashboardUrl.pathname = '/'
  dashboardUrl.search = ''
  dashboardUrl.hash = ''
  return dashboardUrl.toString()
}
