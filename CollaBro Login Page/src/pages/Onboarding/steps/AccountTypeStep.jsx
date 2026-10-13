import React from 'react';
import { StepHeader } from '../components';
import './AccountTypeStep.css';

export const AccountTypeStep = ({ data, onChange }) => {
  const accountType = data.accountType || null;

  const handleSelectAccountType = (type) => {
    onChange({ accountType: type });
  };

  return (
    <div className="account-type-step">
      <div className="ob-welcome">
        {/* Left panel - Brand showcase */}
        <div className="ob-welcome-left">
          <div className="ob-welcome-brand">
            <div className="ob-welcome-wordmark">
              COLLA<span>BRO</span>
            </div>
            <div className="ob-welcome-tagline">
              WHERE CREATORS COLLABORATE
            </div>
          </div>

          <div className="ob-welcome-hero">
            <h1 className="ob-welcome-headline">
              Build Your <span className="hl-yellow">Creative</span><br />
              Network <span className="hl-cyan">&amp;</span> Grow<br />
              Your <span className="hl-magenta">Career</span>
            </h1>
            <p className="ob-welcome-desc">
              Join thousands of creators who are finding collaborators, 
              showcasing their work, and building successful creative careers.
            </p>
            <div className="ob-welcome-pills">
              <span className="ob-pill ob-pill-yellow">Real Projects</span>
              <span className="ob-pill ob-pill-cyan">Verified Creators</span>
              <span className="ob-pill ob-pill-magenta">Safe Payments</span>
            </div>
          </div>

          <div className="ob-welcome-stats">
            <div className="ob-stat">
              <div className="ob-stat-value">10K+</div>
              <div className="ob-stat-label">Active Creators</div>
            </div>
            <div className="ob-stat">
              <div className="ob-stat-value">5K+</div>
              <div className="ob-stat-label">Projects Completed</div>
            </div>
            <div className="ob-stat">
              <div className="ob-stat-value">$2M+</div>
              <div className="ob-stat-label">Earned by Creators</div>
            </div>
          </div>
        </div>

        {/* Right panel - Account type selection */}
        <div className="ob-welcome-right">
          <h2 className="ob-welcome-question">
            How will you use CollaBro?
          </h2>
          <p className="ob-welcome-sub">
            Choose the option that best describes your goals. You can always change this later.
          </p>

          <div className="ob-type-cards">
            {/* Freelancer Card */}
            <div
              className={`ob-type-card ${accountType === 'freelancer' ? 'selected' : ''}`}
              onClick={() => handleSelectAccountType('freelancer')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectAccountType('freelancer');
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Select Freelancer account type"
              aria-pressed={accountType === 'freelancer'}
            >
              <div className="ob-type-card-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="ob-type-card-body">
                <h3 className="ob-type-card-title">Freelancer</h3>
                <p className="ob-type-card-desc">
                  Showcase your work, collaborate with other creators, and get hired for exciting projects.
                </p>
                <div className="ob-type-card-tags">
                  <span className="ob-type-tag">Find Projects</span>
                  <span className="ob-type-tag">Build Portfolio</span>
                  <span className="ob-type-tag">Collaborate</span>
                </div>
              </div>
              <div className="ob-type-card-check">
                <div className="ob-type-card-check-inner"></div>
              </div>
            </div>

            {/* Client Card */}
            <div
              className={`ob-type-card ${accountType === 'client' ? 'selected' : ''}`}
              onClick={() => handleSelectAccountType('client')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectAccountType('client');
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Select Client account type"
              aria-pressed={accountType === 'client'}
            >
              <div className="ob-type-card-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </div>
              <div className="ob-type-card-body">
                <h3 className="ob-type-card-title">Client</h3>
                <p className="ob-type-card-desc">
                  Hire talented creators, build creative teams, and bring your projects to life.
                </p>
                <div className="ob-type-card-tags">
                  <span className="ob-type-tag">Hire Creators</span>
                  <span className="ob-type-tag">Build Teams</span>
                  <span className="ob-type-tag">Manage Projects</span>
                </div>
              </div>
              <div className="ob-type-card-check">
                <div className="ob-type-card-check-inner"></div>
              </div>
            </div>
          </div>

          <button
            className="ob-welcome-cta-btn"
            onClick={() => {
              if (accountType) {
                // Trigger parent's next handler
                const nextBtn = document.querySelector('[data-onboarding-next]');
                if (nextBtn) nextBtn.click();
              }
            }}
            disabled={!accountType}
            aria-label={accountType ? 'Continue to next step' : 'Please select an account type first'}
          >
            {accountType ? 'Continue' : 'Select an Option'}
          </button>
        </div>
      </div>
    </div>
  );
};
