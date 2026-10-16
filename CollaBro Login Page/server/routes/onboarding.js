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
import { CREATOR_ROLES, isValidRole, VALID_ROLE_IDS } from '../utils/creatorRoles.js';

const router = express.Router();

/* ─────────────────────────────────────────────────
   GET /api/onboarding/status
   Returns authenticated user's onboarding status
───────────────────────────────────────────────── */
router.get('/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('onboarding');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
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
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

/* ─────────────────────────────────────────────────
   GET /api/onboarding/config
   Returns creator roles catalogue (public subset)
───────────────────────────────────────────────── */
router.get('/config', protect, (req, res) => {
  return res.json({
    success: true,
    roles: CREATOR_ROLES,
    validRoleIds: VALID_ROLE_IDS,
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
      return res.json({ success: true, profile: null });
    }

    return res.json({
      success: true,
      profile: {
        accountType: profile.accountType,
        primaryRole: profile.primaryRole,
        skills: profile.skills,
        experienceLevel: profile.experienceLevel,
        tools: profile.tools,
        goals: profile.goals,
        collaborationPreferences: profile.collaborationPreferences,
        workPreferences: profile.workPreferences,
        clientNeeds: profile.clientNeeds,
        company: profile.company,
        profileTitle: profile.profileTitle,
        displayName: profile.displayName,
        bio: profile.bio,
      },
    });
  } catch (err) {
    console.error('[Get Responses Error]', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
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
      profile = new CreatorProfile({
        user: req.user._id,
        // accountType is required — default to 'freelancer' until user selects
        accountType: responses.accountType || 'freelancer',
      });
    }

    // Update only provided fields
    if (responses.accountType !== undefined) profile.accountType = responses.accountType;
    if (responses.primaryRole !== undefined) profile.primaryRole = responses.primaryRole;
    if (responses.skills !== undefined) profile.skills = responses.skills;
    if (responses.experienceLevel !== undefined) profile.experienceLevel = responses.experienceLevel;
    if (responses.tools !== undefined) profile.tools = responses.tools;
    if (responses.goals !== undefined) profile.goals = responses.goals;
    if (responses.clientNeeds !== undefined) profile.clientNeeds = responses.clientNeeds;
    if (responses.company !== undefined) profile.company = responses.company;
    if (responses.profileTitle !== undefined) profile.profileTitle = responses.profileTitle;
    if (responses.displayName !== undefined) profile.displayName = responses.displayName;
    if (responses.bio !== undefined) profile.bio = responses.bio;

    if (responses.collaborationPreferences !== undefined) {
      const existing = profile.collaborationPreferences || {};
      const incoming = responses.collaborationPreferences;
      profile.collaborationPreferences = {
        creatorRoles: incoming.creatorRoles !== undefined ? incoming.creatorRoles : (existing.creatorRoles || []),
        projectTypes: incoming.projectTypes !== undefined ? incoming.projectTypes : (existing.projectTypes || []),
        duration: incoming.duration !== undefined ? incoming.duration : existing.duration,
        workMode: incoming.workMode !== undefined ? incoming.workMode : existing.workMode,
      };
      profile.markModified('collaborationPreferences');
    }

    if (responses.workPreferences !== undefined) {
      const existing = profile.workPreferences || {};
      const incoming = responses.workPreferences;
      profile.workPreferences = {
        categories: incoming.categories !== undefined ? incoming.categories : (existing.categories || []),
        industries: incoming.industries !== undefined ? incoming.industries : (existing.industries || []),
        style: incoming.style !== undefined
          ? (Array.isArray(incoming.style) ? incoming.style : [])
          : (Array.isArray(existing.style) ? existing.style : []),
      };
      profile.markModified('workPreferences');
    }

    // Save with validation disabled — drafts may be incomplete
    await profile.save({ validateBeforeSave: false });

    return res.json({ success: true, message: 'Draft saved successfully.' });
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
   Handles both freelancer and client account types.
───────────────────────────────────────────────── */
router.post(
  '/complete',
  protect,
  [
    body('accountType')
      .isIn(['freelancer', 'client'])
      .withMessage('Account type must be "freelancer" or "client".'),

    // Freelancer-only: primaryRole must be one of the 5 supported roles
    body('primaryRole')
      .if(body('accountType').equals('freelancer'))
      .notEmpty()
      .withMessage('Primary role is required for freelancers.')
      .custom((value) => {
        if (!isValidRole(value)) {
          throw new Error(`Invalid role: ${value}. Must be one of: ${VALID_ROLE_IDS.join(', ')}`);
        }
        return true;
      }),

    body('experienceLevel')
      .if(body('accountType').equals('freelancer'))
      .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
      .withMessage('Valid experience level is required for freelancers.'),

    body('skills')
      .if(body('accountType').equals('freelancer'))
      .isArray({ min: 1, max: 15 })
      .withMessage('Add at least 1 skill (max 15) for freelancers.'),

    body('goals')
      .if(body('accountType').equals('freelancer'))
      .isArray({ min: 1 })
      .withMessage('Select at least one goal for freelancers.'),

    body('goals.*')
      .if(body('accountType').equals('freelancer'))
      .isIn(['find-collaborators', 'build-portfolio', 'learn-skills', 'earn-income', 'network', 'get-discovered'])
      .withMessage('Invalid goal value.'),

    body('collaborationPreferences.creatorRoles')
      .if(body('accountType').equals('freelancer'))
      .isArray({ min: 1 })
      .withMessage('Select at least one collaborator role.'),

    body('collaborationPreferences.projectTypes')
      .if(body('accountType').equals('freelancer'))
      .isArray({ min: 1 })
      .withMessage('Select at least one project type.'),

    body('collaborationPreferences.duration')
      .if(body('accountType').equals('freelancer'))
      .isIn(['one-time', 'short-term', 'long-term', 'ongoing'])
      .withMessage('Invalid duration value.'),

    body('collaborationPreferences.workMode')
      .if(body('accountType').equals('freelancer'))
      .isIn(['remote', 'in-person', 'hybrid'])
      .withMessage('Invalid work mode value.'),

    // Optional fields
    body('tools').optional().isArray({ max: 15 }),
    body('workPreferences.categories').optional().isArray({ max: 10 }),
    body('workPreferences.industries').optional().isArray({ max: 10 }),
    body('workPreferences.style').optional().isArray({ max: 8 }),
    body('bio').optional().isString().isLength({ max: 500 }),
    body('displayName').optional().isString().isLength({ max: 100 }),
    body('profileTitle').optional().isString().isLength({ max: 100 }),
    body('company').optional().isString().isLength({ max: 100 }),
    body('clientNeeds').optional().isArray({ max: 20 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed.',
          errors: errors.array(),
        });
      }

      const {
        accountType,
        primaryRole,
        skills,
        experienceLevel,
        tools,
        goals,
        collaborationPreferences,
        workPreferences,
        clientNeeds,
        company,
        profileTitle,
        displayName,
        bio,
      } = req.body;

      // Create or update profile — upsert pattern prevents duplicates
      let profile = await CreatorProfile.findOne({ user: req.user._id });
      if (!profile) {
        profile = new CreatorProfile({ user: req.user._id });
      }

      profile.accountType = accountType;
      profile.bio = bio || '';
      profile.displayName = displayName || '';
      profile.profileTitle = profileTitle || '';

      if (accountType === 'freelancer') {
        profile.primaryRole = primaryRole;
        profile.skills = skills || [];
        profile.experienceLevel = experienceLevel;
        profile.tools = tools || [];
        profile.goals = goals || [];

        const collab = collaborationPreferences || {};
        profile.collaborationPreferences = {
          creatorRoles: collab.creatorRoles || [],
          projectTypes: collab.projectTypes || [],
          duration: collab.duration || undefined,
          workMode: collab.workMode || undefined,
        };
        profile.markModified('collaborationPreferences');

        const work = workPreferences || {};
        profile.workPreferences = {
          categories: work.categories || [],
          industries: work.industries || [],
          style: Array.isArray(work.style) ? work.style : [],
        };
        profile.markModified('workPreferences');
      } else {
        // Client
        profile.primaryRole = null;
        profile.clientNeeds = clientNeeds || [];
        profile.company = company || '';
      }

      // Save profile FIRST — only mark onboarding complete if it succeeds
      await profile.save();

      // Mark onboarding complete only after successful profile save
      await User.findByIdAndUpdate(req.user._id, {
        'onboarding.status': 'completed',
        'onboarding.completedAt': new Date(),
        'onboarding.version': 1,
      });

      console.log(`✅ Onboarding completed for user ${req.user.email} (accountType: ${accountType}${accountType === 'freelancer' ? `, role: ${primaryRole}` : ''})`);

      return res.json({
        success: true,
        message: 'Onboarding completed successfully!',
        onboarding: {
          status: 'completed',
          completedAt: new Date(),
        },
        accountType,
        primaryRole: accountType === 'freelancer' ? primaryRole : null,
      });
    } catch (err) {
      console.error('[Complete Onboarding Error]', err);

      if (err.name === 'ValidationError') {
        const errors = Object.keys(err.errors).map((key) => ({
          field: key,
          message: err.errors[key].message,
        }));
        return res.status(400).json({ success: false, message: 'Validation failed.', errors });
      }

      return res.status(500).json({
        success: false,
        message: err.message || 'Server error. Please try again.',
      });
    }
  }
);

export default router;
