/**
 * NavigationButtons Component
 * Navigation controls for the onboarding wizard
 */

import React from 'react';
import './NavigationButtons.css';

/* SVG arrow icons — no emojis, no unicode arrows */
const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

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
            aria-label="Go back to previous step"
          >
            <ArrowLeftIcon />
            Back
          </button>
        )}

        {showSaveDraft && (
          <button
            type="button"
            className="nav-btn save-draft-btn"
            onClick={onSaveDraft}
            disabled={isSaving}
            aria-label="Save progress as draft"
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
            data-onboarding-next="true"
            aria-label={isLastStep ? 'Complete profile and submit' : 'Continue to next step'}
          >
            {isLastStep ? (
              <>
                Complete Profile
                <CheckIcon />
              </>
            ) : (
              <>
                {nextLabel}
                <ArrowRightIcon />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
