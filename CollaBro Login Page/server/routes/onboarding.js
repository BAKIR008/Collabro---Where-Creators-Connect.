/**
 * CollaBro — Onboarding Routes
 * server/routes/onboarding.js
 * 
 * POST /api/onboarding/complete      — Complete onboarding and save profile
 * GET  /api/onboarding/status        — Get onboarding status
 * GET  /api/onboarding/responses     — Get saved draft responses
 * PATCH /api/onboarding/responses    — Save draft responses
 * GET  /api/onboarding/config        — Get roles catalogue
 */

import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import CreatorProfile from '../models/CreatorProfile.js';
import { protect } from '../middleware/auth.js';
import { CREATOR_ROLES, isValidRole } from '../utils/creatorRoles.js';

const router = express.Router();

/* ─────────────────────────────────────────────────
   GET /api/onboarding/status
   Returns authenticated user's onboarding status
───────────────────────────────────────────────── */
router.get('/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('onboarding');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    return res.json({
      success: true,
      onboarding: {
        status: user.onboarding.status,
        completed: user.onboarding.status === 'completed',
        surveyVersion: user.onboarding.version,
        currentStepId: user.onboarding.currentStepId,
        completedAt: user.onboarding.completedAt,
      },
    });
  } catch (err) {
    console.error('[Onboarding Status Error]', err);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
    });
  }
});

/* ─────────────────────────────────────────────────
   GET /api/onboarding/config
   Returns creator roles catalogue
───────────────────────────────────────────────── */
router.get('/config', protect, (req, res) => {
  return res.json({
    success: true,
    roles: CREATOR_ROLES,
    version: 1,
  });
});

/* ─────────────────────────────────────────────────
   GET /api/onboarding/responses
   Returns saved draft responses
───────────────────────────────────────────────── */
router.get('/responses', protect, async (req, res) => {
  try {
    const profile = await CreatorProfile.findOne({ user: req.user._id });

    if (!profile) {
      return res.json({
        success: true,
        profile: null,
      });
    }

    return res.json({
      success: true,
      profile: {
        primaryRole: profile.primaryRole,
        roles: profile.roles,
        customRole: profile.customRole,
        skills: profile.skills,
        experienceLevel: profile.experienceLevel,
        tools: profile.tools,
        goals: profile.goals,
        collaborationPreferences: profile.collaborationPreferences,
        workPreferences: profile.workPreferences,
      },
    });
  } catch (err) {
    console.error('[Get Responses Error]', err);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
    });
  }
});

/* ─────────────────────────────────────────────────
   PATCH /api/onboarding/responses
   Save draft responses (does not mark complete)
───────────────────────────────────────────────── */
router.patch('/responses', protect, async (req, res) => {
  try {
    const { currentStepId, ...responses } = req.body;

    // Update user's current step
    await User.findByIdAndUpdate(req.user._id, {
      'onboarding.status': 'in_progress',
      'onboarding.currentStepId': currentStepId || null,
      'onboarding.lastSavedAt': new Date(),
    });

    // Find or create draft profile
    let profile = await CreatorProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = new CreatorProfile({ user: req.user._id });
    }

    // Update only provided fields — flat fields are straightforward
    if (responses.roles !== undefined) profile.roles = responses.roles;
    if (responses.primaryRole !== undefined) profile.primaryRole = responses.primaryRole;
    if (responses.customRole !== undefined) profile.customRole = responses.customRole;
    if (responses.skills !== undefined) profile.skills = responses.skills;
    if (responses.experienceLevel !== undefined) profile.experienceLevel = responses.experienceLevel;
    if (responses.tools !== undefined) profile.tools = responses.tools;
    if (responses.goals !== undefined) profile.goals = responses.goals;

    // Nested subdocuments: merge field-by-field and call markModified so
    // Mongoose detects the change. Direct object replacement can leave
    // Mongoose unaware of which paths changed.
    if (responses.collaborationPreferences !== undefined) {
      const existing = profile.collaborationPreferences || {};
      const incoming = responses.collaborationPreferences;

      profile.collaborationPreferences = {
        creatorRoles: incoming.creatorRoles !== undefined
          ? incoming.creatorRoles
          : (existing.creatorRoles || []),
        projectTypes: incoming.projectTypes !== undefined
          ? incoming.projectTypes
          : (existing.projectTypes || []),
        duration: incoming.duration !== undefined
          ? incoming.duration
          : existing.duration,
        workMode: incoming.workMode !== undefined
          ? incoming.workMode
          : existing.workMode,
      };
      profile.markModified('collaborationPreferences');
    }

    if (responses.workPreferences !== undefined) {
      const existing = profile.workPreferences || {};
      const incoming = responses.workPreferences;

      profile.workPreferences = {
        categories: incoming.categories !== undefined
          ? incoming.categories
          : (existing.categories || []),
        industries: incoming.industries !== undefined
          ? incoming.industries
          : (existing.industries || []),
        // Always store style as an array — guard against accidental string submission
        style: incoming.style !== undefined
          ? (Array.isArray(incoming.style) ? incoming.style : [])
          : (Array.isArray(existing.style) ? existing.style : []),
      };
      profile.markModified('workPreferences');
    }

    // Save with validation disabled — drafts may be incomplete
    await profile.save({ validateBeforeSave: false });

    return res.json({
      success: true,
      message: 'Draft saved successfully.',
    });
  } catch (err) {
    console.error('[Save Draft Error]', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Server error. Please try again.',
    });
  }
});

