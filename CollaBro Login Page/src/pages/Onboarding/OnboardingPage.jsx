/**
 * OnboardingPage Component
 * Main onboarding wizard orchestrator
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../hooks/useOnboarding.js';
import {
  getConfig,
  getStepIds,
  getStepIndex,
  getNextStepId,
  getPreviousStepId,
} from '../../config/onboardingConfig.js';
import {
  OnboardingLayout,
  ProgressBar,
  NavigationButtons,
} from './components';
import {
  AccountTypeStep,
  AboutYouStep,
  ExpertiseStep,
  ClientNeedsStep,
  GoalsPreferencesStep,
  ReviewStep,
} from './steps';
import './OnboardingPage.css';
import CustomCursor from '../../components/CustomCursor.jsx';

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const {
    responses,
    loading,
    saving,
    saveDraft,
    completeOnboarding,
    isCompleted,
  } = useOnboarding();

  const [formData, setFormData] = useState({});
  const accountType = formData.accountType || 'freelancer'; // Default for config
  const stepIds = getStepIds(accountType);
  
  // Try to recover current step from DB or start at first step
  const [currentStepId, setCurrentStepId] = useState('account-type');
  const [validationErrors, setValidationErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  const currentStepIndex = getStepIndex(currentStepId, accountType);
  const currentConfig = getConfig(accountType);
  const currentStep = currentConfig.steps.find(
    (s) => s.id === currentStepId
  );
  
  // If currentStepId is invalid for this accountType, reset to first step
  useEffect(() => {
    if (!currentStep && !loading) {
      setCurrentStepId(stepIds[0]);
    }
  }, [currentStep, loading, stepIds]);

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === stepIds.length - 1;

  /**
   * Redirect if already completed
   */
  useEffect(() => {
    if (isCompleted) {
      navigate('/dashboard');
    }
  }, [isCompleted, navigate]);

  /**
   * Load saved responses into form data
   */
  useEffect(() => {
    if (responses && Object.keys(responses).length > 0) {
      setFormData(responses);
      // Can restore step from responses if needed, leaving as is
    }
  }, [responses]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  /**
   * Handle step data change.
   */
  const handleStepChange = useCallback((stepData) => {
    setFormData((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(stepData)) {
        const incoming = stepData[key];
        const existing = prev[key];
        if (
          incoming !== null &&
          typeof incoming === 'object' &&
          !Array.isArray(incoming) &&
          existing !== null &&
          typeof existing === 'object' &&
          !Array.isArray(existing) &&
          !(incoming instanceof File) && // prevent deep merging file objects
          !(existing instanceof File)
        ) {
          next[key] = { ...existing, ...incoming };
        } else {
          next[key] = incoming;
        }
      }
      return next;
    });
  }, []);

  /**
   * Validate current step
   */
  const validateCurrentStep = () => {
    const errors = {};

    switch (currentStepId) {
      case 'account-type':
        if (!formData.accountType) {
          errors.accountType = 'Please select an account type';
        }
        break;

      case 'about-you':
        if (!formData.displayName?.trim()) {
          errors.displayName = 'Display name is required';
        }
        break;

      case 'client-needs':
        if (!formData.clientNeeds || formData.clientNeeds.length === 0) {
          errors.clientNeeds = 'Please select at least one need';
        }
        if (!formData.collaborationPreferences?.creatorRoles || formData.collaborationPreferences.creatorRoles.length === 0) {
          errors.creatorRoles = 'Please select at least one creator role';
        }
        break;

      case 'expertise':
        if (!formData.roles || formData.roles.length === 0) {
          errors.roles = 'Please select at least one role';
        }
        if (!formData.primaryRole) {
          errors.primaryRole = 'Please select a primary role';
        }
        if (!formData.experienceLevel) {
          errors.experienceLevel = 'Please select your experience level';
        }
        if (!formData.skills || formData.skills.length === 0) {
          errors.skills = 'Please add at least one skill';
        }
        break;

      case 'goals-preferences':
        if (accountType === 'freelancer') {
          if (!formData.goals || formData.goals.length === 0) {
            errors.goals = 'Please select at least one goal';
          }
          if (!formData.workMode) {
            errors.workMode = 'Please select a work mode';
          }
          if (!formData.workStyle) {
            errors.workStyle = 'Please select a work style';
          }
        } else {
          if (!formData.collaborationPreferences?.projectTypes || formData.collaborationPreferences.projectTypes.length === 0) {
            errors.projectTypes = 'Please select at least one project type';
          }
          if (!formData.collaborationPreferences?.duration) {
            errors.duration = 'Please select an expected duration';
          }
        }
        break;

      case 'review':
        // Final review - no new validation
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle next step
   */
  const handleNext = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    await saveDraft(formData);

    const nextId = getNextStepId(currentStepId, accountType);
    if (nextId) {
      setCurrentStepId(nextId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * Handle back step
   */
  const handleBack = () => {
    const prevId = getPreviousStepId(currentStepId, accountType);
    if (prevId) {
      setCurrentStepId(prevId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * Handle save draft
   */
  const handleSaveDraft = async () => {
    const result = await saveDraft(formData);
    if (result.success) {
      showToast('Draft saved successfully!');
    } else {
      showToast(`Failed to save draft: ${result.message}`);
    }
  };

  /**
   * Handle complete onboarding
   */
  const handleComplete = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    const result = await completeOnboarding(formData);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setValidationErrors({ server: result.message || 'Failed to complete onboarding' });
    }
  };

  /**
   * Render current step component
   */
  const renderStep = () => {
    switch (currentStepId) {
      case 'account-type':
        return <AccountTypeStep data={formData} onChange={handleStepChange} />;

      case 'about-you':
        return <AboutYouStep data={formData} onChange={handleStepChange} />;

      case 'client-needs':
        return <ClientNeedsStep data={formData} onChange={handleStepChange} />;

      case 'expertise':
        return <ExpertiseStep data={formData} onChange={handleStepChange} />;

      case 'goals-preferences':
        return <GoalsPreferencesStep data={formData} onChange={handleStepChange} />;

      case 'review':
        return <ReviewStep data={formData} onNavigateToStep={setCurrentStepId} />;

      default:
        return <div>Unknown step</div>;
    }
  };

  if (loading) {
    return (
      <>
        <CustomCursor />
        <OnboardingLayout>
          <div className="onboarding-loading">
            <p>Loading...</p>
          </div>
        </OnboardingLayout>
      </>
    );
  }

  return (
    <>
      <CustomCursor />
      <OnboardingLayout>
      <div className="onboarding-page">
        {toastMessage && (
          <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#a855f7', color: 'white', padding: '1rem', borderRadius: '8px', zIndex: 1000 }}>
            {toastMessage}
          </div>
        )}
        
        {/* Progress Bar (hide on account-type step) */}
        {currentStepId !== 'account-type' && (
          <ProgressBar
            currentStep={currentStepIndex - 1} // since account-type is index 0
            totalSteps={stepIds.length - 1}
            stepLabels={currentConfig.steps.slice(1).map((s) => s.title)}
          />
        )}

        {/* Current Step */}
        <div className="step-content">{renderStep()}</div>

        {/* Validation Errors */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="validation-errors" style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255, 68, 68, 0.1)', borderLeft: '4px solid #ff4444' }}>
            {Object.values(validationErrors).map((error, index) => (
              <p key={index} className="error-message" style={{ color: '#ff4444', margin: '0.25rem 0' }}>
                ⚠️ {error}
              </p>
            ))}
          </div>
        )}

        {/* Navigation */}
        <NavigationButtons
          onBack={handleBack}
          onNext={isLastStep ? handleComplete : handleNext}
          onSaveDraft={handleSaveDraft}
          showBack={!isFirstStep}
          showNext={true}
          showSaveDraft={!isLastStep}
          nextLabel={isLastStep ? 'Complete Profile' : 'Continue'}
          nextDisabled={false}
          isLastStep={isLastStep}
          isSaving={saving}
        />
      </div>
    </OnboardingLayout>
    </>
  );
};
