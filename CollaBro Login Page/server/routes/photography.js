/**
 * CollaBro — Photography API Routes
 * server/routes/photography.js
 *
 * All endpoints are protected and scoped to the authenticated photographer.
 * A photographer can only access their own portfolio, projects, and submissions.
 *
 * Endpoints:
 *   GET  /api/photography/dashboard            — stats overview
 *   GET  /api/photography/profile              — photographer profile
 *
 *   GET    /api/photography/portfolio           — list portfolio collections
 *   POST   /api/photography/portfolio           — create collection
 *   GET    /api/photography/portfolio/:id       — get collection
 *   PATCH  /api/photography/portfolio/:id       — update collection metadata
 *   DELETE /api/photography/portfolio/:id       — delete collection + files
 *   POST   /api/photography/portfolio/:id/images — upload images to collection
 *   DELETE /api/photography/portfolio/:id/images/:imageId — remove image
 *   PATCH  /api/photography/portfolio/:id/images/:imageId — update image caption
 *   PATCH  /api/photography/portfolio/:id/publish — toggle publish state
 *
 *   GET    /api/photography/projects            — list photography projects
 *   POST   /api/photography/projects            — create photography project
 *   GET    /api/photography/projects/:id        — get project details
 *   PATCH  /api/photography/projects/:id        — update project info/notes
 *   DELETE /api/photography/projects/:id        — delete project
 *   PATCH  /api/photography/projects/:id/status — update project status
 *   PATCH  /api/photography/projects/:id/progress — update progress step
 *
 *   GET    /api/photography/projects/:id/submissions — list submissions
 *   POST   /api/photography/projects/:id/submissions — create submission
 *   GET    /api/photography/projects/:id/submissions/:sid — get submission
 *   PATCH  /api/photography/projects/:id/submissions/:sid/feedback — add client feedback
 */

import express from 'express';
import { body, param, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import CreatorProfile from '../models/CreatorProfile.js';
import PhotographyPortfolio, { PORTFOLIO_CATEGORIES } from '../models/PhotographyPortfolio.js';
import PhotographyProject, { PROJECT_STATUSES } from '../models/PhotographyProject.js';
import ProjectSubmission from '../models/ProjectSubmission.js';
import {
  portfolioUpload,
  deliverablesUpload,
  portfolioImageUrl,
  deliverableFileUrl,
  deleteUploadByUrl,
} from '../utils/portfolioUpload.js';

const router = express.Router();

/* ─── All routes require authentication ─── */
router.use(protect);

/* ─── Validation helpers ─── */
function handleValidation(req, res) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return true;
  res.status(400).json({
    success: false,
    message: 'Please check your input and try again.',
    errors: errors.array(),
  });
  return false;
}

function isValidObjectId(id) {
  return mongoose.isValidObjectId(id);
}

function notFound(res, entity = 'Resource') {
  return res.status(404).json({ success: false, message: `${entity} not found.` });
}

function forbidden(res) {
  return res.status(403).json({ success: false, message: 'Access denied.' });
}

/* ─────────────────────────────────────────────────────────────
   DASHBOARD STATS
─────────────────────────────────────────────────────────────── */

// GET /api/photography/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const uid = req.user._id;

    const [portfolioCount, publishedCollections, totalImages, projectStats, pendingSubmissions] =
      await Promise.all([
        PhotographyPortfolio.countDocuments({ owner: uid }),
        PhotographyPortfolio.countDocuments({ owner: uid, isPublished: true }),
        PhotographyPortfolio.aggregate([
          { $match: { owner: uid } },
          { $project: { count: { $size: '$images' } } },
          { $group: { _id: null, total: { $sum: '$count' } } },
        ]),
        PhotographyProject.aggregate([
          { $match: { photographer: uid } },
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
        ProjectSubmission.countDocuments({ photographer: uid, reviewStatus: 'pending' }),
      ]);

    // Build status map
    const statusMap = {};
    for (const s of projectStats) statusMap[s._id] = s.count;

    const activeProjects = (statusMap.new || 0)
      + (statusMap.accepted || 0)
      + (statusMap.in_progress || 0)
      + (statusMap.ready_for_review || 0);

    res.json({
      success: true,
      stats: {
        portfolioCollections: portfolioCount,
        publishedCollections,
        totalPortfolioImages: totalImages[0]?.total || 0,
        activeProjects,
        projectsAwaitingAction: (statusMap.new || 0) + (statusMap.revision_requested || 0),
        submittedProjects: statusMap.submitted || 0,
        completedProjects: statusMap.completed || 0,
        pendingRevisions: statusMap.revision_requested || 0,
        pendingSubmissionReviews: pendingSubmissions,
        byStatus: statusMap,
      },
    });
  } catch (err) {
    console.error('[Photography Dashboard Stats Error]', err);
    res.status(500).json({ success: false, message: 'Could not load dashboard statistics.' });
  }
});

