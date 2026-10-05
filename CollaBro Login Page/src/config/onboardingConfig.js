/**
 * Onboarding Survey Configuration
 * Configuration-driven system for multi-step onboarding wizard
 */

export const ONBOARDING_CONFIG = {
  version: 1,
  steps: [
    // ─── Step 1: Creator Identity ───
    {
      id: 'creator-identity',
      title: 'Who Are You?',
      subtitle: 'Select the roles that define your creative identity',
      order: 1,
      required: true,
      fields: [
        {
          name: 'roles',
          type: 'role-selector',
          label: 'Your Creator Roles',
          helpText: 'Select 1-5 roles. Choose one as your primary role.',
          validation: {
            required: true,
            min: 1,
            max: 5,
            errorMessage: 'Please select at least one role (max 5)',
          },
        },
        {
          name: 'primaryRole',
          type: 'hidden',
          validation: {
            required: true,
            errorMessage: 'Please select a primary role',
          },
        },
        {
          name: 'customRole',
          type: 'text',
          label: 'If you selected "Other", specify your role',
          placeholder: 'e.g., Podcast Producer, 3D Artist',
          showWhen: { field: 'roles', includes: 'other' },
          validation: {
            required: false,
            maxLength: 50,
          },
        },
      ],
    },

    // ─── Step 2: Skills & Experience ───
    {
      id: 'skills-experience',
      title: 'Your Expertise',
      subtitle: 'Tell us about your skills and experience',
      order: 2,
      required: true,
      fields: [
        {
          name: 'experienceLevel',
          type: 'radio-cards',
          label: 'Experience Level',
          helpText: 'How long have you been creating content?',
          options: [
            { value: 'beginner', label: 'Beginner', description: 'Just starting out (0-1 year)', icon: '🌱' },
            { value: 'intermediate', label: 'Intermediate', description: 'Building my portfolio (1-3 years)', icon: '🌿' },
            { value: 'advanced', label: 'Advanced', description: 'Established creator (3-5 years)', icon: '🌳' },
            { value: 'expert', label: 'Expert', description: 'Industry professional (5+ years)', icon: '🏆' },
          ],
          validation: {
            required: true,
            errorMessage: 'Please select your experience level',
          },
        },
        {
          name: 'skills',
          type: 'tag-input',
          label: 'Core Skills',
          placeholder: 'e.g., Adobe Premiere, Final Cut Pro, DaVinci Resolve',
          helpText: 'Add the tools and skills you excel at (press Enter after each)',
          validation: {
            required: true,
            min: 1,
            max: 15,
            errorMessage: 'Add at least one skill (max 15)',
          },
        },
        {
          name: 'tools',
          type: 'tag-input',
          label: 'Tools & Software',
          placeholder: 'e.g., Figma, After Effects, Photoshop',
          helpText: 'List the software and tools you use regularly',
          validation: {
            required: false,
            max: 15,
          },
        },
      ],
    },

    // ─── Step 3: Goals ───
    {
      id: 'goals',
      title: 'Your Goals',
      subtitle: 'What are you looking to achieve on CollaBro?',
      order: 3,
      required: true,
      fields: [
        {
          name: 'goals',
          type: 'checkbox-cards',
          label: 'Select Your Goals',
          helpText: 'Choose all that apply',
          options: [
            {
              value: 'find-collaborators',
              label: 'Find Collaborators',
              description: 'Connect with other creators for projects',
              icon: '🤝',
            },
            {
              value: 'build-portfolio',
              label: 'Build Portfolio',
              description: 'Showcase my work and grow my presence',
              icon: '📁',
            },
            {
              value: 'learn-skills',
              label: 'Learn New Skills',
              description: 'Expand my creative abilities',
              icon: '📚',
            },
            {
              value: 'earn-income',
              label: 'Earn Income',
              description: 'Monetize my creative work',
              icon: '💰',
            },
            {
              value: 'network',
              label: 'Network',
              description: 'Connect with like-minded creators',
              icon: '🌐',
            },
            {
              value: 'get-discovered',
              label: 'Get Discovered',
              description: 'Increase visibility and opportunities',
              icon: '⭐',
            },
          ],
          validation: {
            required: true,
            min: 1,
            errorMessage: 'Please select at least one goal',
          },
        },
      ],
    },

    // ─── Step 4: Collaboration Preferences ───
    {
      id: 'collaboration',
      title: 'Collaboration Style',
      subtitle: 'How do you like to work with others?',
      order: 4,
      required: true,
      fields: [
        {
          name: 'collaborationPreferences.creatorRoles',
          type: 'multi-select',
          label: 'Roles You Want to Collaborate With',
          helpText: 'Select the types of creators you want to work with',
          options: 'CREATOR_ROLES', // Reference to CREATOR_ROLES from creatorRoles.js
          validation: {
            required: true,
            min: 1,
            errorMessage: 'Select at least one role',
          },
        },
        {
          name: 'collaborationPreferences.projectTypes',
          type: 'checkbox-cards',
          label: 'Project Types',
          helpText: 'What kinds of projects interest you?',
          options: [
            { value: 'short-form-video', label: 'Short-Form Video', icon: '📱' },
            { value: 'long-form-video', label: 'Long-Form Video', icon: '🎬' },
            { value: 'social-media-content', label: 'Social Media Content', icon: '📲' },
            { value: 'brand-collaborations', label: 'Brand Collaborations', icon: '🏢' },
            { value: 'personal-projects', label: 'Personal Projects', icon: '💡' },
            { value: 'commercial-work', label: 'Commercial Work', icon: '💼' },
            { value: 'educational-content', label: 'Educational Content', icon: '🎓' },
            { value: 'creative-experiments', label: 'Creative Experiments', icon: '🔬' },
          ],
          validation: {
            required: true,
            min: 1,
            errorMessage: 'Select at least one project type',
          },
        },
        {
          name: 'collaborationPreferences.duration',
          type: 'radio-cards',
          label: 'Preferred Project Duration',
          options: [
            { value: 'one-time', label: 'One-Time', description: 'Single projects', icon: '⚡' },
            { value: 'short-term', label: 'Short-Term', description: '1-3 months', icon: '📅' },
            { value: 'long-term', label: 'Long-Term', description: '3+ months', icon: '📆' },
            { value: 'ongoing', label: 'Ongoing', description: 'Continuous collaboration', icon: '🔄' },
          ],
          validation: {
            required: true,
            errorMessage: 'Please select a preferred duration',
          },
        },
        {
          name: 'collaborationPreferences.workMode',
          type: 'radio-cards',
          label: 'Work Mode',
          options: [
            { value: 'remote', label: 'Remote', description: 'Work from anywhere', icon: '🌍' },
            { value: 'in-person', label: 'In-Person', description: 'Local collaborations', icon: '🏙️' },
            { value: 'hybrid', label: 'Hybrid', description: 'Flexible approach', icon: '🔀' },
          ],
          validation: {
            required: true,
            errorMessage: 'Please select a work mode',
          },
        },
      ],
    },

    // ─── Step 5: Work Preferences ───
    {
      id: 'work-preferences',
      title: 'Work Preferences',
      subtitle: 'Tell us more about your creative preferences',
      order: 5,
      required: false,
      fields: [
        {
          name: 'workPreferences.categories',
          type: 'tag-input',
          label: 'Content Categories',
          placeholder: 'e.g., Gaming, Tech, Lifestyle, Education',
          helpText: 'What topics and niches do you create content about?',
          validation: {
            required: false,
            max: 10,
          },
        },
        {
          name: 'workPreferences.industries',
          type: 'tag-input',
          label: 'Industries',
          placeholder: 'e.g., Entertainment, Fashion, Finance, Health',
          helpText: 'Which industries do you have experience in?',
          validation: {
            required: false,
            max: 10,
          },
        },
        {
          name: 'workPreferences.style',
          type: 'tag-input',
          label: 'Creative Style',
          placeholder: 'e.g., Minimalist, Cinematic, Bold, Playful',
          helpText: 'How would you describe your creative style?',
          validation: {
            required: false,
            max: 8,
          },
        },
      ],
    },

    // ─── Step 6: Review ───
    {
      id: 'review',
      title: 'Review & Confirm',
      subtitle: 'Take a moment to review your responses',
      order: 6,
      required: true,
      fields: [], // No input fields - this is a review step
    },
  ],
};

