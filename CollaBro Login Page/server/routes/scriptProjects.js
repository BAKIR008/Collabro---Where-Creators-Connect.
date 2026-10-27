/**
 * CollaBro — Script Projects Routes
 * server/routes/scriptProjects.js
 *
 * GET    /api/script-projects                    — List projects (client sees own, freelancer sees assigned)
 * POST   /api/script-projects                    — Client creates a project and assigns a freelancer
 * GET    /api/script-projects/:id                — Get project details (authorized parties only)
 * PATCH  /api/script-projects/:id/submit         — Freelancer submits the script
 * PATCH  /api/script-projects/:id/feedback       — Client gives feedback / requests revision
 * PATCH  /api/script-projects/:id/accept         — Client accepts the submission
 */

import express from 'express';
import { body, validationResult, param } from 'express-validator';
import mongoose from 'mongoose';
import { protect } from '../middleware/auth.js';
import ScriptProject from '../models/ScriptProject.js';
import Script from '../models/Script.js';
import User from '../models/User.js';
import CreatorProfile from '../models/CreatorProfile.js';

const router = express.Router();

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/* ─────────────────────────────────────────────────
   GET /api/script-projects
   List projects visible to the authenticated user.
   - Clients see projects they created.
   - Freelancers see projects assigned to them.
   Optional: ?role=client|freelancer to force a perspective.
───────────────────────────────────────────────── */
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    // Determine which projects to show based on user role in each project
    const filter = {
      $or: [
        { client: userId },
        { freelancer: userId },
      ],
    };

    const projects = await ScriptProject.find(filter)
      .populate('client', 'name email profilePicture')
      .populate('freelancer', 'name email profilePicture')
      .populate('linkedScript', 'title wordCount status lastSavedAt updatedAt')
      .sort({ updatedAt: -1 })
      .lean();

    return res.json({ success: true, projects });
  } catch (err) {
    console.error('[List ScriptProjects Error]', err);
    return res.status(500).json({ success: false, message: 'Could not load projects.' });
  }
});

/* ─────────────────────────────────────────────────
   POST /api/script-projects
   Client creates a new project and optionally assigns a freelancer by email.
───────────────────────────────────────────────── */
router.post(
  '/',
  protect,
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Project title is required.')
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters.'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 5000 })
      .withMessage('Description cannot exceed 5000 characters.'),
    body('brief')
      .optional()
      .trim()
      .isLength({ max: 10000 })
      .withMessage('Brief cannot exceed 10000 characters.'),
    body('instructions')
      .optional()
      .trim()
      .isLength({ max: 5000 })
      .withMessage('Instructions cannot exceed 5000 characters.'),
    body('format')
      .optional()
      .isIn(['Feature', 'Pilot', 'Short Film', 'Docuseries', 'Limited Series', 'Stage Play', 'Web Series', 'Other', ''])
      .withMessage('Invalid format.'),
    body('genre')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Genre cannot exceed 100 characters.'),
    body('targetWordCount')
      .optional({ values: 'null' })
      .isInt({ min: 0 })
      .withMessage('Target word count must be a non-negative integer.'),
    body('deadline')
      .optional({ values: 'null' })
      .isISO8601()
      .withMessage('Deadline must be a valid date.'),
    body('freelancerEmail')
      .optional({ values: 'null' })
      .trim()
      .isEmail()
      .withMessage('Freelancer email must be valid.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed.', errors: errors.array() });
    }

    try {
      const {
        title, description, brief, instructions, format, genre,
        targetWordCount, deadline, freelancerEmail,
      } = req.body;

      let freelancerId = null;

      // Resolve freelancer by email if provided
      if (freelancerEmail) {
        const freelancerUser = await User.findOne({ email: freelancerEmail.toLowerCase() });
        if (!freelancerUser) {
          return res.status(404).json({ success: false, message: `No user found with email ${freelancerEmail}.` });
        }
        // Verify they are a script-writer
        const freelancerProfile = await CreatorProfile.findOne({ user: freelancerUser._id });
        if (!freelancerProfile || freelancerProfile.primaryRole !== 'script-writer') {
          return res.status(400).json({
            success: false,
            message: `${freelancerEmail} is not registered as a Script Writer on CollaBro.`,
          });
        }
        freelancerId = freelancerUser._id;
      }

      const project = await ScriptProject.create({
        client: req.user._id,
        freelancer: freelancerId,
        title: title.trim(),
        description: description?.trim() || '',
        brief: brief?.trim() || '',
        instructions: instructions?.trim() || '',
        format: format || '',
        genre: genre?.trim() || '',
        targetWordCount: targetWordCount || null,
        deadline: deadline ? new Date(deadline) : null,
        status: freelancerId ? 'open' : 'open',
        activityLog: [
          {
            event: 'created',
            by: req.user._id,
            at: new Date(),
            note: freelancerId ? `Assigned to freelancer.` : 'Project created, no freelancer assigned yet.',
          },
        ],
      });

      return res.status(201).json({
        success: true,
        message: 'Project created successfully.',
        project,
      });
    } catch (err) {
      console.error('[Create ScriptProject Error]', err);
      return res.status(500).json({ success: false, message: 'Could not create project.' });
    }
  }
);