/* ─────────────────────────────────────────────────────────────
   PROFILE
─────────────────────────────────────────────────────────────── */

// GET /api/photography/profile
router.get('/profile', async (req, res) => {
  try {
    const [user, profile] = await Promise.all([
      User.findById(req.user._id).select('-hashedPassword -passwordResetToken -emailVerificationToken'),
      CreatorProfile.findOne({ user: req.user._id }),
    ]);

    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    res.json({
      success: true,
      profile: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: profile?.bio || user.bio || '',
        profilePicture: user.profilePicture,
        role: user.role,
        interests: user.interests,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        onboardingStatus: user.onboarding?.status,
        // Creator profile fields
        accountType: profile?.accountType,
        primaryRole: profile?.primaryRole,
        displayName: profile?.displayName,
        profileTitle: profile?.profileTitle,
        skills: profile?.skills || [],
        experienceLevel: profile?.experienceLevel,
        tools: profile?.tools || [],
        goals: profile?.goals || [],
        workPreferences: profile?.workPreferences,
        collaborationPreferences: profile?.collaborationPreferences,
        company: profile?.company,
      },
    });
  } catch (err) {
    console.error('[Photography Profile Error]', err);
    res.status(500).json({ success: false, message: 'Could not load profile.' });
  }
});

// PATCH /api/photography/profile
router.patch('/profile', async (req, res) => {
  try {
    const { name, displayName, bio, profileTitle, skills, tools, experienceLevel } = req.body;

    if (name && typeof name === 'string') {
      await User.findByIdAndUpdate(req.user._id, { name: name.trim().slice(0, 100) });
    }

    const updates = {};
    if (displayName !== undefined) updates.displayName = String(displayName).trim().slice(0, 100);
    if (bio !== undefined) updates.bio = String(bio).trim().slice(0, 500);
    if (profileTitle !== undefined) updates.profileTitle = String(profileTitle).trim().slice(0, 100);
    if (Array.isArray(skills)) updates.skills = skills.map((s) => String(s).trim().slice(0, 50)).filter(Boolean);
    if (Array.isArray(tools)) updates.tools = tools.map((t) => String(t).trim().slice(0, 50)).filter(Boolean);
    if (experienceLevel !== undefined) updates.experienceLevel = experienceLevel;

    let profile = await CreatorProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = await CreatorProfile.create({
        user: req.user._id,
        accountType: 'freelancer',
        primaryRole: 'photographer',
        ...updates,
      });
    } else {
      profile = await CreatorProfile.findOneAndUpdate(
        { user: req.user._id },
        { $set: updates },
        { new: true }
      );
    }

    const updatedUser = await User.findById(req.user._id).select('-hashedPassword');

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      profile: {
        id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        bio: profile?.bio || updatedUser.bio || '',
        profilePicture: updatedUser.profilePicture,
        role: updatedUser.role,
        displayName: profile?.displayName || updatedUser.name,
        profileTitle: profile?.profileTitle || '',
        skills: profile?.skills || [],
        experienceLevel: profile?.experienceLevel,
        tools: profile?.tools || [],
      },
    });
  } catch (err) {
    console.error('[Photography Profile Update Error]', err);
    res.status(500).json({ success: false, message: 'Could not update profile.' });
  }
});


/* ─────────────────────────────────────────────────────────────
   PORTFOLIO COLLECTIONS
─────────────────────────────────────────────────────────────── */

// GET /api/photography/portfolio
router.get('/portfolio', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [collections, total] = await Promise.all([
      PhotographyPortfolio.find({ owner: req.user._id })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-images.filename'), // omit internal filenames from list
      PhotographyPortfolio.countDocuments({ owner: req.user._id }),
    ]);

    res.json({
      success: true,
      collections,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('[List Portfolio Error]', err);
    res.status(500).json({ success: false, message: 'Could not load portfolio collections.' });
  }
});

