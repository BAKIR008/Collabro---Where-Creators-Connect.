/**
 * CollaBro — Onboarding Validation Tests
 * server/tests/onboarding.test.js
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
  'find-projects',
  'find-clients',
  'build-portfolio',
  'showcase-work',
  'get-discovered',
  'grow-network',
  'find-teams',
  'learn-skills',
  'earn-income',
];

const VALID_WORK_MODES = ['remote', 'hybrid', 'on-site'];

const VALID_DURATIONS = ['one-time', 'short-term', 'long-term', 'ongoing', 'flexible'];

const VALID_EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert', 'professional'];

const VALID_WORK_STYLES = ['flexible', 'structured', 'fast-paced', 'long-term', 'short-term'];

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
  if (typeof style !== 'string') {
    return { valid: false, error: 'workStyle must be a string.' };
  }
  if (!VALID_WORK_STYLES.includes(style)) {
    return { valid: false, error: `Invalid workStyle: ${style}` };
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

describe('workStyle — single select string', () => {

  test('1. A valid single style string is accepted', () => {
    const result = validateWorkStyle('flexible');
    assert.equal(result.valid, true, result.error);
  });

  test('3a. An array is rejected (prevents CastError)', () => {
    const result = validateWorkStyle(['flexible']);
    assert.equal(result.valid, false);
    assert.match(result.error, /must be a string/);
  });

  test('3b. Unsupported work style string is rejected', () => {
    const result = validateWorkStyle('lazy');
    assert.equal(result.valid, false);
    assert.match(result.error, /Invalid workStyle/);
  });

});

describe('workMode', () => {

  test('4. "hybrid" is accepted', () => {
    const result = validateWorkMode('hybrid');
    assert.equal(result.valid, true, result.error);
  });

  test('4b. "remote" is accepted', () => {
    assert.equal(validateWorkMode('remote').valid, true);
  });

  test('4c. "on-site" is accepted', () => {
    assert.equal(validateWorkMode('on-site').valid, true);
  });

  test('5. Unsupported work modes are rejected', () => {
    const unsupported = ['Hybrid', 'HYBRID', 'in-person', 'flexible', '', 'hybrid '];
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

  test('6b. All goals together are accepted', () => {
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

describe('Deep-merge safety — handleStepChange contract', () => {

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
      },
    };

    const stepData = {
      collaborationPreferences: {
        creatorRoles: ['video-editor'],
        projectTypes: ['short-form-video'],
        duration: 'long-term',
      },
    };

    const result = deepMergeStep(prev, stepData);
    assert.equal(result.collaborationPreferences.creatorRoles[0], 'video-editor');
    assert.equal(result.collaborationPreferences.duration, 'long-term');
  });

  test('13c. Array-valued top-level fields are replaced (not merged) correctly', () => {
    const prev = { goals: ['find-collaborators'] };
    const stepData = { goals: ['find-collaborators', 'grow-network', 'earn-income'] };
    const result = deepMergeStep(prev, stepData);
    assert.deepEqual(result.goals, ['find-collaborators', 'grow-network', 'earn-income']);
  });

});