/* ─────────────────────────────────────────────────
   POST /api/onboarding/complete
   Complete onboarding and save final profile
───────────────────────────────────────────────── */
router.post(
  '/complete',
  protect,
  [
    // Basic required fields
    body('roles')
      .isArray({ min: 1, max: 5 })
      .withMessage('Select 1-5 creator roles.'),
    body('roles.*')
      .custom((value) => {
        if (!isValidRole(value) && value !== 'other') {
          throw new Error(`Invalid role: ${value}`);
        }
        return true;
      }),
    body('primaryRole')
      .notEmpty()
      .withMessage('Primary role is required.')
      .custom((value, { req }) => {
        if (!req.body.roles || !req.body.roles.includes(value)) {
          throw new Error('Primary role must be one of your selected roles.');
        }
        return true;
      }),
    body('experienceLevel')
      .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
      .withMessage('Valid experience level required.'),
    body('skills')
      .isArray({ min: 1, max: 15 })
      .withMessage('Add at least 1 skill (max 15).'),
    body('goals')
      .isArray({ min: 1 })
      .withMessage('Select at least one goal.'),
    body('goals.*')
      .isIn(['find-collaborators', 'build-portfolio', 'learn-skills', 'earn-income', 'network', 'get-discovered'])
      .withMessage('Invalid goal value.'),
    
    // Collaboration preferences validation
    body('collaborationPreferences.creatorRoles')
      .isArray({ min: 1 })
      .withMessage('Select at least one collaborator role.'),
    body('collaborationPreferences.projectTypes')
      .isArray({ min: 1 })
      .withMessage('Select at least one project type.'),
    body('collaborationPreferences.duration')
      .isIn(['one-time', 'short-term', 'long-term', 'ongoing'])
      .withMessage('Invalid duration value.'),
    body('collaborationPreferences.workMode')
      .isIn(['remote', 'in-person', 'hybrid'])
      .withMessage('Invalid work mode value.'),
    
    // Optional fields validation
    body('tools').optional().isArray({ max: 15 }),
    body('customRole').optional().isString().isLength({ max: 100 }),
    body('workPreferences.categories').optional().isArray({ max: 10 }),
    body('workPreferences.industries').optional().isArray({ max: 10 }),
    body('workPreferences.style').optional().isArray({ max: 8 }),
  ],
  async (req, res) => {
    try {
      // Validate
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed.',
          errors: errors.array(),
        });
      }

      const {
        roles,
        primaryRole,
        customRole,
        skills,
        experienceLevel,
        tools,
        goals,
        collaborationPreferences,
        workPreferences,
      } = req.body;

      // Create or update profile — upsert pattern prevents duplicates
      let profile = await CreatorProfile.findOne({ user: req.user._id });

      if (!profile) {
        profile = new CreatorProfile({ user: req.user._id });
      }

      // Assign flat fields
      profile.roles = roles;
      profile.primaryRole = primaryRole;
      profile.customRole = customRole || null;
      profile.skills = skills || [];
      profile.experienceLevel = experienceLevel;
      profile.tools = tools || [];
      profile.goals = goals || [];

      // Assign nested collaborationPreferences field-by-field to avoid
      // Mongoose losing track of changes on a subdocument replacement.
      const collab = collaborationPreferences || {};
      profile.collaborationPreferences = {
        creatorRoles: collab.creatorRoles || [],
        projectTypes: collab.projectTypes || [],
        duration: collab.duration || undefined,
        workMode: collab.workMode || undefined,
      };
      profile.markModified('collaborationPreferences');

      // Assign nested workPreferences field-by-field
      const work = workPreferences || {};
      profile.workPreferences = {
        categories: work.categories || [],
        industries: work.industries || [],
        style: Array.isArray(work.style) ? work.style : [],
      };
      profile.markModified('workPreferences');

      // Save profile FIRST — only mark onboarding complete if it succeeds.
      // This keeps the User document consistent with the profile document.
      await profile.save();

      // Mark onboarding complete only after successful profile save
      await User.findByIdAndUpdate(req.user._id, {
        'onboarding.status': 'completed',
        'onboarding.completedAt': new Date(),
        'onboarding.version': 1,
      });

      console.log(`✅ Onboarding completed for user ${req.user.email}`);

      return res.json({
        success: true,
        message: 'Onboarding completed successfully!',
        user: {
          onboarding: {
            status: 'completed',
            completedAt: new Date(),
          },
        },
        dashboardRoute: `/dashboard`,
      });
    } catch (err) {
      console.error('[Complete Onboarding Error]', err);

      // Return validation errors clearly
      if (err.name === 'ValidationError') {
        const errors = Object.keys(err.errors).map((key) => ({
          field: key,
          message: err.errors[key].message,
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed.',
          errors,
        });
      }

      return res.status(500).json({
        success: false,
        message: err.message || 'Server error. Please try again.',
      });
    }
  }
);

export default router;