// POST /api/photography/portfolio
router.post(
  '/portfolio',
  [
    body('title').trim().isLength({ min: 2, max: 100 }).withMessage('Title must be 2–100 characters.'),
    body('description').optional().trim().isLength({ max: 1000 }),
    body('category').optional().isIn(PORTFOLIO_CATEGORIES).withMessage('Invalid category.'),
    body('isPublished').optional().isBoolean(),
  ],
  async (req, res) => {
    if (!handleValidation(req, res)) return;
    try {
      const { title, description, category, isPublished } = req.body;
      const collection = await PhotographyPortfolio.create({
        owner: req.user._id,
        title: title.trim(),
        description: (description || '').trim(),
        category: category || 'Other',
        isPublished: Boolean(isPublished),
      });
      res.status(201).json({ success: true, collection });
    } catch (err) {
      console.error('[Create Portfolio Error]', err);
      res.status(500).json({ success: false, message: 'Could not create portfolio collection.' });
    }
  }
);

// GET /api/photography/portfolio/:id
router.get('/portfolio/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) return notFound(res, 'Collection');
  try {
    const collection = await PhotographyPortfolio.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!collection) return notFound(res, 'Collection');
    res.json({ success: true, collection });
  } catch (err) {
    console.error('[Get Portfolio Error]', err);
    res.status(500).json({ success: false, message: 'Could not load this collection.' });
  }
});

// PATCH /api/photography/portfolio/:id — update metadata only
router.patch(
  '/portfolio/:id',
  [
    body('title').optional().trim().isLength({ min: 2, max: 100 }),
    body('description').optional().trim().isLength({ max: 1000 }),
    body('category').optional().isIn(PORTFOLIO_CATEGORIES),
    body('coverImageUrl').optional({ nullable: true }).isString(),
  ],
  async (req, res) => {
    if (!isValidObjectId(req.params.id)) return notFound(res, 'Collection');
    if (!handleValidation(req, res)) return;
    try {
      const allowed = ['title', 'description', 'category', 'coverImageUrl'];
      const updates = Object.fromEntries(
        allowed.filter((k) => k in req.body).map((k) => [k, req.body[k]])
      );
      const collection = await PhotographyPortfolio.findOneAndUpdate(
        { _id: req.params.id, owner: req.user._id },
        { $set: updates },
        { new: true, runValidators: true }
      );
      if (!collection) return notFound(res, 'Collection');
      res.json({ success: true, collection });
    } catch (err) {
      console.error('[Update Portfolio Error]', err);
      res.status(500).json({ success: false, message: 'Could not update this collection.' });
    }
  }
);

// DELETE /api/photography/portfolio/:id
router.delete('/portfolio/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) return notFound(res, 'Collection');
  try {
    const collection = await PhotographyPortfolio.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!collection) return notFound(res, 'Collection');
    // Clean up stored files
    for (const img of collection.images) deleteUploadByUrl(img.url);
    res.json({ success: true, message: 'Collection deleted.' });
  } catch (err) {
    console.error('[Delete Portfolio Error]', err);
    res.status(500).json({ success: false, message: 'Could not delete this collection.' });
  }
});

// PATCH /api/photography/portfolio/:id/publish — toggle publish state
router.patch('/portfolio/:id/publish', async (req, res) => {
  if (!isValidObjectId(req.params.id)) return notFound(res, 'Collection');
  try {
    const collection = await PhotographyPortfolio.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!collection) return notFound(res, 'Collection');
    collection.isPublished = !collection.isPublished;
    await collection.save();
    res.json({
      success: true,
      isPublished: collection.isPublished,
      collection,
      message: collection.isPublished ? 'Collection published.' : 'Collection unpublished.',
    });
  } catch (err) {
    console.error('[Publish Portfolio Error]', err);
    res.status(500).json({ success: false, message: 'Could not update publish state.' });
  }
});

