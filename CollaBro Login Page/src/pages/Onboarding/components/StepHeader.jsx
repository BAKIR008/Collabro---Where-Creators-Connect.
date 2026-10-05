/**
 * StepHeader Component
 * Header for each onboarding step
 */

import React from 'react';
import './StepHeader.css';

export const StepHeader = ({ title, subtitle, icon }) => {
  return (
    <div className="step-header">
      {icon && <div className="step-icon">{icon}</div>}
      <h1 className="step-title">{title}</h1>
      {subtitle && <p className="step-subtitle">{subtitle}</p>}
    </div>
  );
};
