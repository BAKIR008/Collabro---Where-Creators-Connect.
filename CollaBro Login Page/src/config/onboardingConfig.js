/**
 * Onboarding Survey Configuration
 * src/config/onboardingConfig.js
 *
 * Defines step sequences for both freelancer and client flows.
 */

// Step definitions per account type
const FREELANCER_STEPS = [
  { id: 'account-type', title: 'Account Type', order: 0, required: true },
  { id: 'about-you',    title: 'About You',    order: 1, required: true },
  { id: 'expertise',    title: 'Expertise',    order: 2, required: true },
  { id: 'goals-preferences', title: 'Goals',  order: 3, required: true },
  { id: 'review',       title: 'Review',       order: 4, required: true },
];

const CLIENT_STEPS = [
  { id: 'account-type', title: 'Account Type', order: 0, required: true },
  { id: 'about-you',    title: 'About You',    order: 1, required: true },
  { id: 'client-needs', title: 'Your Needs',   order: 2, required: true },
  { id: 'goals-preferences', title: 'Goals',   order: 3, required: true },
  { id: 'review',       title: 'Review',       order: 4, required: true },
];

/**
 * Get the full config object for a given account type.
 * Defaults to freelancer if accountType is not yet chosen.
 */
export const getConfig = (accountType) => {
  const steps = accountType === 'client' ? CLIENT_STEPS : FREELANCER_STEPS;
  return { steps: steps.sort((a, b) => a.order - b.order) };
};

/**
 * Get all step IDs in order for the given account type.
 */
export const getStepIds = (accountType) => {
  return getConfig(accountType).steps.map((s) => s.id);
};

/**
 * Get step index by ID (0-based)
 */
export const getStepIndex = (stepId, accountType) => {
  return getStepIds(accountType).indexOf(stepId);
};

/**
 * Get next step ID
 */
export const getNextStepId = (currentStepId, accountType) => {
  const ids = getStepIds(accountType);
  const idx = ids.indexOf(currentStepId);
  return idx < ids.length - 1 ? ids[idx + 1] : null;
};

/**
 * Get previous step ID
 */
export const getPreviousStepId = (currentStepId, accountType) => {
  const ids = getStepIds(accountType);
  const idx = ids.indexOf(currentStepId);
  return idx > 0 ? ids[idx - 1] : null;
};

/**
 * Calculate progress percentage (excludes account-type step from progress display)
 */
export const calculateProgress = (currentStepId, accountType) => {
  const ids = getStepIds(accountType).filter(id => id !== 'account-type');
  const idx = ids.indexOf(currentStepId);
  if (idx < 0) return 0;
  return ((idx + 1) / ids.length) * 100;
};