// POST /api/photography/portfolio/:id/images — upload images (multipart)
router.post(
  '/portfolio/:id/images',
  (req, res, next) => {
    if (!isValidObjectId(req.params.id)) return notFound(res, 'Collection');
    portfolioUpload.array('images', 20)(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.files?.length) {
        return res.status(400).json({ success: false, message: 'No image files provided.' });
      }

      const collection = await PhotographyPortfolio.findOne({
        _id: req.params.id,
        owner: req.user._id,
      });
      if (!collection) {
        // Clean up uploaded files if collection not found
        for (const f of req.files) deleteUploadByUrl(portfolioImageUrl(f.filename));
        return notFound(res, 'Collection');
      }

      if (collection.images.length + req.files.length > 50) {
        for (const f of req.files) deleteUploadByUrl(portfolioImageUrl(f.filename));
        return res.status(400).json({
          success: false,
          message: `Adding ${req.files.length} images would exceed the 50-image limit.`,
        });
      }

      // Build captions map from body (e.g. captions[0], captions[1])
      const captions = req.body.captions || {};

      const newImages = req.files.map((file, index) => ({
        filename: file.filename,
        url: portfolioImageUrl(file.filename),
        caption: (typeof captions === 'object' ? captions[String(index)] : '') || '',
        originalName: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
      }));

      collection.images.push(...newImages);

      // Auto-set cover if not already set
      if (!collection.coverImageUrl && newImages.length > 0) {
        collection.coverImageUrl = newImages[0].url;
      }

      await collection.save();
      res.status(201).json({ success: true, collection, addedImages: newImages });
    } catch (err) {
      console.error('[Upload Portfolio Images Error]', err);
      res.status(500).json({ success: false, message: 'Could not upload images.' });
    }
  }
);

// DELETE /api/photography/portfolio/:id/images/:imageId
router.delete('/portfolio/:id/images/:imageId', async (req, res) => {
  if (!isValidObjectId(req.params.id) || !isValidObjectId(req.params.imageId)) {
    return notFound(res, 'Image');
  }
  try {
    const collection = await PhotographyPortfolio.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!collection) return notFound(res, 'Collection');

    const image = collection.images.id(req.params.imageId);
    if (!image) return notFound(res, 'Image');

    const imageUrl = image.url;

    // If this was the cover, clear it
    if (collection.coverImageUrl === imageUrl) {
      const remaining = collection.images.filter((img) => img._id.toString() !== req.params.imageId);
      collection.coverImageUrl = remaining.length > 0 ? remaining[0].url : null;
    }

    image.deleteOne();
    await collection.save();

    // Delete the physical file
    deleteUploadByUrl(imageUrl);

    res.json({ success: true, message: 'Image removed.', collection });
  } catch (err) {
    console.error('[Delete Portfolio Image Error]', err);
    res.status(500).json({ success: false, message: 'Could not remove this image.' });
  }
});

// PATCH /api/photography/portfolio/:id/images/:imageId — update caption
router.patch(
  '/portfolio/:id/images/:imageId',
  [body('caption').optional().trim().isLength({ max: 300 })],
  async (req, res) => {
    if (!isValidObjectId(req.params.id) || !isValidObjectId(req.params.imageId)) {
      return notFound(res, 'Image');
    }
    if (!handleValidation(req, res)) return;
    try {
      const collection = await PhotographyPortfolio.findOne({
        _id: req.params.id,
        owner: req.user._id,
      });
      if (!collection) return notFound(res, 'Collection');

      const image = collection.images.id(req.params.imageId);
      if (!image) return notFound(res, 'Image');

      if (req.body.caption !== undefined) image.caption = req.body.caption.trim();
      await collection.save();
      res.json({ success: true, image, collection });
    } catch (err) {
      console.error('[Update Image Caption Error]', err);
      res.status(500).json({ success: false, message: 'Could not update caption.' });
    }
  }
);

/* ─────────────────────────────────────────────────────────────
   PHOTOGRAPHY PROJECTS (CLIENT ASSIGNMENTS)
─────────────────────────────────────────────────────────────── */

const projectBodyValidators = [
  body('title').trim().isLength({ min: 2, max: 120 }).withMessage('Title must be 2–120 characters.'),
  body('brief').optional().trim().isLength({ max: 5000 }),
  body('deliverables').optional().trim().isLength({ max: 2000 }),
  body('category').optional().trim().isLength({ max: 80 }),
  body('deadline').optional({ nullable: true }).isISO8601().withMessage('Invalid deadline date.'),
  body('budget').optional().trim().isLength({ max: 100 }),
  body('clientName').optional().trim().isLength({ max: 100 }),
  body('clientEmail').optional().trim().isEmail().withMessage('Invalid client email.'),
  body('notes').optional().trim().isLength({ max: 5000 }),
];

