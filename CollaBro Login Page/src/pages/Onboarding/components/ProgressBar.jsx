/**
 * ProgressBar Component
 * Visual progress indicator for onboarding steps — no emojis
 */

import React from 'react';
import './ProgressBar.css';

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const ProgressBar = ({ currentStep, totalSteps, stepLabels = [] }) => {
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  return (
    <div className="progress-bar-wrapper" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={totalSteps}>
      {/* Step indicators */}
      <div className="progress-steps">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          return (
            <div
              key={index}
              className={`progress-step ${isCompleted ? 'completed' : isActive ? 'active' : 'upcoming'}`}
            >
              <div className="step-circle" aria-label={isCompleted ? 'Completed' : isActive ? 'Current step' : 'Upcoming step'}>
                {isCompleted ? <CheckIcon /> : index + 1}
              </div>
              {stepLabels[index] && (
                <span className="step-label">{stepLabels[index]}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Progress text */}
      <div className="progress-text">Step {currentStep + 1} of {totalSteps}</div>
    </div>
  );
};
