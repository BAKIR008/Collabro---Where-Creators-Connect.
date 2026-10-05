/**
 * NavigationButtons Component
 * Navigation controls for the onboarding wizard
 */

import React from 'react';
import './NavigationButtons.css';

export const NavigationButtons = ({
  onBack,
  onNext,
  onSaveDraft,
  showBack = true,
  showNext = true,
  showSaveDraft = true,
  nextLabel = 'Next',
  nextDisabled = false,
  isLastStep = false,
  isSaving = false,
}) => {
  return (
    <div className="navigation-buttons">
      {/* Left side - Back & Save Draft */}
      <div className="nav-left">
        {showBack && (
          <button
            type="button"
            className="nav-btn back-btn"
            onClick={onBack}
            disabled={isSaving}
          >
            ← Back
          </button>
        )}

        {showSaveDraft && (
          <button
            type="button"
            className="nav-btn save-draft-btn"
            onClick={onSaveDraft}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
        )}
      </div>

      {/* Right side - Next/Complete */}
      <div className="nav-right">
        {showNext && (
          <button
            type="button"
            className={`nav-btn next-btn ${isLastStep ? 'complete-btn' : ''}`}
            onClick={onNext}
            disabled={nextDisabled || isSaving}
          >
            {isLastStep ? 'Complete Onboarding ✓' : `${nextLabel} →`}
          </button>
        )}
      </div>
    </div>
  );
};
