/**
 * CollaBro — Scripts Routes
 * server/routes/scripts.js
 *
 * GET    /api/scripts              — List authenticated user's scripts
 * POST   /api/scripts              — Create a new script
 * GET    /api/scripts/:id          — Get a script (owner only)
 * PATCH  /api/scripts/:id          — Autosave / update script
 * DELETE /api/scripts/:id          — Delete a script (owner only)
 * GET    /api/scripts/:id/export   — Get script data for PDF export (owner only)
 */

import express from 'express';
import { body, validationResult, param } from 'express-validator';
import mongoose from 'mongoose';
import { protect } from '../middleware/auth.js';
import Script from '../models/Script.js';
import ScriptProject from '../models/ScriptProject.js';

const router = express.Router();

/* ─── Helpers ─── */

/**
 * Count words in plain text, excluding HTML tags and empty lines.
 */
function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  // Strip HTML tags if any
  const stripped = text.replace(/<[^>]*>/g, ' ');
  // Normalise whitespace and split
  const words = stripped.trim().split(/\s+/).filter((w) => w.length > 0);
  return words.length;
}

/**
 * Validate ObjectId format
 */
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/* ─────────────────────────────────────────────────
   GET /api/scripts
   List the authenticated user's scripts.
   Supports ?projectId= filter and ?page= / ?limit= pagination.
───────────────────────────────────────────────── */
router.get('/', protect, async (req, res) => {
  try {
    const { projectId, page = 1, limit = 50 } = req.query;
    const filter = { owner: req.user._id };

    if (projectId) {
      if (!isValidObjectId(projectId)) {
        return res.status(400).json({ success: false, message: 'Invalid project ID.' });
      }
      filter.projectId = projectId;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [scripts, total] = await Promise.all([
      Script.find(filter)
        .select('-content') // Exclude large content field from list
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Script.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      scripts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error('[Scripts List Error]', err);
    return res.status(500).json({ success: false, message: 'Could not load your scripts.' });
  }
});

/* ─────────────────────────────────────────────────
   POST /api/scripts
   Create a new script.
───────────────────────────────────────────────── */
router.post(
  '/',
  protect,
  [
    body('title')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters.'),
    body('synopsis')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Synopsis cannot exceed 2000 characters.'),
    body('genre')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Genre cannot exceed 100 characters.'),
    body('format')
      .optional()
      .isIn(['Feature', 'Pilot', 'Short Film', 'Docuseries', 'Limited Series', 'Stage Play', 'Web Series', 'Other', ''])
      .withMessage('Invalid format.'),
    body('content')
      .optional()
      .isString()
      .withMessage('Content must be a string.'),
    body('projectId')
      .optional({ values: 'null' })
      .custom((value) => {
        if (value && !isValidObjectId(value)) throw new Error('Invalid project ID.');
        return true;
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed.', errors: errors.array() });
    }

    try {
      const { title, synopsis, genre, format, content, projectId } = req.body;

      // If projectId provided, verify the user is the assigned freelancer
      if (projectId) {
        const project = await ScriptProject.findById(projectId);
        if (!project) {
          return res.status(404).json({ success: false, message: 'Project not found.' });
        }
        if (!project.freelancer || project.freelancer.toString() !== req.user._id.toString()) {
          return res.status(403).json({ success: false, message: 'You are not assigned to this project.' });
        }
        // Prevent duplicate scripts for the same project
        if (project.linkedScript) {
          const existing = await Script.findById(project.linkedScript);
          if (existing && existing.owner.toString() === req.user._id.toString()) {
            return res.status(409).json({
              success: false,
              message: 'A script for this project already exists.',
              scriptId: existing._id,
            });
          }
        }
      }

      const wordCount = countWords(content || '');
      const script = await Script.create({
        owner: req.user._id,
        title: title?.trim() || 'Untitled Script',
        synopsis: synopsis?.trim() || '',
        genre: genre?.trim() || '',
        format: format || '',
        content: content || '',
        wordCount,
        projectId: projectId || null,
        lastSavedAt: new Date(),
      });

      // Link script to project
      if (projectId) {
        await ScriptProject.findByIdAndUpdate(projectId, {
          linkedScript: script._id,
          status: 'in_progress',
          $push: {
            activityLog: {
              event: 'started',
              by: req.user._id,
              at: new Date(),
              note: 'Script created for project.',
            },
          },
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Script created.',
        script,
      });
    } catch (err) {
      console.error('[Create Script Error]', err);
      return res.status(500).json({ success: false, message: 'Could not create script.' });
    }
  }
);

/* ─────────────────────────────────────────────────
   GET /api/scripts/:id
   Retrieve a single script (owner only).
───────────────────────────────────────────────── */
router.get(
  '/:id',
  protect,
  [
    param('id').custom((id) => {
      if (!isValidObjectId(id)) throw new Error('Invalid script ID.');
      return true;
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Invalid script ID.' });
    }

    try {
      const script = await Script.findById(req.params.id);
      if (!script) {
        return res.status(404).json({ success: false, message: 'Script not found.' });
      }
      if (script.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Access denied.' });
      }
      return res.json({ success: true, script });
    } catch (err) {
      console.error('[Get Script Error]', err);
      return res.status(500).json({ success: false, message: 'Could not load script.' });
    }
  }
);

/* ─────────────────────────────────────────────────
   PATCH /api/scripts/:id
   Autosave / update a script.
   Supports optimistic concurrency via version field.
───────────────────────────────────────────────── */
router.patch(
  '/:id',
  protect,
  [
    param('id').custom((id) => {
      if (!isValidObjectId(id)) throw new Error('Invalid script ID.');
      return true;
    }),
    body('title')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters.'),
    body('synopsis')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Synopsis cannot exceed 2000 characters.'),
    body('genre')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Genre cannot exceed 100 characters.'),
    body('format')
      .optional()
      .isIn(['Feature', 'Pilot', 'Short Film', 'Docuseries', 'Limited Series', 'Stage Play', 'Web Series', 'Other', ''])
      .withMessage('Invalid format.'),
    body('content')
      .optional()
      .isString()
      .withMessage('Content must be a string.'),
    body('status')
      .optional()
      .isIn(['draft', 'submitted', 'revision', 'completed'])
      .withMessage('Invalid status.'),
    body('expectedVersion')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Expected version must be a positive integer.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed.', errors: errors.array() });
    }

    try {
      const script = await Script.findById(req.params.id);
      if (!script) {
        return res.status(404).json({ success: false, message: 'Script not found.' });
      }
      if (script.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Access denied.' });
      }

      // Optimistic concurrency check — prevent stale writes
      const { expectedVersion } = req.body;
      if (expectedVersion !== undefined && script.version !== expectedVersion) {
        return res.status(409).json({
          success: false,
          message: 'This script was updated elsewhere. Please reload and try again.',
          currentVersion: script.version,
        });
      }

      // Apply updates
      const { title, synopsis, genre, format, content, status } = req.body;
      if (title !== undefined) script.title = title.trim() || 'Untitled Script';
      if (synopsis !== undefined) script.synopsis = synopsis.trim();
      if (genre !== undefined) script.genre = genre.trim();
      if (format !== undefined) script.format = format;
      if (content !== undefined) {
        script.content = content;
        script.wordCount = countWords(content);
      }
      if (status !== undefined) script.status = status;

      script.version += 1;
      script.lastSavedAt = new Date();

      await script.save();

      return res.json({
        success: true,
        message: 'Script saved.',
        script: {
          _id: script._id,
          title: script.title,
          synopsis: script.synopsis,
          genre: script.genre,
          format: script.format,
          status: script.status,
          wordCount: script.wordCount,
          version: script.version,
          lastSavedAt: script.lastSavedAt,
          updatedAt: script.updatedAt,
        },
      });
    } catch (err) {
      console.error('[Update Script Error]', err);
      return res.status(500).json({ success: false, message: 'Could not save script.' });
    }
  }
);

/* ─────────────────────────────────────────────────
   DELETE /api/scripts/:id
   Delete a script (owner only, not if submitted).
───────────────────────────────────────────────── */
router.delete(
  '/:id',
  protect,
  [
    param('id').custom((id) => {
      if (!isValidObjectId(id)) throw new Error('Invalid script ID.');
      return true;
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Invalid script ID.' });
    }

    try {
      const script = await Script.findById(req.params.id);
      if (!script) {
        return res.status(404).json({ success: false, message: 'Script not found.' });
      }
      if (script.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Access denied.' });
      }
      if (script.status === 'submitted') {
        return res.status(400).json({
          success: false,
          message: 'Submitted scripts cannot be deleted. Contact the client to withdraw.',
        });
      }

      await Script.findByIdAndDelete(req.params.id);

      // Unlink from project if linked
      if (script.projectId) {
        await ScriptProject.findByIdAndUpdate(script.projectId, {
          linkedScript: null,
        });
      }

      return res.json({ success: true, message: 'Script deleted.' });
    } catch (err) {
      console.error('[Delete Script Error]', err);
      return res.status(500).json({ success: false, message: 'Could not delete script.' });
    }
  }
);

/* ─────────────────────────────────────────────────
   GET /api/scripts/:id/export
   Return script data for client-side PDF export (owner only).
   Does NOT serve a binary PDF — the client generates the PDF
   using the returned data. This enforces server-side auth.
───────────────────────────────────────────────── */
router.get(
  '/:id/export',
  protect,
  [
    param('id').custom((id) => {
      if (!isValidObjectId(id)) throw new Error('Invalid script ID.');
      return true;
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Invalid script ID.' });
    }

    try {
      const script = await Script.findById(req.params.id).lean();
      if (!script) {
        return res.status(404).json({ success: false, message: 'Script not found.' });
      }
      if (script.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Access denied.' });
      }
      if (!script.content || script.content.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'Cannot export an empty script.' });
      }

      return res.json({
        success: true,
        exportData: {
          title: script.title,
          synopsis: script.synopsis,
          genre: script.genre,
          format: script.format,
          content: script.content,
          wordCount: script.wordCount,
          author: req.user.name,
          exportedAt: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error('[Export Script Error]', err);
      return res.status(500).json({ success: false, message: 'Could not export script.' });
    }
  }
);

export default router;