/* ─────────────────────────────────────────────────
   GET /api/script-projects/:id
   Get project details (authorized parties only).
───────────────────────────────────────────────── */
router.get(
  '/:id',
  protect,
  [
    param('id').custom((id) => {
      if (!isValidObjectId(id)) throw new Error('Invalid project ID.');
      return true;
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Invalid project ID.' });
    }

    try {
      const project = await ScriptProject.findById(req.params.id)
        .populate('client', 'name email profilePicture')
        .populate('freelancer', 'name email profilePicture')
        .populate('linkedScript');

      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found.' });
      }

      const userId = req.user._id.toString();
      const isClient = project.client._id.toString() === userId;
      const isFreelancer = project.freelancer && project.freelancer._id.toString() === userId;

      if (!isClient && !isFreelancer) {
        return res.status(403).json({ success: false, message: 'Access denied.' });
      }

      // Redact submission content snapshots for freelancers viewing under-review submissions
      // (they can see status but not client-only data)
      return res.json({ success: true, project, isClient, isFreelancer });
    } catch (err) {
      console.error('[Get ScriptProject Error]', err);
      return res.status(500).json({ success: false, message: 'Could not load project.' });
    }
  }
);

/* ─────────────────────────────────────────────────
   PATCH /api/script-projects/:id/submit
   Freelancer submits their script for client review.
───────────────────────────────────────────────── */
router.patch(
  '/:id/submit',
  protect,
  [
    param('id').custom((id) => {
      if (!isValidObjectId(id)) throw new Error('Invalid project ID.');
      return true;
    }),
    body('note')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Note cannot exceed 1000 characters.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed.', errors: errors.array() });
    }

    try {
      const project = await ScriptProject.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found.' });
      }

      // Only the assigned freelancer can submit
      if (!project.freelancer || project.freelancer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Only the assigned freelancer can submit.' });
      }

      // Must have a linked script
      if (!project.linkedScript) {
        return res.status(400).json({ success: false, message: 'No script is linked to this project. Please create a script first.' });
      }

      // Must be in a submittable state
      const submittableStates = ['open', 'in_progress', 'revision_requested'];
      if (!submittableStates.includes(project.status)) {
        return res.status(400).json({ success: false, message: `Cannot submit from status "${project.status}".` });
      }

      // Load the script to capture a content snapshot
      const script = await Script.findById(project.linkedScript);
      if (!script) {
        return res.status(404).json({ success: false, message: 'Linked script not found.' });
      }
      if (!script.content || script.content.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'Your script is empty. Please write something before submitting.' });
      }

      const { note } = req.body;
      const isResubmission = project.status === 'revision_requested';

      // Add submission record
      const submission = {
        contentSnapshot: script.content,
        wordCount: script.wordCount,
        submittedAt: new Date(),
        submittedBy: req.user._id,
        note: note || '',
        clientResponse: { status: 'pending', feedback: '', respondedAt: null },
      };

      project.submissions.push(submission);
      project.status = 'submitted';
      project.activityLog.push({
        event: isResubmission ? 'resubmitted' : 'submitted',
        by: req.user._id,
        at: new Date(),
        note: note || '',
      });

      // Update script status
      script.status = 'submitted';
      await Promise.all([project.save(), script.save()]);

      return res.json({
        success: true,
        message: isResubmission ? 'Revised script submitted for review.' : 'Script submitted to client for review.',
        project: {
          _id: project._id,
          status: project.status,
          submissions: project.submissions.length,
        },
      });
    } catch (err) {
      console.error('[Submit Script Error]', err);
      return res.status(500).json({ success: false, message: 'Could not submit script.' });
    }
  }
);

