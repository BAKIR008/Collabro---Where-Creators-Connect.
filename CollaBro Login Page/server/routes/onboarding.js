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
        accountType: user.onboarding.accountType,
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
        accountType: profile.accountType,
        displayName: profile.displayName,
        profileTitle: profile.profileTitle,
        bio: profile.bio,
        education: profile.education,
        github: profile.github,
        linkedin: profile.linkedin,
        resume: profile.resume,
        company: profile.company,
        clientNeeds: profile.clientNeeds,
        primaryRole: profile.primaryRole,
        roles: profile.roles,
        skills: profile.skills,
        experienceLevel: profile.experienceLevel,
        goals: profile.goals,
        workMode: profile.workMode,
        workStyle: profile.workStyle,
        collaborationPreferences: profile.collaborationPreferences,
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

    // Update user's current step and accountType
    const userUpdate = {
      'onboarding.status': 'in_progress',
      'onboarding.currentStepId': currentStepId || null,
      'onboarding.lastSavedAt': new Date(),
    };
    if (responses.accountType !== undefined) {
      userUpdate['onboarding.accountType'] = responses.accountType;
    }
    
    await User.findByIdAndUpdate(req.user._id, userUpdate);

    // Find or create draft profile
    let profile = await CreatorProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = new CreatorProfile({ user: req.user._id });
    }

    // Update flat fields
    if (responses.accountType !== undefined) profile.accountType = responses.accountType;
    if (responses.displayName !== undefined) profile.displayName = responses.displayName;
    if (responses.profileTitle !== undefined) profile.profileTitle = responses.profileTitle;
    if (responses.bio !== undefined) profile.bio = responses.bio;
    if (responses.education !== undefined) profile.education = responses.education;
    if (responses.github !== undefined) profile.github = responses.github;
    if (responses.linkedin !== undefined) profile.linkedin = responses.linkedin;
    if (responses.resume !== undefined) profile.resume = responses.resume;
    if (responses.company !== undefined) profile.company = responses.company;
    if (responses.clientNeeds !== undefined) profile.clientNeeds = responses.clientNeeds;
    if (responses.roles !== undefined) profile.roles = responses.roles;
    if (responses.primaryRole !== undefined) profile.primaryRole = responses.primaryRole;
    if (responses.skills !== undefined) profile.skills = responses.skills;
    if (responses.experienceLevel !== undefined) profile.experienceLevel = responses.experienceLevel;
    if (responses.goals !== undefined) profile.goals = responses.goals;
    if (responses.workMode !== undefined) profile.workMode = responses.workMode;
    // ensure workStyle is stored as a string
    if (responses.workStyle !== undefined) profile.workStyle = typeof responses.workStyle === 'string' ? responses.workStyle : String(responses.workStyle);

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
      };
      profile.markModified('collaborationPreferences');
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
    // Common
    body('accountType')
      .isIn(['client', 'freelancer'])
      .withMessage('Valid account type is required.'),
    body('displayName')
      .notEmpty().withMessage('Display name is required.')
      .isLength({ max: 100 }).withMessage('Display name must not exceed 100 characters.'),

    // Client-specific validation
    body('clientNeeds')
      .if(body('accountType').equals('client'))
      .isArray({ min: 1 })
      .withMessage('Select at least one need.'),

    // Freelancer-specific validation
    body('roles')
      .if(body('accountType').equals('freelancer'))
      .isArray({ min: 1, max: 5 })
      .withMessage('Select 1-5 creator roles.'),
    body('roles.*')
      .if(body('accountType').equals('freelancer'))
      .custom((value) => {
        if (!isValidRole(value)) {
          throw new Error(`Invalid role: ${value}`);
        }
        return true;
      }),
    body('primaryRole')
      .if(body('accountType').equals('freelancer'))
      .notEmpty()
      .withMessage('Primary role is required.')
      .custom((value, { req }) => {
        if (!req.body.roles || !req.body.roles.includes(value)) {
          throw new Error('Primary role must be one of your selected roles.');
        }
        return true;
      }),
    body('experienceLevel')
      .if(body('accountType').equals('freelancer'))
      .isIn(['beginner', 'intermediate', 'advanced', 'expert', 'professional'])
      .withMessage('Valid experience level required.'),
    body('skills')
      .if(body('accountType').equals('freelancer'))
      .isArray({ min: 1, max: 15 })
      .withMessage('Add at least 1 skill (max 15).'),
    body('goals')
      .if(body('accountType').equals('freelancer'))
      .isArray({ min: 1 })
      .withMessage('Select at least one goal.'),
    body('goals.*')
      .if(body('accountType').equals('freelancer'))
      .isIn([
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
      ])
      .withMessage('Invalid goal value.'),
    body('workMode')
      .if(body('accountType').equals('freelancer'))
      .isIn(['remote', 'hybrid', 'on-site'])
      .withMessage('Invalid work mode value.'),
    body('workStyle')
      .if(body('accountType').equals('freelancer'))
      .isString()
      .isIn(['flexible', 'structured', 'fast-paced', 'long-term', 'short-term'])
      .withMessage('Invalid work style value.'),
    
    // Optional fields validation
    body('profileTitle').optional().isString().isLength({ max: 100 }),
    body('bio').optional().isString().isLength({ max: 500 }),
    body('education').optional().isString().isLength({ max: 200 }),
    body('github').optional().isString().matches(/^https:\/\/github\.com\/.+/).withMessage('Invalid GitHub URL'),
    body('linkedin').optional().isString().matches(/^https:\/\/(www\.)?linkedin\.com\/.+/).withMessage('Invalid LinkedIn URL'),
    body('company').optional().isString().isLength({ max: 100 }),
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
        accountType,
        displayName,
        profileTitle,
        bio,
        education,
        github,
        linkedin,
        resume,
        company,
        clientNeeds,
        roles,
        primaryRole,
        skills,
        experienceLevel,
        goals,
        workMode,
        workStyle,
        collaborationPreferences,
      } = req.body;

      // Create or update profile — upsert pattern prevents duplicates
      let profile = await CreatorProfile.findOne({ user: req.user._id });

      if (!profile) {
        profile = new CreatorProfile({ user: req.user._id });
      }

      // Assign flat fields
      profile.accountType = accountType;
      profile.displayName = displayName;
      profile.profileTitle = profileTitle || undefined;
      profile.bio = bio || undefined;
      profile.education = education || undefined;
      profile.github = github || undefined;
      profile.linkedin = linkedin || undefined;
      profile.resume = resume || undefined;
      profile.company = company || undefined;
      profile.clientNeeds = clientNeeds || [];
      
      profile.roles = roles || [];
      profile.primaryRole = primaryRole || undefined;
      profile.skills = skills || [];
      profile.experienceLevel = experienceLevel || undefined;
      profile.goals = goals || [];
      profile.workMode = workMode || undefined;
      profile.workStyle = workStyle !== undefined ? String(workStyle) : undefined;

      const collab = collaborationPreferences || {};
      profile.collaborationPreferences = {
        creatorRoles: collab.creatorRoles || [],
        projectTypes: collab.projectTypes || [],
        duration: collab.duration || undefined,
      };
      profile.markModified('collaborationPreferences');

      // Save profile FIRST — only mark onboarding complete if it succeeds.
      await profile.save();

      // Mark onboarding complete only after successful profile save
      await User.findByIdAndUpdate(req.user._id, {
        'onboarding.status': 'completed',
        'onboarding.completedAt': new Date(),
        'onboarding.version': 1,
        'onboarding.accountType': accountType,
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
