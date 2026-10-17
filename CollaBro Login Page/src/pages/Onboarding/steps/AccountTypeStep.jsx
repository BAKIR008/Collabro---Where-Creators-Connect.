import React, { useState, useEffect } from 'react';
import { StepHeader } from '../components';

export const AccountTypeStep = ({ data, onChange }) => {
  const [accountType, setAccountType] = useState(data.accountType || null);

  useEffect(() => {
    // Only call onChange if it actually changed to avoid infinite loops, 
    // though the parent might handle it.
    if (data.accountType !== accountType) {
      onChange({ accountType });
    }
  }, [accountType, onChange, data.accountType]);

  return (
    <div className="account-type-step fade-in">
      <StepHeader
        icon="👋"
        title="Welcome to CollaBro"
        subtitle="How are you planning to use CollaBro?"
      />

      <div className="option-cards" style={{ marginTop: '2rem' }}>
        <div
          className={`option-card ${accountType === 'client' ? 'selected' : ''}`}
          onClick={() => setAccountType('client')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setAccountType('client');
            }
          }}
        >
          <div className="option-icon">🏢</div>
          <h3 className="option-label">Client</h3>
          <p className="option-description">Hire creators and build creative teams for my projects</p>
          <div className="option-checkbox">
            {accountType === 'client' ? '✓' : ''}
          </div>
        </div>

        <div
          className={`option-card ${accountType === 'freelancer' ? 'selected' : ''}`}
          onClick={() => setAccountType('freelancer')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setAccountType('freelancer');
            }
          }}
        >
          <div className="option-icon">🎨</div>
          <h3 className="option-label">Freelancer</h3>
          <p className="option-description">Showcase my work, collaborate, and get hired</p>
          <div className="option-checkbox">
            {accountType === 'freelancer' ? '✓' : ''}
          </div>
        </div>
      </div>
    </div>
  );
};