/* ─────────────────────────────────────────────────
   PATCH /api/script-projects/:id/feedback
   Client provides feedback or requests a revision.
───────────────────────────────────────────────── */
router.patch(
  '/:id/feedback',
  protect,
  [
    param('id').custom((id) => {
      if (!isValidObjectId(id)) throw new Error('Invalid project ID.');
      return true;
    }),
    body('feedback')
      .trim()
      .notEmpty()
      .withMessage('Feedback is required.')
      .isLength({ max: 3000 })
      .withMessage('Feedback cannot exceed 3000 characters.'),
    body('action')
      .isIn(['revision_requested', 'under_review'])
      .withMessage('Action must be "revision_requested" or "under_review".'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed.', errors: errors.array() });
    }

    try {
      const project = await ScriptProject.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found.' });
      }

      // Only the client can give feedback
      if (project.client.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Only the client can provide feedback.' });
      }

      if (project.status !== 'submitted' && project.status !== 'under_review') {
        return res.status(400).json({ success: false, message: `Cannot provide feedback when project is "${project.status}".` });
      }

      const { feedback, action } = req.body;

      // Update the latest submission's client response
      if (project.submissions.length > 0) {
        const latestSubmission = project.submissions[project.submissions.length - 1];
        latestSubmission.clientResponse = {
          status: action === 'revision_requested' ? 'revision_requested' : 'pending',
          feedback,
          respondedAt: new Date(),
        };
      }

      project.status = action;
      project.latestFeedback = feedback;
      project.activityLog.push({
        event: action === 'revision_requested' ? 'revision_requested' : 'started',
        by: req.user._id,
        at: new Date(),
        note: feedback.substring(0, 200),
      });

      // If revision requested, update the script status
      if (action === 'revision_requested' && project.linkedScript) {
        await Script.findByIdAndUpdate(project.linkedScript, { status: 'revision' });
      }

      await project.save();

      return res.json({
        success: true,
        message: action === 'revision_requested'
          ? 'Revision requested. The freelancer has been notified.'
          : 'Project marked as under review.',
        project: { _id: project._id, status: project.status },
      });
    } catch (err) {
      console.error('[Feedback ScriptProject Error]', err);
      return res.status(500).json({ success: false, message: 'Could not save feedback.' });
    }
  }
);

/* ─────────────────────────────────────────────────
   PATCH /api/script-projects/:id/accept
   Client accepts the submission and marks the project complete.
───────────────────────────────────────────────── */
router.patch(
  '/:id/accept',
  protect,
  [
    param('id').custom((id) => {
      if (!isValidObjectId(id)) throw new Error('Invalid project ID.');
      return true;
    }),
    body('feedback')
      .optional()
      .trim()
      .isLength({ max: 3000 })
      .withMessage('Feedback cannot exceed 3000 characters.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed.', errors: errors.array() });
    }

    try {
      const project = await ScriptProject.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found.' });
      }

      if (project.client.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Only the client can accept a submission.' });
      }

      if (!['submitted', 'under_review'].includes(project.status)) {
        return res.status(400).json({ success: false, message: `Cannot accept from status "${project.status}".` });
      }

      const { feedback } = req.body;

      // Update latest submission
      if (project.submissions.length > 0) {
        const latestSubmission = project.submissions[project.submissions.length - 1];
        latestSubmission.clientResponse = {
          status: 'accepted',
          feedback: feedback || '',
          respondedAt: new Date(),
        };
      }

      project.status = 'completed';
      project.latestFeedback = feedback || '';
      project.activityLog.push({
        event: 'completed',
        by: req.user._id,
        at: new Date(),
        note: feedback ? feedback.substring(0, 200) : 'Accepted.',
      });

      // Mark the script as completed
      if (project.linkedScript) {
        await Script.findByIdAndUpdate(project.linkedScript, { status: 'completed' });
      }

      await project.save();

      return res.json({
        success: true,
        message: 'Project accepted and marked as complete.',
        project: { _id: project._id, status: project.status },
      });
    } catch (err) {
      console.error('[Accept ScriptProject Error]', err);
      return res.status(500).json({ success: false, message: 'Could not accept submission.' });
    }
  }
);

export default router;