/**
 * Get step by ID
 */
export const getStepById = (stepId) => {
  return ONBOARDING_CONFIG.steps.find((step) => step.id === stepId);
};

/**
 * Get all step IDs in order
 */
export const getStepIds = () => {
  return ONBOARDING_CONFIG.steps
    .sort((a, b) => a.order - b.order)
    .map((step) => step.id);
};

/**
 * Get step index by ID (0-based)
 */
export const getStepIndex = (stepId) => {
  const orderedSteps = getStepIds();
  return orderedSteps.indexOf(stepId);
};

/**
 * Get next step ID
 */
export const getNextStepId = (currentStepId) => {
  const orderedSteps = getStepIds();
  const currentIndex = orderedSteps.indexOf(currentStepId);
  return currentIndex < orderedSteps.length - 1
    ? orderedSteps[currentIndex + 1]
    : null;
};

/**
 * Get previous step ID
 */
export const getPreviousStepId = (currentStepId) => {
  const orderedSteps = getStepIds();
  const currentIndex = orderedSteps.indexOf(currentStepId);
  return currentIndex > 0 ? orderedSteps[currentIndex - 1] : null;
};

/**
 * Calculate progress percentage
 */
export const calculateProgress = (currentStepId) => {
  const orderedSteps = getStepIds();
  const currentIndex = orderedSteps.indexOf(currentStepId);
  return ((currentIndex + 1) / orderedSteps.length) * 100;
};
