/**
 * CollaBro — Reset Password Page
 * Set new password with reset token
 */

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CustomCursor from '../components/CustomCursor.jsx'
import ToastContainer, { useToast } from '../components/ToastSystem.jsx'

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
            <h4>Secure Reset</h4>
            <p>Your account security is our priority</p>
          </div>
        </div>
        <div className="left-feature-card">
          <div className="feature-icon feature-icon-cyan">🔑</div>
          <div className="feature-text">
            <h4>New Password</h4>
            <p>Choose a strong and unique password</p>
          </div>
        </div>
        <div className="left-feature-card">
          <div className="feature-icon feature-icon-magenta">✨</div>
          <div className="feature-text">
            <h4>Back to Creating</h4>
            <p>Get back to building amazing things</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const { token } = useParams()
  const { toasts, addToast, removeToast } = useToast()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [touched, setTouched] = useState({ password: false, confirmPassword: false })
  const [isLoading, setIsLoading] = useState(false)
  const [globalError, setGlobalError] = useState('')

  const passwordError = touched.password ? validatePassword(password) : ''
  const confirmPasswordError = touched.confirmPassword ? validateConfirmPassword(password, confirmPassword) : ''
  const isFormValid = !validatePassword(password) && !validateConfirmPassword(password, confirmPassword)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ password: true, confirmPassword: true })
    setGlobalError('')

    if (!isFormValid) return

    if (!token) {
      setGlobalError('Invalid reset link. Please request a new password reset.')
      addToast('error', 'Invalid Link', 'This reset link is invalid.', 5000)
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
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
        throw new Error(data.message || 'Password reset failed.')
      }

      // Success!
      addToast('success', 'Password Reset Successful! 🎉', 'You can now log in with your new password.', 3000)
      
      // Clear form
      setPassword('')
      setConfirmPassword('')
      
      // Redirect to login after 2 seconds
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      const message = err.message || 'Something went wrong. Please try again.'
      console.error('[Reset Password Error]', err)
      setGlobalError(message)
      addToast('error', 'Reset Failed', message, 5000)
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

        <section className="login-panel-right" aria-label="Reset password form">
          <div className="right-bg-pattern" aria-hidden="true" />
          <div className="right-corner-tl" aria-hidden="true" />
          <div className="right-corner-br" aria-hidden="true" />

          <div className="deco-sticker deco-sticker-1" aria-hidden="true">🔐 Secure</div>
          <div className="deco-sticker deco-sticker-2" aria-hidden="true">🔑 Reset</div>
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
                Reset Your Password
              </div>
            </div>

            <div className="login-heading-wrap">
              <h1 className="login-heading">Set New Password</h1>
              <p className="login-subtitle">
                Choose a strong password to secure your account.
              </p>
            </div>

            {globalError && (
              <div className="global-error-banner" role="alert" aria-live="assertive">
                <span className="global-error-icon" aria-hidden="true">💥</span>
                <span className="global-error-text">{globalError}</span>
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              {/* Password Field */}
              <div className="form-group">
                <label className="form-label" htmlFor="password">
                  <span className="form-label-icon" aria-hidden="true">🔑</span>
                  New Password
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
                    onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    aria-required="true"
                    aria-invalid={!!passwordError}
                    aria-describedby={passwordError ? 'password-error' : undefined}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                  Confirm New Password
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
                    onBlur={() => setTouched((p) => ({ ...p, confirmPassword: true }))}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    aria-required="true"
                    aria-invalid={!!confirmPasswordError}
                    aria-describedby={confirmPasswordError ? 'confirmPassword-error' : undefined}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
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

              <button
                type="submit"
                className={`btn-login ${isLoading ? 'loading' : ''}`}
                disabled={isLoading || !isFormValid}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="btn-spinner" aria-hidden="true" />
                    Resetting Password...
                  </>
                ) : (
                  <>
                    Reset Password
                    <span className="btn-arrow" aria-hidden="true">
                      <ArrowRightIcon />
                    </span>
                  </>
                )}
              </button>
            </form>

            <div className="secure-badge" aria-label="Secure password reset">
              <div className="secure-dot" aria-hidden="true" />
              SSL Encrypted · Secure Reset · 🔒 CollaBro
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
