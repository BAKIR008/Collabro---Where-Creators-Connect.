/**
 * StepHeader Component
 * Header for each onboarding step
 * Renders: eyebrow label (e.g. "Step 2") → title → subtitle
 */

import React from 'react';
import './StepHeader.css';

export const StepHeader = ({ title, subtitle, eyebrow }) => {
  return (
    <div className="step-header">
      {eyebrow && <div className="step-eyebrow">{eyebrow}</div>}
      <h1 className="step-title">{title}</h1>
      {subtitle && <p className="step-subtitle">{subtitle}</p>}
    </div>
  );
};
