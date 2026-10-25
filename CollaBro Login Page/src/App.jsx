/**
 * App.jsx — CollaBro Route Configuration
 *
 * Routing rules:
 *  1. Unauthenticated → /login or /signup
 *  2. Authenticated + onboarding incomplete → /onboarding
 *  3. Authenticated + onboarding complete → role-based dashboard
 *
 * ProtectedRoute wraps any route that requires authentication.
 * It also enforces onboarding completion before allowing dashboard access.
 */

import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './hooks/useAuth.js';
import { useOnboarding } from './hooks/useOnboarding.js';
import { getDashboardPath, getPhotographyDashboardUrl } from './config/dashboardRoutes.js';

import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import { OnboardingPage } from './pages/Onboarding/OnboardingPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ScriptDashboard from './pages/ScriptDashboard/ScriptDashboard.jsx';
import ScriptEditor from './pages/ScriptDashboard/ScriptEditor.jsx';
import ProjectDetail from './pages/ScriptDashboard/ProjectDetail.jsx';

/* ─────────────────────────────────────────────────
   Loading Spinner
───────────────────────────────────────────────── */
function LoadingScreen() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#F7F2E8',
        fontFamily: 'Space Grotesk, sans-serif',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: '4px solid #e0d8cc',
          borderTop: '4px solid #0B0B0B',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <p style={{ color: '#6b6560', fontSize: 14, letterSpacing: '0.05em' }}>Loading CollaBro…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Role-Aware Coming Soon page (for roles without
   a dedicated dashboard yet)
───────────────────────────────────────────────── */
function RoleComingSoon({ role }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (role === 'photographer') {
      window.location.replace(getPhotographyDashboardUrl());
    }
  }, [role]);

  if (role === 'photographer') return <LoadingScreen />;

  const labels = {
    'video-editor': '🎬 Video Editor',
    'content-creator': '✨ Content Creator',
    'thumbnail-maker': '🖼️ Thumbnail Maker',
    'script-writer': '✍️ Script Writer',
    'photographer': '📷 Photographer',
    'client': '💼 Client',
  };
  const label = labels[role] || role || 'Your';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div
      style={{
        fontFamily: 'Space Grotesk, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: 20,
        background: '#F7F2E8',
        textAlign: 'center',
        padding: '0 24px',
      }}
    >
      <h1
        style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: 'clamp(40px, 8vw, 72px)',
          letterSpacing: '0.05em',
          lineHeight: 1,
          margin: 0,
        }}
      >
        {label} Dashboard
      </h1>
      <p style={{ color: '#6b6560', fontSize: 18, maxWidth: 480, margin: 0 }}>
        Your profile is all set! 🎉 This dashboard is currently under development and will be
        available soon. Your role and profile have been saved.
      </p>
      <button
        onClick={handleLogout}
        style={{
          marginTop: 8,
          padding: '14px 28px',
          background: '#0B0B0B',
          color: '#FFFDF6',
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700,
          border: '3px solid #0B0B0B',
          borderRadius: 6,
          cursor: 'pointer',
          fontSize: 14,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          boxShadow: '4px 4px 0 #0B0B0B',
        }}
      >
        Log Out
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   ProtectedRoute
   Requires authentication. If not authenticated →
   /login. If authenticated but onboarding not done
   and trying to access dashboard → /onboarding.
───────────────────────────────────────────────── */
function ProtectedRoute({ children, requireOnboarding = false }) {
  const { user, loading: authLoading } = useAuth();
  const { status, loading: onboardingLoading } = useOnboarding();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || onboardingLoading) return;

    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    if (requireOnboarding && status?.status !== 'completed') {
      navigate('/onboarding', { replace: true });
    }
  }, [user, status, authLoading, onboardingLoading, navigate, requireOnboarding]);

  if (authLoading || onboardingLoading) {
    return <LoadingScreen />;
  }

  if (!user) return null;

  return children;
}

/* ─────────────────────────────────────────────────
   OnboardingGuard
   If user is already done with onboarding, skip
   onboarding and route them to the right dashboard.
───────────────────────────────────────────────── */
function OnboardingGuard({ children }) {
  const { user, loading: authLoading } = useAuth();
  const { status, loading: onboardingLoading } = useOnboarding();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (authLoading || onboardingLoading) return;

    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    // Allow edit-mode navigation even if onboarding is already completed
    const isEditMode = location.state?.editMode === true;
    if (status?.status === 'completed' && !isEditMode) {
      // Already done — go to dashboard
      navigate(getDashboardPath(status), { replace: true });
    }
  }, [user, status, authLoading, onboardingLoading, navigate, location]);

  if (authLoading || onboardingLoading) {
    return <LoadingScreen />;
  }

  if (!user) return null;

  return children;
}

/* ─────────────────────────────────────────────────
   App
───────────────────────────────────────────────── */
export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* Onboarding — requires auth; skips if already completed */}
      <Route
        path="/onboarding"
        element={
          <OnboardingGuard>
            <OnboardingPage />
          </OnboardingGuard>
        }
      />

      {/* Dashboard — requires auth + completed onboarding */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requireOnboarding>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Role-specific dashboard stubs — requires auth + completed onboarding */}
      <Route
        path="/photographer-dashboard"
        element={
          <ProtectedRoute requireOnboarding>
            <RoleComingSoon role="photographer" />
          </ProtectedRoute>
        }
      />

      {/* Script Writer Dashboard — main hub */}
      <Route
        path="/script-dashboard"
        element={
          <ProtectedRoute requireOnboarding>
            <ScriptDashboard />
          </ProtectedRoute>
        }
      />

      {/* Script Editor — create/edit a script */}
      <Route
        path="/script-dashboard/editor/:id"
        element={
          <ProtectedRoute requireOnboarding>
            <ScriptEditor />
          </ProtectedRoute>
        }
      />

      {/* Client Project Detail */}
      <Route
        path="/script-dashboard/project/:id"
        element={
          <ProtectedRoute requireOnboarding>
            <ProjectDetail />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
