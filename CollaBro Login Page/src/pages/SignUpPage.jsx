/**
 * CollaBro — Sign Up Page
 * Email + Password registration with Google OAuth option
 * Matches LoginPage design system exactly
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
function validateName(value) {
  if (!value.trim()) return 'Full name is required.'
  if (value.trim().length < 3) return 'Name must be at least 3 characters.'
  if (value.trim().length > 50) return 'Name cannot exceed 50 characters.'
  return ''
}

function validateEmail(value) {
  if (!value.trim()) return 'Email address is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email address.'
  return ''
}

function validatePassword(value) {
  if (!value) return 'Password is required.'
  if (value.length < 8) return 'Password must be at least 8 characters.'
  if (value.length > 64) return 'Password cannot exceed 64 characters.'
  if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter.'
  if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter.'
  if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number.'
  if (!/(?=.*[@$!%*?&])/.test(value)) return 'Password must contain at least one special character (@$!%*?&).'
  return ''
}

function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return 'Please confirm your password.'
  if (password !== confirmPassword) return 'Passwords do not match.'
  return ''
}

/* ─────────────────────────────────────────────────
   Left Panel — decorative feature list (same as login)
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
   Main Sign Up Page
───────────────────────────────────────────────── */
export default function SignUpPage() {
  const navigate = useNavigate()
  const { toasts, addToast, removeToast } = useToast()

  /* Form state */
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirmPassword: false })
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [globalError, setGlobalError] = useState('')

  /* Compute validation errors */
  const nameError = touched.name ? validateName(name) : ''
  const emailError = touched.email ? validateEmail(email) : ''
  const passwordError = touched.password ? validatePassword(password) : ''
  const confirmPasswordError = touched.confirmPassword ? validateConfirmPassword(password, confirmPassword) : ''
  const isFormValid = !validateName(name) && !validateEmail(email) && !validatePassword(password) && !validateConfirmPassword(password, confirmPassword) && agreeToTerms

  /* ─── Handle Sign Up ─── */
  const handleSignUp = async (e) => {
    e.preventDefault()
    setTouched({ name: true, email: true, password: true, confirmPassword: true })
    setGlobalError('')

    if (!agreeToTerms) {
      setGlobalError('You must agree to the Terms & Conditions to continue.')
      addToast('warning', 'Terms Required', 'Please accept the Terms & Conditions.', 4000)
      return
    }

    if (!isFormValid) return

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          confirmPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429) {
          throw new Error('Too many registration attempts. Please wait 15 minutes.')
        }
        if (res.status === 409) {
          throw new Error(data.message || 'This email is already registered.')
        }
        throw new Error(data.message || 'Registration failed.')
      }

      addToast('success', 'Account Created! 🎉', `Welcome to CollaBro, ${data.user.name}!`, 3000)

      // Short delay for toast visibility, then redirect
      setTimeout(() => navigate('/dashboard'), 1200)
    } catch (err) {
      const message = err.message || 'Something went wrong. Please try again.'

      if (message.includes('network') || message.includes('fetch')) {
        setGlobalError('Network error. Please check your connection and try again.')
        addToast('error', 'Connection Error', 'Unable to reach the server.', 5000)
      } else {
        setGlobalError(message)
        addToast('error', 'Registration Failed', message, 5000)
      }
    } finally {
      setIsLoading(false)
    }
  }

  /* ─── Handle Google Sign Up ─── */
  const handleGoogleSignUp = useCallback(async (credentialResponse) => {
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

      addToast('success', 'Google sign-up successful! 🎉', `Welcome to CollaBro, ${data.user.name}!`, 3000)
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
      callback: handleGoogleSignUp,
      auto_select: false,
      cancel_on_tap_outside: true,
    })
  }, [handleGoogleSignUp])

  /* ─── Google button click ─── */
  const googleBtnRef = useRef()

  const openGoogleSignUp = () => {
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
      addToast('warning', 'Google Sign-Up Not Configured', 
        'Please add your VITE_GOOGLE_CLIENT_ID to the .env file to enable Google sign-up.', 
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
  const handleNameBlur = () => setTouched((p) => ({ ...p, name: true }))
  const handleEmailBlur = () => setTouched((p) => ({ ...p, email: true }))
  const handlePasswordBlur = () => setTouched((p) => ({ ...p, password: true }))
  const handleConfirmPasswordBlur = () => setTouched((p) => ({ ...p, confirmPassword: true }))

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
        <section className="login-panel-right" aria-label="Sign up form">

          {/* Background pattern */}
          <div className="right-bg-pattern" aria-hidden="true" />

          {/* Corner decorations */}
          <div className="right-corner-tl" aria-hidden="true" />
          <div className="right-corner-br" aria-hidden="true" />

          {/* Floating stickers */}
          <div className="deco-sticker deco-sticker-1" aria-hidden="true">✦ Join Us</div>
          <div className="deco-sticker deco-sticker-2" aria-hidden="true">🎉 Create</div>
          <div className="deco-sticker deco-sticker-3" aria-hidden="true">✨ CollaBro</div>

          {/* Sign Up Card */}
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
              <h1 className="login-heading">Create Account</h1>
              <p className="login-subtitle">Join thousands of creators building together.</p>
            </div>

            {/* ── Global Error Banner ── */}
            {globalError && (
              <div className="global-error-banner" role="alert" aria-live="assertive">
                <span className="global-error-icon" aria-hidden="true">💥</span>
                <span className="global-error-text">{globalError}</span>
              </div>
            )}

            {/* ── Sign Up Form ── */}
            <form
              className="login-form"
              onSubmit={handleSignUp}
              noValidate
              aria-label="Sign up with email and password"
            >
              {/* Name Field */}
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  <span className="form-label-icon" aria-hidden="true">👤</span>
                  Full Name
                </label>
                <div className="form-input-wrap">
                  <input
                    id="name"
                    type="text"
                    className={`form-input ${
                      nameError ? 'is-error' :
                      touched.name && !nameError ? 'is-valid' : ''
                    }`}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      setGlobalError('')
                    }}
                    onBlur={handleNameBlur}
                    placeholder="John Doe"
                    autoComplete="name"
                    aria-required="true"
                    aria-invalid={!!nameError}
                    aria-describedby={nameError ? 'name-error' : undefined}
                    disabled={isLoading || isGoogleLoading}
                  />
                  <div className="input-focus-bar" aria-hidden="true" />
                </div>
                {nameError && (
                  <div id="name-error" className="form-error" role="alert">
                    {nameError}
                  </div>
                )}
              </div>

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
                    autoComplete="new-password"
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

              {/* Confirm Password Field */}
              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">
                  <span className="form-label-icon" aria-hidden="true">🔒</span>
                  Confirm Password
                </label>
                <div className="form-input-wrap">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`form-input has-toggle ${
                      confirmPasswordError ? 'is-error' :
                      touched.confirmPassword && !confirmPasswordError ? 'is-valid' : ''
                    }`}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      setGlobalError('')
                    }}
                    onBlur={handleConfirmPasswordBlur}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    aria-required="true"
                    aria-invalid={!!confirmPasswordError}
                    aria-describedby={confirmPasswordError ? 'confirmPassword-error' : undefined}
                    disabled={isLoading || isGoogleLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    tabIndex={0}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </button>
                  <div className="input-focus-bar" aria-hidden="true" />
                </div>
                {confirmPasswordError && (
                  <div id="confirmPassword-error" className="form-error" role="alert">
                    {confirmPasswordError}
                  </div>
                )}
              </div>

              {/* Terms & Conditions Checkbox */}
              <div className="form-row-options">
                <label className="checkbox-label" htmlFor="agree-terms">
                  <input
                    id="agree-terms"
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    disabled={isLoading}
                  />
                  <span className="checkbox-custom" aria-hidden="true" />
                  I agree to the{' '}
                  <a href="/terms" className="forgot-link" target="_blank" rel="noopener noreferrer">
                    Terms & Conditions
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`btn-login ${isLoading ? 'loading' : ''}`}
                disabled={isLoading || isGoogleLoading || !isFormValid}
                aria-busy={isLoading}
                aria-label={isLoading ? 'Creating your account, please wait' : 'Create CollaBro account'}
              >
                {isLoading ? (
                  <>
                    <div className="btn-spinner" aria-hidden="true" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
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

            {/* ── Google Sign Up Button ── */}
            <button
              type="button"
              className="btn-google"
              onClick={openGoogleSignUp}
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

            {/* ── Login Link ── */}
            <p className="login-footer-text">
              Already have an account?{' '}
              <a href="/login" className="signup-link" aria-label="Sign in to your CollaBro account">
                Login
              </a>
            </p>

            {/* ── Secure Badge ── */}
            <div className="secure-badge" aria-label="Secure SSL encrypted registration">
              <div className="secure-dot" aria-hidden="true" />
              SSL Encrypted · Secure Registration · 🔒 CollaBro
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
