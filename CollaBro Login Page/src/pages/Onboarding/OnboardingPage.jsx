/**
 * OnboardingPage Component
 * Main onboarding wizard orchestrator
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../hooks/useOnboarding.js';
import {
  ONBOARDING_CONFIG,
  getStepIds,
  getStepIndex,
  getNextStepId,
  getPreviousStepId,
  calculateProgress,
} from '../../config/onboardingConfig.js';
import {
  OnboardingLayout,
  ProgressBar,
  NavigationButtons,
} from './components';
import {
  CreatorIdentityStep,
  SkillsExperienceStep,
  GoalsStep,
  CollaborationStep,
  WorkPreferencesStep,
  ReviewStep,
} from './steps';
import './OnboardingPage.css';

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

  const stepIds = getStepIds();
  const [currentStepId, setCurrentStepId] = useState(stepIds[0]);
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  const currentStepIndex = getStepIndex(currentStepId);
  const currentStep = ONBOARDING_CONFIG.steps.find(
    (s) => s.id === currentStepId
  );
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
    }
  }, [responses]);

  /**
   * Handle step data change.
   *
   * Steps emit partial updates like { collaborationPreferences: { workMode: 'hybrid' } }.
   * A simple shallow spread would REPLACE the entire collaborationPreferences object,
   * wiping any keys (creatorRoles, projectTypes, duration) set by earlier sub-fields
   * in the same step. We deep-merge one level down so nested updates are additive.
   */
  const handleStepChange = useCallback((stepData) => {
    setFormData((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(stepData)) {
        const incoming = stepData[key];
        const existing = prev[key];
        // Deep-merge one level for plain objects (not arrays, not null)
        if (
          incoming !== null &&
          typeof incoming === 'object' &&
          !Array.isArray(incoming) &&
          existing !== null &&
          typeof existing === 'object' &&
          !Array.isArray(existing)
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

    // Validate based on step
    switch (currentStepId) {
      case 'creator-identity':
        if (!formData.roles || formData.roles.length === 0) {
          errors.roles = 'Please select at least one role';
        }
        if (!formData.primaryRole) {
          errors.primaryRole = 'Please select a primary role';
        }
        if (formData.roles?.includes('other') && !formData.customRole?.trim()) {
          errors.customRole = 'Please specify your custom role';
        }
        break;

      case 'skills-experience':
        if (!formData.experienceLevel) {
          errors.experienceLevel = 'Please select your experience level';
        }
        if (!formData.skills || formData.skills.length === 0) {
          errors.skills = 'Please add at least one skill';
        }
        break;

      case 'goals':
        if (!formData.goals || formData.goals.length === 0) {
          errors.goals = 'Please select at least one goal';
        }
        break;

      case 'collaboration':
        if (
          !formData.collaborationPreferences?.creatorRoles ||
          formData.collaborationPreferences.creatorRoles.length === 0
        ) {
          errors.creatorRoles =
            'Please select at least one role to collaborate with';
        }
        if (
          !formData.collaborationPreferences?.projectTypes ||
          formData.collaborationPreferences.projectTypes.length === 0
        ) {
          errors.projectTypes = 'Please select at least one project type';
        }
        if (!formData.collaborationPreferences?.duration) {
          errors.duration = 'Please select a preferred duration';
        }
        if (!formData.collaborationPreferences?.workMode) {
          errors.workMode = 'Please select a work mode';
        }
        break;

      case 'work-preferences':
        // This step is optional - no validation errors
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
    // Validate before proceeding
    if (!validateCurrentStep()) {
      return;
    }

    // Save draft before moving to next step
    await saveDraft(formData);

    const nextId = getNextStepId(currentStepId);
    if (nextId) {
      setCurrentStepId(nextId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * Handle back step
   */
  const handleBack = () => {
    const prevId = getPreviousStepId(currentStepId);
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
      // Show success feedback (could use toast notification)
      alert('Draft saved successfully!');
    } else {
      alert(`Failed to save draft: ${result.message}`);
    }
  };

  /**
   * Handle complete onboarding
   */
  const handleComplete = async () => {
    // Final validation
    if (!validateCurrentStep()) {
      return;
    }

    const result = await completeOnboarding(formData);
    if (result.success) {
      // Navigate to dashboard
      navigate('/dashboard');
    } else {
      alert(`Failed to complete onboarding: ${result.message}`);
    }
  };

  /**
   * Render current step component
   */
  const renderStep = () => {
    switch (currentStepId) {
      case 'creator-identity':
        return (
          <CreatorIdentityStep data={formData} onChange={handleStepChange} />
        );

      case 'skills-experience':
        return (
          <SkillsExperienceStep data={formData} onChange={handleStepChange} />
        );

      case 'goals':
        return <GoalsStep data={formData} onChange={handleStepChange} />;

      case 'collaboration':
        return (
          <CollaborationStep data={formData} onChange={handleStepChange} />
        );

      case 'work-preferences':
        return (
          <WorkPreferencesStep data={formData} onChange={handleStepChange} />
        );

      case 'review':
        return <ReviewStep data={formData} />;

      default:
        return <div>Unknown step</div>;
    }
  };

  if (loading) {
    return (
      <OnboardingLayout>
        <div className="onboarding-loading">
          <p>Loading...</p>
        </div>
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout>
      <div className="onboarding-page">
        {/* Progress Bar */}
        <ProgressBar
          currentStep={currentStepIndex}
          totalSteps={stepIds.length}
          stepLabels={ONBOARDING_CONFIG.steps.map((s) => s.title)}
        />

        {/* Current Step */}
        <div className="step-content">{renderStep()}</div>

        {/* Validation Errors */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="validation-errors">
            {Object.values(validationErrors).map((error, index) => (
              <p key={index} className="error-message">
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
          nextLabel={isLastStep ? 'Complete' : 'Next'}
          nextDisabled={false}
          isLastStep={isLastStep}
          isSaving={saving}
        />
      </div>
    </OnboardingLayout>
  );
};