// GET /api/photography/projects
router.get('/projects', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const filter = { photographer: req.user._id };
    if (req.query.status && PROJECT_STATUSES.includes(req.query.status)) {
      filter.status = req.query.status;
    }

    const [projects, total] = await Promise.all([
      PhotographyProject.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('client', 'name username profilePicture'),
      PhotographyProject.countDocuments(filter),
    ]);

    res.json({
      success: true,
      projects,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('[List Photography Projects Error]', err);
    res.status(500).json({ success: false, message: 'Could not load projects.' });
  }
});

// POST /api/photography/projects
router.post('/projects', projectBodyValidators, async (req, res) => {
  if (!handleValidation(req, res)) return;
  try {
    const {
      title, brief, deliverables, category, deadline,
      budget, clientName, clientEmail, notes,
    } = req.body;

    const project = await PhotographyProject.create({
      photographer: req.user._id,
      title: title.trim(),
      brief: (brief || '').trim(),
      deliverables: (deliverables || '').trim(),
      category: (category || 'Photography').trim(),
      deadline: deadline || null,
      budget: (budget || '').trim(),
      clientName: (clientName || '').trim(),
      clientEmail: (clientEmail || '').trim(),
      notes: (notes || '').trim(),
      activity: [{
        type: 'status_change',
        description: 'Project created.',
        newStatus: 'new',
      }],
    });

    res.status(201).json({ success: true, project });
  } catch (err) {
    console.error('[Create Photography Project Error]', err);
    res.status(500).json({ success: false, message: 'Could not create project.' });
  }
});

// GET /api/photography/projects/:id
router.get('/projects/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) return notFound(res, 'Project');
  try {
    const project = await PhotographyProject.findOne({
      _id: req.params.id,
      photographer: req.user._id,
    }).populate('client', 'name username profilePicture');
    if (!project) return notFound(res, 'Project');
    res.json({ success: true, project });
  } catch (err) {
    console.error('[Get Photography Project Error]', err);
    res.status(500).json({ success: false, message: 'Could not load project.' });
  }
});

// PATCH /api/photography/projects/:id — update text fields
router.patch(
  '/projects/:id',
  [
    body('title').optional().trim().isLength({ min: 2, max: 120 }),
    body('brief').optional().trim().isLength({ max: 5000 }),
    body('deliverables').optional().trim().isLength({ max: 2000 }),
    body('category').optional().trim().isLength({ max: 80 }),
    body('deadline').optional({ nullable: true }).isISO8601(),
    body('budget').optional().trim().isLength({ max: 100 }),
    body('clientName').optional().trim().isLength({ max: 100 }),
    body('clientEmail').optional().trim().isEmail(),
    body('notes').optional().trim().isLength({ max: 5000 }),
  ],
  async (req, res) => {
    if (!isValidObjectId(req.params.id)) return notFound(res, 'Project');
    if (!handleValidation(req, res)) return;
    try {
      const allowed = [
        'title', 'brief', 'deliverables', 'category', 'deadline',
        'budget', 'clientName', 'clientEmail', 'notes',
      ];
      const updates = Object.fromEntries(
        allowed.filter((k) => k in req.body).map((k) => [k, req.body[k]])
      );
      const project = await PhotographyProject.findOneAndUpdate(
        { _id: req.params.id, photographer: req.user._id },
        { $set: updates },
        { new: true, runValidators: true }
      );
      if (!project) return notFound(res, 'Project');
      res.json({ success: true, project });
    } catch (err) {
      console.error('[Update Photography Project Error]', err);
      res.status(500).json({ success: false, message: 'Could not update project.' });
    }
  }
);

