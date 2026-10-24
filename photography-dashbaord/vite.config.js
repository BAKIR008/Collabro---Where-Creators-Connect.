import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * CollaBro Photography Dashboard — Vite Configuration
 *
 * The Vite dev server proxies all /api requests to the CollaBro Auth &
 * Projects backend (CollaBro Login Page server, default port 5000).
 * The dashboard uses the same JWT cookie the auth server sets, so no
 * separate authentication is needed.
 *
 * Auth App URL (VITE_AUTH_APP_URL) is used to redirect the user to
 * sign in or sign out through the main CollaBro application.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    proxy: {
      // Forward all /api calls to the CollaBro auth + projects backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // Forward /uploads (profile pictures, etc.) to the same server
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
