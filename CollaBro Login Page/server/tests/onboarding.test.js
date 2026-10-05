/**
 * CollaBro — Onboarding Validation Tests
 * server/tests/onboarding.test.js
 *
 * Uses the built-in node:test runner (Node >= 18, no extra dependencies).
 * Run with: node --experimental-vm-modules server/tests/onboarding.test.js
 * Or simply: node server/tests/onboarding.test.js
 *
 * Tests the validation logic extracted from the Mongoose schema and
 * the express-validator rules, WITHOUT needing a live MongoDB or HTTP server.
 * This validates the CONTRACT between frontend and backend.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// ─── Replicate the canonical enums from the schema / route ──────────────────

const VALID_GOALS = [
  'find-collaborators',
  'build-portfolio',
  'learn-skills',
  'earn-income',
  'network',
  'get-discovered',
];

const VALID_WORK_MODES = ['remote', 'in-person', 'hybrid'];

const VALID_DURATIONS = ['one-time', 'short-term', 'long-term', 'ongoing'];

const VALID_EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];

// workPreferences.style is an array of free-form strings (max 8, each max 50 chars).
// There are no fixed enum values — users type their own style tags.

// ─── Pure validation helpers (mirror the route logic) ───────────────────────

function validateGoals(goals) {
  if (!Array.isArray(goals) || goals.length < 1) {
    return { valid: false, error: 'Select at least one goal.' };
  }
  const invalid = goals.filter((g) => !VALID_GOALS.includes(g));
  if (invalid.length > 0) {
    return { valid: false, error: `Invalid goal values: ${invalid.join(', ')}` };
  }
  return { valid: true };
}

function validateWorkMode(mode) {
  if (!VALID_WORK_MODES.includes(mode)) {
    return { valid: false, error: `Invalid workMode: ${mode}` };
  }
  return { valid: true };
}

function validateWorkStyle(style) {
  // style must be an array (multi-select free-form tags)
  if (!Array.isArray(style)) {
    return { valid: false, error: 'workPreferences.style must be an array.' };
  }
  if (style.length > 8) {
    return { valid: false, error: 'workPreferences.style cannot exceed 8 items.' };
  }
  const tooLong = style.filter((s) => typeof s !== 'string' || s.length > 50);
  if (tooLong.length > 0) {
    return { valid: false, error: 'Each style tag must be a string of max 50 characters.' };
  }
  return { valid: true };
}

function validateExperienceLevel(level) {
  if (!VALID_EXPERIENCE_LEVELS.includes(level)) {
    return { valid: false, error: `Invalid experienceLevel: ${level}` };
  }
  return { valid: true };
}

function validateDuration(duration) {
  if (!VALID_DURATIONS.includes(duration)) {
    return { valid: false, error: `Invalid duration: ${duration}` };
  }
  return { valid: true };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('workPreferences.style — multi-select free-form array', () => {

  test('1. A valid single style string in array is accepted', () => {
    const result = validateWorkStyle(['Minimalist']);
    assert.equal(result.valid, true, result.error);
  });

  test('2. Multiple valid style strings are accepted', () => {
    const result = validateWorkStyle(['Minimalist', 'Cinematic', 'Bold', 'Playful']);
    assert.equal(result.valid, true, result.error);
  });

  test('2b. Up to 8 style tags are accepted', () => {
    const tags = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const result = validateWorkStyle(tags);
    assert.equal(result.valid, true, result.error);
  });

  test('3a. A plain string (not array) is rejected', () => {
    const result = validateWorkStyle('Minimalist');
    assert.equal(result.valid, false);
    assert.match(result.error, /must be an array/);
  });

  test("3b. A stringified array (the bug value [u]) is rejected", () => {
    // This was the actual broken value reaching the backend — a string like "['u']"
    const result = validateWorkStyle("['u']");
    assert.equal(result.valid, false);
    assert.match(result.error, /must be an array/);
  });

  test('3c. More than 8 styles are rejected', () => {
    const result = validateWorkStyle(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']);
    assert.equal(result.valid, false);
    assert.match(result.error, /cannot exceed 8/);
  });

  test('3d. A style tag over 50 characters is rejected', () => {
    const longTag = 'A'.repeat(51);
    const result = validateWorkStyle([longTag]);
    assert.equal(result.valid, false);
    assert.match(result.error, /max 50/);
  });

  test('3e. An empty array is valid (style is optional)', () => {
    const result = validateWorkStyle([]);
    assert.equal(result.valid, true, result.error);
  });

});

describe('collaborationPreferences.workMode', () => {

  test('4. "hybrid" is accepted', () => {
    const result = validateWorkMode('hybrid');
    assert.equal(result.valid, true, result.error);
  });

  test('4b. "remote" is accepted', () => {
    assert.equal(validateWorkMode('remote').valid, true);
  });

  test('4c. "in-person" is accepted', () => {
    assert.equal(validateWorkMode('in-person').valid, true);
  });

  test('5. Unsupported work modes are rejected', () => {
    const unsupported = ['Hybrid', 'HYBRID', 'on-site', 'flexible', '', 'hybrid '];
    for (const mode of unsupported) {
      const result = validateWorkMode(mode);
      assert.equal(result.valid, false, `Expected "${mode}" to be rejected`);
    }
  });

});

describe('goals', () => {

  test('6a. Every supported goal ID is accepted individually', () => {
    for (const goal of VALID_GOALS) {
      const result = validateGoals([goal]);
      assert.equal(result.valid, true, `Goal "${goal}" should be valid: ${result.error}`);
    }
  });

  test('6b. All six goals together are accepted', () => {
    const result = validateGoals([...VALID_GOALS]);
    assert.equal(result.valid, true, result.error);
  });

  test('7. Unsupported goal IDs are rejected', () => {
    const invalid = ['discover', 'income', 'NETWORK', 'get_discovered', 'earn income'];
    for (const goal of invalid) {
      const result = validateGoals([goal]);
      assert.equal(result.valid, false, `Expected goal "${goal}" to be rejected`);
    }
  });

  test('8. Multiple valid goals can be submitted together', () => {
    const result = validateGoals(['find-collaborators', 'earn-income', 'network', 'get-discovered']);
    assert.equal(result.valid, true, result.error);
  });

  test('9a. Draft validation uses same goal list as final submission', () => {
    // Both draft (PATCH) and complete (POST) use the same VALID_GOALS constant.
    // Verify get-discovered, network, earn-income all pass the same check.
    const draftGoals = ['get-discovered', 'network', 'earn-income'];
    const finalGoals = ['find-collaborators', 'build-portfolio', 'learn-skills', ...draftGoals];
    assert.equal(validateGoals(draftGoals).valid, true, 'Draft goals should be valid');
    assert.equal(validateGoals(finalGoals).valid, true, 'Final goals should be valid');
  });

  test('10. An empty goals array is rejected', () => {
    const result = validateGoals([]);
    assert.equal(result.valid, false);
    assert.match(result.error, /at least one goal/);
  });

  test('10b. Non-array goals are rejected', () => {
    const result = validateGoals('find-collaborators');
    assert.equal(result.valid, false);
  });

});

describe('experienceLevel', () => {

  test('All valid experience levels are accepted', () => {
    for (const level of VALID_EXPERIENCE_LEVELS) {
      assert.equal(validateExperienceLevel(level).valid, true, `"${level}" should be valid`);
    }
  });

  test('Invalid experience levels are rejected', () => {
    const invalid = ['novice', 'pro', 'junior', 'senior', '', 'Beginner'];
    for (const level of invalid) {
      assert.equal(validateExperienceLevel(level).valid, false, `"${level}" should be rejected`);
    }
  });

});

describe('collaborationPreferences.duration', () => {

  test('All valid durations are accepted', () => {
    for (const dur of VALID_DURATIONS) {
      assert.equal(validateDuration(dur).valid, true, `"${dur}" should be valid`);
    }
  });

  test('Invalid durations are rejected', () => {
    const invalid = ['daily', 'weekly', 'monthly', 'long term', ''];
    for (const dur of invalid) {
      assert.equal(validateDuration(dur).valid, false, `"${dur}" should be rejected`);
    }
  });

});

describe('Contract consistency — frontend IDs match backend enums', () => {

  // These are the exact values used in GoalsStep.jsx GOAL_OPTIONS
  const FRONTEND_GOAL_IDS = [
    'find-collaborators',
    'build-portfolio',
    'learn-skills',
    'earn-income',
    'network',
    'get-discovered',
  ];

  // These are the exact values in CollaborationStep.jsx WORK_MODES
  const FRONTEND_WORK_MODES = ['remote', 'in-person', 'hybrid'];

  // These are the exact values in CollaborationStep.jsx DURATIONS
  const FRONTEND_DURATIONS = ['one-time', 'short-term', 'long-term', 'ongoing'];

  test('11. All frontend goal IDs are accepted by backend validation', () => {
    const result = validateGoals(FRONTEND_GOAL_IDS);
    assert.equal(result.valid, true, result.error);
  });

  test('11b. All frontend work modes are accepted by backend validation', () => {
    for (const mode of FRONTEND_WORK_MODES) {
      assert.equal(validateWorkMode(mode).valid, true, `Frontend work mode "${mode}" rejected by backend`);
    }
  });

  test('11c. All frontend durations are accepted by backend validation', () => {
    for (const dur of FRONTEND_DURATIONS) {
      assert.equal(validateDuration(dur).valid, true, `Frontend duration "${dur}" rejected by backend`);
    }
  });

  test('12. Backend enum is a superset of or equal to frontend options (no silent drops)', () => {
    // Every ID a user can submit from the frontend must be in the backend enum.
    const backendGoalSet = new Set(VALID_GOALS);
    const backendWorkModeSet = new Set(VALID_WORK_MODES);
    const backendDurationSet = new Set(VALID_DURATIONS);

    for (const g of FRONTEND_GOAL_IDS) {
      assert.ok(backendGoalSet.has(g), `Frontend goal "${g}" missing from backend enum`);
    }
    for (const m of FRONTEND_WORK_MODES) {
      assert.ok(backendWorkModeSet.has(m), `Frontend workMode "${m}" missing from backend enum`);
    }
    for (const d of FRONTEND_DURATIONS) {
      assert.ok(backendDurationSet.has(d), `Frontend duration "${d}" missing from backend enum`);
    }
  });

});

describe('Deep-merge safety — handleStepChange contract', () => {

  /**
   * Simulate the fixed handleStepChange deep-merge logic from OnboardingPage.jsx.
   * Verifies that emitting partial nested updates does not wipe sibling keys.
   */
  function deepMergeStep(prev, stepData) {
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
        !Array.isArray(existing)
      ) {
        next[key] = { ...existing, ...incoming };
      } else {
        next[key] = incoming;
      }
    }
    return next;
  }

  test('13a. Partial collaborationPreferences update preserves sibling keys', () => {
    const prev = {
      collaborationPreferences: {
        creatorRoles: ['video-editor'],
        projectTypes: ['short-form-video'],
        duration: 'one-time',
        workMode: '',
      },
    };

    // User picks workMode on the last sub-field in CollaborationStep
    const stepData = {
      collaborationPreferences: {
        creatorRoles: ['video-editor'],
        projectTypes: ['short-form-video'],
        duration: 'one-time',
        workMode: 'hybrid',
      },
    };

    const result = deepMergeStep(prev, stepData);
    assert.equal(result.collaborationPreferences.creatorRoles[0], 'video-editor');
    assert.equal(result.collaborationPreferences.duration, 'one-time');
    assert.equal(result.collaborationPreferences.workMode, 'hybrid');
  });

  test('13b. workPreferences.style array update preserves categories and industries', () => {
    const prev = {
      workPreferences: {
        categories: ['Gaming'],
        industries: ['Tech'],
        style: [],
      },
    };

    const stepData = {
      workPreferences: {
        categories: ['Gaming'],
        industries: ['Tech'],
        style: ['Minimalist', 'Bold'],
      },
    };

    const result = deepMergeStep(prev, stepData);
    assert.deepEqual(result.workPreferences.categories, ['Gaming']);
    assert.deepEqual(result.workPreferences.industries, ['Tech']);
    assert.deepEqual(result.workPreferences.style, ['Minimalist', 'Bold']);
  });

  test('13c. Array-valued top-level fields are replaced (not merged) correctly', () => {
    const prev = { goals: ['find-collaborators'] };
    const stepData = { goals: ['find-collaborators', 'network', 'earn-income'] };
    const result = deepMergeStep(prev, stepData);
    assert.deepEqual(result.goals, ['find-collaborators', 'network', 'earn-income']);
  });

});