// DELETE /api/photography/projects/:id
router.delete('/projects/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) return notFound(res, 'Project');
  try {
    const project = await PhotographyProject.findOneAndDelete({
      _id: req.params.id,
      photographer: req.user._id,
    });
    if (!project) return notFound(res, 'Project');

    // Also delete all submissions for this project
    const submissions = await ProjectSubmission.find({ project: req.params.id });
    for (const sub of submissions) {
      for (const d of sub.deliverables) deleteUploadByUrl(d.url);
    }
    await ProjectSubmission.deleteMany({ project: req.params.id });

    res.json({ success: true, message: 'Project and all submissions deleted.' });
  } catch (err) {
    console.error('[Delete Photography Project Error]', err);
    res.status(500).json({ success: false, message: 'Could not delete project.' });
  }
});

// PATCH /api/photography/projects/:id/status — advance status
router.patch(
  '/projects/:id/status',
  [
    body('status')
      .isIn(PROJECT_STATUSES)
      .withMessage(`Status must be one of: ${PROJECT_STATUSES.join(', ')}`),
  ],
  async (req, res) => {
    if (!isValidObjectId(req.params.id)) return notFound(res, 'Project');
    if (!handleValidation(req, res)) return;
    try {
      const { status } = req.body;
      const project = await PhotographyProject.findOne({
        _id: req.params.id,
        photographer: req.user._id,
      });
      if (!project) return notFound(res, 'Project');

      const oldStatus = project.status;
      project.status = status;
      project.activity.push({
        type: 'status_change',
        description: `Status changed from "${oldStatus}" to "${status}".`,
        oldStatus,
        newStatus: status,
      });
      await project.save();
      res.json({ success: true, project });
    } catch (err) {
      console.error('[Update Project Status Error]', err);
      res.status(500).json({ success: false, message: 'Could not update status.' });
    }
  }
);

// PATCH /api/photography/projects/:id/progress — update a progress step
router.patch(
  '/projects/:id/progress',
  [
    body('stage').isString().notEmpty(),
    body('completed').isBoolean(),
    body('note').optional().trim().isLength({ max: 500 }),
  ],
  async (req, res) => {
    if (!isValidObjectId(req.params.id)) return notFound(res, 'Project');
    if (!handleValidation(req, res)) return;
    try {
      const { stage, completed, note } = req.body;
      const project = await PhotographyProject.findOne({
        _id: req.params.id,
        photographer: req.user._id,
      });
      if (!project) return notFound(res, 'Project');

      const step = project.progress.find((p) => p.stage === stage);
      if (!step) {
        return res.status(400).json({ success: false, message: `Unknown progress stage: ${stage}` });
      }

      step.completed = Boolean(completed);
      step.note = (note || '').trim();
      step.completedAt = completed ? new Date() : null;

      project.activity.push({
        type: 'progress_update',
        description: `Progress step "${stage}" marked ${completed ? 'complete' : 'incomplete'}.`,
      });

      await project.save();
      res.json({ success: true, project });
    } catch (err) {
      console.error('[Update Progress Error]', err);
      res.status(500).json({ success: false, message: 'Could not update progress.' });
    }
  }
);

/* ─────────────────────────────────────────────────────────────
   PROJECT SUBMISSIONS
─────────────────────────────────────────────────────────────── */

// GET /api/photography/projects/:id/submissions
router.get('/projects/:id/submissions', async (req, res) => {
  if (!isValidObjectId(req.params.id)) return notFound(res, 'Project');
  try {
    // Verify ownership
    const project = await PhotographyProject.findOne({
      _id: req.params.id,
      photographer: req.user._id,
    });
    if (!project) return notFound(res, 'Project');

    const submissions = await ProjectSubmission.find({ project: req.params.id })
      .sort({ version: -1 });

    res.json({ success: true, submissions });
  } catch (err) {
    console.error('[List Submissions Error]', err);
    res.status(500).json({ success: false, message: 'Could not load submissions.' });
  }
});

