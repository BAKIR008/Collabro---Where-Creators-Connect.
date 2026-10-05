/**
 * DashboardPage Component
 * Main dashboard after onboarding completion
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useOnboarding } from '../hooks/useOnboarding.js';
import './DashboardPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();
  const { status, loading: onboardingLoading } = useOnboarding();
  const [profile, setProfile] = useState(null);

  /**
   * Check onboarding status and redirect if not completed
   */
  useEffect(() => {
    if (!authLoading && !onboardingLoading) {
      if (!user) {
        navigate('/login');
      } else if (status?.status !== 'completed') {
        navigate('/onboarding');
      }
    }
  }, [user, status, authLoading, onboardingLoading, navigate]);

  /**
   * Fetch creator profile
   */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/api/onboarding/responses`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data.profile);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    if (user && status?.status === 'completed') {
      fetchProfile();
    }
  }, [user, status]);

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (authLoading || onboardingLoading) {
    return (
      <div className="dashboard-loading">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="dashboard-title">CollaBro</h1>
            {user && (
              <p className="dashboard-subtitle">
                Welcome back, <strong>{user.username}</strong>!
              </p>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        </header>

        {/* Main Content */}
        <div className="dashboard-content">
          <div className="welcome-card">
            <div className="welcome-icon">🎉</div>
            <h2 className="welcome-title">You're All Set!</h2>
            <p className="welcome-text">
              Your CollaBro profile is complete. You can now start collaborating
              with other creators!
            </p>
          </div>

          {/* Profile Summary */}
          {profile && (
            <div className="profile-summary">
              <h3 className="section-title">Your Profile</h3>

              <div className="profile-grid">
                {/* Primary Role */}
                <div className="profile-card">
                  <div className="card-icon">👤</div>
                  <h4 className="card-title">Primary Role</h4>
                  <p className="card-value">{profile.primaryRole || 'N/A'}</p>
                </div>

                {/* Experience */}
                <div className="profile-card">
                  <div className="card-icon">⚡</div>
                  <h4 className="card-title">Experience</h4>
                  <p className="card-value capitalize">
                    {profile.experienceLevel || 'N/A'}
                  </p>
                </div>

                {/* Skills Count */}
                <div className="profile-card">
                  <div className="card-icon">🛠️</div>
                  <h4 className="card-title">Skills</h4>
                  <p className="card-value">
                    {profile.skills?.length || 0} skills
                  </p>
                </div>

                {/* Work Mode */}
                <div className="profile-card">
                  <div className="card-icon">🌍</div>
                  <h4 className="card-title">Work Mode</h4>
                  <p className="card-value capitalize">
                    {profile.collaborationPreferences?.workMode || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Coming Soon */}
          <div className="coming-soon-card">
            <h3 className="section-title">Coming Soon</h3>
            <ul className="coming-soon-list">
              <li>🔍 Discover creators to collaborate with</li>
              <li>💼 Browse and create collaboration projects</li>
              <li>💬 Direct messaging and communication</li>
              <li>📁 Portfolio showcase and project gallery</li>
              <li>⭐ Reviews and recommendations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
