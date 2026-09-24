import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import ResetPasswordPage from './pages/ResetPasswordPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/dashboard" element={
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 16, background: '#F7F2E8' }}>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 64, letterSpacing: '0.05em' }}>Welcome to CollaBro!</h1>
          <p style={{ color: '#6b6560', fontSize: 18 }}>You are now logged in. Dashboard coming soon.</p>
          <button
            onClick={() => {
              fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
                .then(() => window.location.href = '/login')
            }}
            style={{ padding: '14px 28px', background: '#0B0B0B', color: '#FFFDF6', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, border: '3px solid #0B0B0B', borderRadius: 6, cursor: 'pointer', fontSize: 14, letterSpacing: '0.05em', textTransform: 'uppercase', boxShadow: '4px 4px 0 #0B0B0B' }}
          >
            Log Out
          </button>
        </div>
      } />
      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