// POST /api/photography/projects/:id/submissions — upload deliverables
router.post(
  '/projects/:id/submissions',
  (req, res, next) => {
    if (!isValidObjectId(req.params.id)) return notFound(res, 'Project');
    deliverablesUpload.array('deliverables', 50)(req, res, (err) => {
      if (err) return res.status(400).json({ success: false, message: err.message });
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.files?.length) {
        return res.status(400).json({ success: false, message: 'At least one deliverable file is required.' });
      }

      // Verify project ownership
      const project = await PhotographyProject.findOne({
        _id: req.params.id,
        photographer: req.user._id,
      });
      if (!project) {
        for (const f of req.files) deleteUploadByUrl(deliverableFileUrl(f.filename));
        return notFound(res, 'Project');
      }

      // Determine next version number
      const lastSubmission = await ProjectSubmission.findOne({ project: req.params.id })
        .sort({ version: -1 })
        .select('version');
      const nextVersion = (lastSubmission?.version || 0) + 1;

      const deliverableItems = req.files.map((file) => ({
        filename: file.filename,
        url: deliverableFileUrl(file.filename),
        originalName: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
      }));

      const note = (req.body.note || '').trim().slice(0, 3000);

      const submission = await ProjectSubmission.create({
        project: req.params.id,
        photographer: req.user._id,
        version: nextVersion,
        deliverables: deliverableItems,
        note,
      });

      // Advance project status to submitted
      const oldStatus = project.status;
      project.status = 'submitted';
      project.activity.push({
        type: 'submission',
        description: `Submission v${nextVersion} delivered with ${req.files.length} file(s).`,
        oldStatus,
        newStatus: 'submitted',
      });
      await project.save();

      res.status(201).json({ success: true, submission, project });
    } catch (err) {
      console.error('[Create Submission Error]', err);
      // Clean up uploaded files on failure
      if (req.files) {
        for (const f of req.files) deleteUploadByUrl(deliverableFileUrl(f.filename));
      }
      res.status(500).json({ success: false, message: 'Could not create submission.' });
    }
  }
);

// GET /api/photography/projects/:id/submissions/:sid
router.get('/projects/:id/submissions/:sid', async (req, res) => {
  if (!isValidObjectId(req.params.id) || !isValidObjectId(req.params.sid)) {
    return notFound(res, 'Submission');
  }
  try {
    const project = await PhotographyProject.findOne({
      _id: req.params.id,
      photographer: req.user._id,
    });
    if (!project) return notFound(res, 'Project');

    const submission = await ProjectSubmission.findOne({
      _id: req.params.sid,
      project: req.params.id,
    });
    if (!submission) return notFound(res, 'Submission');
    res.json({ success: true, submission });
  } catch (err) {
    console.error('[Get Submission Error]', err);
    res.status(500).json({ success: false, message: 'Could not load submission.' });
  }
});

// PATCH /api/photography/projects/:id/submissions/:sid/feedback — client feedback
router.patch(
  '/projects/:id/submissions/:sid/feedback',
  [
    body('reviewStatus')
      .isIn(['approved', 'revision_requested'])
      .withMessage('reviewStatus must be "approved" or "revision_requested".'),
    body('clientFeedback').optional().trim().isLength({ max: 3000 }),
  ],
  async (req, res) => {
    if (!isValidObjectId(req.params.id) || !isValidObjectId(req.params.sid)) {
      return notFound(res, 'Submission');
    }
    if (!handleValidation(req, res)) return;
    try {
      // The photographer manages feedback on behalf of the client workflow
      const project = await PhotographyProject.findOne({
        _id: req.params.id,
        photographer: req.user._id,
      });
      if (!project) return forbidden(res);

      const submission = await ProjectSubmission.findOneAndUpdate(
        { _id: req.params.sid, project: req.params.id },
        {
          $set: {
            reviewStatus: req.body.reviewStatus,
            clientFeedback: (req.body.clientFeedback || '').trim(),
            feedbackAt: new Date(),
          },
        },
        { new: true, runValidators: true }
      );
      if (!submission) return notFound(res, 'Submission');

      // Update project status based on review outcome
      const newProjectStatus =
        req.body.reviewStatus === 'approved' ? 'completed' : 'revision_requested';
      const oldStatus = project.status;
      project.status = newProjectStatus;
      project.latestClientFeedback = (req.body.clientFeedback || '').trim();
      project.activity.push({
        type: req.body.reviewStatus === 'approved' ? 'status_change' : 'revision_request',
        description:
          req.body.reviewStatus === 'approved'
            ? 'Client approved the submission. Project completed.'
            : 'Client requested revisions.',
        oldStatus,
        newStatus: newProjectStatus,
      });
      await project.save();

      res.json({ success: true, submission, project });
    } catch (err) {
      console.error('[Add Feedback Error]', err);
      res.status(500).json({ success: false, message: 'Could not record feedback.' });
    }
  }
);

export default router;
