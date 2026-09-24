/**
 * CollaBro — Login Page
 * Full-featured authentication page matching the landing page design system.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomCursor from '../components/CustomCursor.jsx'
import ToastContainer, { useToast } from '../components/ToastSystem.jsx'

/* ─────────────────────────────────────────────────
   Eye SVG icons for password toggle
───────────────────────────────────────────────── */
const EyeOpenIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const EyeClosedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
)

/* ─────────────────────────────────────────────────
   Google Logo SVG
───────────────────────────────────────────────── */
const GoogleLogo = () => (
  <svg className="google-logo" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

/* ─────────────────────────────────────────────────
   Validation helpers
───────────────────────────────────────────────── */
function validateEmail(value) {
  if (!value.trim()) return 'Email address is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email address.'
  return ''
}

function validatePassword(value) {
  if (!value) return 'Password is required.'
  if (value.length < 8) return 'Password must be at least 8 characters.'
  if (value.length > 64) return 'Password cannot exceed 64 characters.'
  return ''
}

/* ─────────────────────────────────────────────────
   Left Panel — decorative feature list
───────────────────────────────────────────────── */
function LeftPanel() {
  return (
    <div className="login-panel-left">
      <div className="left-grid-bg" aria-hidden="true" />
      <div className="left-glow-1" aria-hidden="true" />
      <div className="left-glow-2" aria-hidden="true" />
      <div className="left-glow-3" aria-hidden="true" />

      {/* Brand */}
      <div className="left-brand">
        <div className="left-wordmark">
          COLLAB<span className="accent">R</span>O
        </div>
        <div className="left-tagline">The Creators Hub</div>
      </div>

      {/* Feature cards */}
      <div className="left-features" aria-hidden="true">
        <div className="left-feature-card">
          <div className="feature-icon feature-icon-yellow">🤝</div>
          <div className="feature-text">
            <h4>Find Collaborators</h4>
            <p>Discover creators who match your vision</p>
          </div>
        </div>
        <div className="left-feature-card">
          <div className="feature-icon feature-icon-cyan">🚀</div>
          <div className="feature-text">
            <h4>Launch Projects</h4>
            <p>Turn ideas into real-world products</p>
          </div>
        </div>
        <div className="left-feature-card">
          <div className="feature-icon feature-icon-magenta">✨</div>
          <div className="feature-text">
            <h4>Build Together</h4>
            <p>The community that ships real things</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="left-stats">
        <div className="left-stat">
          <div className="left-stat-number" style={{ color: 'var(--yellow)' }}>12K+</div>
          <div className="left-stat-label">Creators</div>
        </div>
        <div className="left-stat">
          <div className="left-stat-number" style={{ color: 'var(--cyan)' }}>3K+</div>
          <div className="left-stat-label">Projects</div>
        </div>
        <div className="left-stat">
          <div className="left-stat-number" style={{ color: 'var(--magenta)' }}>95%</div>
          <div className="left-stat-label">Satisfaction</div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────
   Main Login Page
───────────────────────────────────────────────── */
export default function LoginPage() {
  const navigate = useNavigate()
  const { toasts, addToast, removeToast } = useToast()

  /* Form state */
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [touched, setTouched] = useState({ email: false, password: false })
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [globalError, setGlobalError] = useState('')

  /* Compute validation errors */
  const emailError = touched.email ? validateEmail(email) : ''
  const passwordError = touched.password ? validatePassword(password) : ''
  const isFormValid = !validateEmail(email) && !validatePassword(password)

  /* Pre-fill email from localStorage if rememberMe was set */
  useEffect(() => {
    const saved = localStorage.getItem('collabro_remember_email')
    if (saved) {
      setEmail(saved)
      setRememberMe(true)
    }
  }, [])

  /* ─── Handle Email+Password Login ─── */
  const handleLogin = async (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    setGlobalError('')

    if (!isFormValid) return

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        // Handle specific error codes
        if (res.status === 429) {
          throw new Error('Too many login attempts. Please wait 15 minutes.')
        }
        throw new Error(data.message || 'Incorrect email or password.')
      }

      // Save email for "Remember Me"
      if (rememberMe) {
        localStorage.setItem('collabro_remember_email', email.trim().toLowerCase())
      } else {
        localStorage.removeItem('collabro_remember_email')
      }

      addToast('success', 'Welcome back! 👋', `Signed in as ${data.user.name}`, 3000)

      // Short delay for toast visibility, then redirect
      setTimeout(() => navigate('/dashboard'), 1200)
    } catch (err) {
      const message = err.message || 'Something went wrong. Please try again.'

      if (message.includes('network') || message.includes('fetch')) {
        setGlobalError('Network error. Please check your connection and try again.')
        addToast('error', 'Connection Error', 'Unable to reach the server.', 5000)
      } else {
        setGlobalError(message)
        addToast('error', 'Login Failed', message, 5000)
      }
    } finally {
      setIsLoading(false)
    }
  }

  /* ─── Handle Google Login ─── */
  const handleGoogleLogin = useCallback(async (credentialResponse) => {
    const { credential } = credentialResponse
    if (!credential) {
      addToast('error', 'Google Error', 'No credential received from Google.', 5000)
      return
    }

    setIsGoogleLoading(true)
    setGlobalError('')

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ credential }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Google authentication failed.')
      }

      addToast('success', 'Google sign-in successful! 🎉', `Welcome, ${data.user.name}!`, 3000)
      setTimeout(() => navigate('/dashboard'), 1200)
    } catch (err) {
      const message = err.message || 'Google authentication failed. Please try again.'
      setGlobalError(message)
      addToast('error', 'Google Auth Failed', message, 5000)
    } finally {
      setIsGoogleLoading(false)
    }
  }, [addToast, navigate])

  /* ─── Initialize Google Identity Services ─── */
  useEffect(() => {
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') return
    if (typeof window.google === 'undefined') return

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleLogin,
      auto_select: false,
      cancel_on_tap_outside: true,
    })
  }, [handleGoogleLogin])

  /* ─── Google button click — opens account selector ─── */
  const googleBtnRef = useRef()

  const openGoogleLogin = () => {
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
      addToast('warning', 'Google Login Not Configured', 
        'Please add your VITE_GOOGLE_CLIENT_ID to the .env file to enable Google login.', 
        6000)
      return
    }

    if (typeof window.google === 'undefined') {
      addToast('error', 'Google Not Available', 
        'Google Identity Services failed to load. Please refresh the page.', 
        5000)
      return
    }

    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Fallback: render a button popup
        if (googleBtnRef.current) {
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            type: 'standard',
          })
          googleBtnRef.current.querySelector('div[role=button]')?.click()
        }
      }
    })
  }

  /* ─── Field blur handlers ─── */
  const handleEmailBlur = () => setTouched((p) => ({ ...p, email: true }))
  const handlePasswordBlur = () => setTouched((p) => ({ ...p, password: true }))

  return (
    <>
      {/* Noise texture overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Custom cursor */}
      <CustomCursor />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Hidden Google button ref (fallback) */}
      <div ref={googleBtnRef} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }} aria-hidden="true" />

      {/* Main two-panel layout */}
      <main className="login-page" role="main">

        {/* ── Left decorative panel ── */}
        <LeftPanel />

        {/* ── Right form panel ── */}
        <section className="login-panel-right" aria-label="Login form">

          {/* Background pattern */}
          <div className="right-bg-pattern" aria-hidden="true" />

          {/* Corner decorations */}
          <div className="right-corner-tl" aria-hidden="true" />
          <div className="right-corner-br" aria-hidden="true" />

          {/* Floating stickers */}
          <div className="deco-sticker deco-sticker-1" aria-hidden="true">✦ Secure</div>
          <div className="deco-sticker deco-sticker-2" aria-hidden="true">🔒 Encrypted</div>
          <div className="deco-sticker deco-sticker-3" aria-hidden="true">✨ CollaBro</div>

          {/* Login Card */}
          <div className="login-card">

            {/* ── Animated Logo ── */}
            <div className="login-logo-wrap">
              <div className="login-logo-anim" role="img" aria-label="CollaBro logo">
                <div className="logo-fist-row">
                  <span className="logo-fist logo-fist-left" aria-hidden="true">🤜</span>
                  <span className="logo-spark" aria-hidden="true">✨</span>
                  <span className="logo-fist logo-fist-right" aria-hidden="true">🤛</span>
                </div>
                <div className="login-wordmark" aria-label="COLLABRO">
                  COLLAB<span className="logo-accent">R</span>O
                </div>
              </div>
              <div className="login-badge" aria-label="The Creators Hub">
                The Creators Hub
              </div>
            </div>

            {/* ── Heading ── */}
            <div className="login-heading-wrap">
              <h1 className="login-heading">Welcome Back</h1>
              <p className="login-subtitle">Sign in to continue to your account.</p>
            </div>

            {/* ── Global Error Banner ── */}
            {globalError && (
              <div className="global-error-banner" role="alert" aria-live="assertive">
                <span className="global-error-icon" aria-hidden="true">💥</span>
                <span className="global-error-text">{globalError}</span>
              </div>
            )}

            {/* ── Login Form ── */}
            <form
              className="login-form"
              onSubmit={handleLogin}
              noValidate
              aria-label="Sign in with email and password"
            >
              {/* Email Field */}
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  <span className="form-label-icon" aria-hidden="true">📧</span>
                  Email Address
                </label>
                <div className="form-input-wrap">
                  <input
                    id="email"
                    type="email"
                    className={`form-input ${
                      emailError ? 'is-error' :
                      touched.email && !emailError ? 'is-valid' : ''
                    }`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setGlobalError('')
                    }}
                    onBlur={handleEmailBlur}
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-required="true"
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? 'email-error' : undefined}
                    disabled={isLoading || isGoogleLoading}
                  />
                  <div className="input-focus-bar" aria-hidden="true" />
                </div>
                {emailError && (
                  <div id="email-error" className="form-error" role="alert">
                    {emailError}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label className="form-label" htmlFor="password">
                  <span className="form-label-icon" aria-hidden="true">🔑</span>
                  Password
                </label>
                <div className="form-input-wrap">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className={`form-input has-toggle ${
                      passwordError ? 'is-error' :
                      touched.password && !passwordError ? 'is-valid' : ''
                    }`}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setGlobalError('')
                    }}
                    onBlur={handlePasswordBlur}
                    placeholder="Min. 8 characters"
                    autoComplete="current-password"
                    aria-required="true"
                    aria-invalid={!!passwordError}
                    aria-describedby={passwordError ? 'password-error' : undefined}
                    disabled={isLoading || isGoogleLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={0}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </button>
                  <div className="input-focus-bar" aria-hidden="true" />
                </div>
                {passwordError && (
                  <div id="password-error" className="form-error" role="alert">
                    {passwordError}
                  </div>
                )}
              </div>

              {/* Remember Me + Forgot Password */}
              <div className="form-row-options">
                <label className="checkbox-label" htmlFor="remember-me">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                  />
                  <span className="checkbox-custom" aria-hidden="true" />
                  Remember me
                </label>

                <a
                  href="/forgot-password"
                  className="forgot-link"
                  aria-label="Forgot your password? Reset it here."
                >
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`btn-login ${isLoading ? 'loading' : ''}`}
                disabled={isLoading || isGoogleLoading || (!isFormValid && (touched.email || touched.password))}
                aria-busy={isLoading}
                aria-label={isLoading ? 'Signing you in, please wait' : 'Sign in to CollaBro'}
              >
                {isLoading ? (
                  <>
                    <div className="btn-spinner" aria-hidden="true" />
                    Signing you in...
                  </>
                ) : (
                  <>
                    Sign In
                    <span className="btn-arrow" aria-hidden="true">
                      <ArrowRightIcon />
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* ── Divider ── */}
            <div className="auth-divider" aria-hidden="true">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">OR</span>
              <div className="auth-divider-line" />
            </div>

            {/* ── Google Login Button ── */}
            <button
              type="button"
              className="btn-google"
              onClick={openGoogleLogin}
              disabled={isLoading || isGoogleLoading}
              aria-busy={isGoogleLoading}
              aria-label="Continue with Google — opens Google account selection"
            >
              <GoogleLogo />
              {isGoogleLoading ? (
                <>
                  <div className="btn-spinner" style={{ borderTopColor: '#4285F4' }} aria-hidden="true" />
                  Connecting to Google...
                </>
              ) : (
                'Continue with Google'
              )}
            </button>

            {/* ── Sign Up Link ── */}
            <p className="login-footer-text">
              Don&apos;t have an account?{' '}
              <a href="/signup" className="signup-link" aria-label="Create a new CollaBro account">
                Create Account
              </a>
            </p>

            {/* ── Secure Badge ── */}
            <div className="secure-badge" aria-label="Secure SSL encrypted login">
              <div className="secure-dot" aria-hidden="true" />
              SSL Encrypted · Secure Login · 🔒 CollaBro
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
