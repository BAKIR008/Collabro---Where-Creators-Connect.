/**
 * ProgressBar Component
 * Visual progress indicator for onboarding steps
 */

import React from 'react';
import './ProgressBar.css';

export const ProgressBar = ({ currentStep, totalSteps, stepLabels = [] }) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="progress-bar-wrapper">
      {/* Step indicators */}
      <div className="progress-steps">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`progress-step ${
              index < currentStep
                ? 'completed'
                : index === currentStep
                ? 'active'
                : 'upcoming'
            }`}
          >
            <div className="step-circle">
              {index < currentStep ? '✓' : index + 1}
            </div>
            {stepLabels[index] && (
              <span className="step-label">{stepLabels[index]}</span>
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress text */}
      <div className="progress-text">
        Step {currentStep + 1} of {totalSteps}
      </div>
    </div>
  );
};
