/**
 * OnboardingLayout Component
 * Main layout wrapper for the onboarding wizard
 */

import React from 'react';
import './OnboardingLayout.css';

export const OnboardingLayout = ({ children }) => {
  return (
    <div className="onboarding-layout">
      <div className="onboarding-container">
        {children}
      </div>
    </div>
  );
};
