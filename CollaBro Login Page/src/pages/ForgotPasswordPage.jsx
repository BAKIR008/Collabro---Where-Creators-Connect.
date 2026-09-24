/**
 * CollaBro — Forgot Password Page
 * Request password reset link
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomCursor from '../components/CustomCursor.jsx'
import ToastContainer, { useToast } from '../components/ToastSystem.jsx'

const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
)

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
)

function validateEmail(value) {
  if (!value.trim()) return 'Email address is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email address.'
  return ''
}

function LeftPanel() {
  return (
    <div className="login-panel-left">
      <div className="left-grid-bg" aria-hidden="true" />
      <div className="left-glow-1" aria-hidden="true" />
      <div className="left-glow-2" aria-hidden="true" />
      <div className="left-glow-3" aria-hidden="true" />

      <div className="left-brand">
        <div className="left-wordmark">
          COLLAB<span className="accent">R</span>O
        </div>
        <div className="left-tagline">The Creators Hub</div>
      </div>

      <div className="left-features" aria-hidden="true">
        <div className="left-feature-card">
          <div className="feature-icon feature-icon-yellow">🔐</div>
          <div className="feature-text">
            <h4>Secure Recovery</h4>
            <p>Reset your password safely and securely</p>
          </div>
        </div>
        <div className="left-feature-card">
          <div className="feature-icon feature-icon-cyan">⚡</div>
          <div className="feature-text">
            <h4>Quick Process</h4>
            <p>Get back to creating in minutes</p>
          </div>
        </div>
        <div className="left-feature-card">
          <div className="feature-icon feature-icon-magenta">✉️</div>
          <div className="feature-text">
            <h4>Email Link</h4>
            <p>Check your inbox for reset instructions</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { toasts, addToast, removeToast } = useToast()

  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const emailError = touched ? validateEmail(email) : ''
  const isFormValid = !validateEmail(email)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched(true)

    if (!isFormValid) return

    setIsLoading(true)
    setSuccessMessage('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })

      // Safe JSON parsing with error handling
      let data
      try {
        const text = await res.text()
        data = text ? JSON.parse(text) : {}
      } catch (parseError) {
        console.error('[JSON Parse Error]', parseError)
        throw new Error('Invalid response from server. Please try again.')
      }

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send reset link.')
      }

      // Success!
      setSuccessMessage(data.message || 'If an account with this email exists, a password reset link has been sent. Please check your inbox.')
      addToast('success', 'Email Sent! 📧', 'Check your inbox for reset instructions.', 5000)
      setEmail('')
      setTouched(false)
    } catch (err) {
      const message = err.message || 'Something went wrong. Please try again.'
      console.error('[Forgot Password Error]', err)
      addToast('error', 'Request Failed', message, 5000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="noise-overlay" aria-hidden="true" />
      <CustomCursor />
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <main className="login-page" role="main">
        <LeftPanel />

        <section className="login-panel-right" aria-label="Forgot password form">
          <div className="right-bg-pattern" aria-hidden="true" />
          <div className="right-corner-tl" aria-hidden="true" />
          <div className="right-corner-br" aria-hidden="true" />

          <div className="deco-sticker deco-sticker-1" aria-hidden="true">🔐 Secure</div>
          <div className="deco-sticker deco-sticker-2" aria-hidden="true">⚡ Fast</div>
          <div className="deco-sticker deco-sticker-3" aria-hidden="true">✨ CollaBro</div>

          <div className="login-card">
            <div className="login-logo-wrap">
              <div className="login-logo-anim" role="img" aria-label="CollaBro logo">
                <div className="logo-fist-row">
                  <span className="logo-fist logo-fist-left" aria-hidden="true">🤜</span>
                  <span className="logo-spark" aria-hidden="true">🔑</span>
                  <span className="logo-fist logo-fist-right" aria-hidden="true">🤛</span>
                </div>
                <div className="login-wordmark" aria-label="COLLABRO">
                  COLLAB<span className="logo-accent">R</span>O
                </div>
              </div>
              <div className="login-badge" aria-label="The Creators Hub">
                Password Recovery
              </div>
            </div>

            <div className="login-heading-wrap">
              <h1 className="login-heading">Forgot Password?</h1>
              <p className="login-subtitle">
                No worries! Enter your email and we'll send you reset instructions.
              </p>
            </div>

            {successMessage && (
              <div className="global-success-banner" role="alert" aria-live="polite">
                <span className="global-success-icon" aria-hidden="true">✅</span>
                <span className="global-success-text">{successMessage}</span>
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit} noValidate>
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
                      touched && !emailError ? 'is-valid' : ''
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched(true)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-required="true"
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? 'email-error' : undefined}
                    disabled={isLoading}
                  />
                  <div className="input-focus-bar" aria-hidden="true" />
                </div>
                {emailError && (
                  <div id="email-error" className="form-error" role="alert">
                    {emailError}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className={`btn-login ${isLoading ? 'loading' : ''}`}
                disabled={isLoading || !isFormValid}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="btn-spinner" aria-hidden="true" />
                    Sending Reset Link...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <span className="btn-arrow" aria-hidden="true">
                      <ArrowRightIcon />
                    </span>
                  </>
                )}
              </button>
            </form>

            <button
              type="button"
              className="btn-back-to-login"
              onClick={() => navigate('/login')}
              disabled={isLoading}
            >
              <ArrowLeftIcon />
              Back to Login
            </button>

            <div className="secure-badge" aria-label="Secure password recovery">
              <div className="secure-dot" aria-hidden="true" />
              SSL Encrypted · Secure Recovery · 🔒 CollaBro
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
