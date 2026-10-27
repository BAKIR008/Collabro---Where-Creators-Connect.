/**
 * Onboarding Survey Configuration
 * Configuration-driven system for multi-step onboarding wizard
 */

/**
 * Onboarding Survey Configuration
 * Configuration-driven system for multi-step onboarding wizard
 */

export const ONBOARDING_CONFIG = {
  version: 2,
  steps: [
    // Pre-step
    {
      id: 'account-type',
      title: 'How will you use CollaBro?',
      subtitle: 'Select your account type to get started',
      order: 0,
      required: true,
      fields: [],
    },
    // Step 1
    {
      id: 'about-you',
      title: 'About You',
      subtitle: 'Tell us a bit about yourself',
      order: 1,
      required: true,
      fields: [],
    },
    // Step 2
    {
      id: 'expertise',
      title: 'Your Expertise',
      subtitle: 'Tell us about your skills and experience',
      order: 2,
      required: true,
      fields: [],
    },
    // Step 3
    {
      id: 'goals-preferences',
      title: 'Goals & Preferences',
      subtitle: 'How do you like to work?',
      order: 3,
      required: true,
      fields: [],
    },
    // Step 4
    {
      id: 'review',
      title: 'Review & Confirm',
      subtitle: 'Take a moment to review your responses',
      order: 4,
      required: true,
      fields: [],
    },
  ],
};

export const CLIENT_ONBOARDING_CONFIG = {
  version: 2,
  steps: [
    // Pre-step
    {
      id: 'account-type',
      title: 'How will you use CollaBro?',
      subtitle: 'Select your account type to get started',
      order: 0,
      required: true,
      fields: [],
    },
    // Step 1
    {
      id: 'about-you',
      title: 'About You',
      subtitle: 'Tell us a bit about yourself',
      order: 1,
      required: true,
      fields: [],
    },
    // Step 2
    {
      id: 'client-needs',
      title: 'Your Needs',
      subtitle: 'What are you looking for?',
      order: 2,
      required: true,
      fields: [],
    },
    // Step 3
    {
      id: 'goals-preferences',
      title: 'Goals & Preferences',
      subtitle: 'How do you like to work?',
      order: 3,
      required: true,
      fields: [],
    },
    // Step 4
    {
      id: 'review',
      title: 'Review & Confirm',
      subtitle: 'Take a moment to review your responses',
      order: 4,
      required: true,
      fields: [],
    }
  ]
};

/**
 * Get the appropriate config based on accountType
 */
export const getConfig = (accountType) => {
  return accountType === 'client' ? CLIENT_ONBOARDING_CONFIG : ONBOARDING_CONFIG;
};

/**
 * Get step by ID
 */
export const getStepById = (stepId, accountType) => {
  const config = getConfig(accountType);
  return config.steps.find((step) => step.id === stepId);
};

/**
 * Get all step IDs in order
 */
export const getStepIds = (accountType) => {
  const config = getConfig(accountType);
  return config.steps
    .sort((a, b) => a.order - b.order)
    .map((step) => step.id);
};

/**
 * Get step index by ID (0-based)
 */
export const getStepIndex = (stepId, accountType) => {
  const orderedSteps = getStepIds(accountType);
  return orderedSteps.indexOf(stepId);
};

/**
 * Get next step ID
 */
export const getNextStepId = (currentStepId, accountType) => {
  const orderedSteps = getStepIds(accountType);
  const currentIndex = orderedSteps.indexOf(currentStepId);
  return currentIndex !== -1 && currentIndex < orderedSteps.length - 1
    ? orderedSteps[currentIndex + 1]
    : null;
};

/**
 * Get previous step ID
 */
export const getPreviousStepId = (currentStepId, accountType) => {
  const orderedSteps = getStepIds(accountType);
  const currentIndex = orderedSteps.indexOf(currentStepId);
  return currentIndex > 0 ? orderedSteps[currentIndex - 1] : null;
};

