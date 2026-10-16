import express from 'express';
import { body, validationResult } from 'express-validator';
import Project from '../models/Project.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const projectFields = [
  body('title').trim().isLength({ min: 2, max: 80 }),
  body('description').optional().trim().isLength({ max: 3000 }),
  body('category').optional().trim().isLength({ min: 1, max: 50 }),
  body('status').optional().isIn(['Open', 'In progress', 'Completed']),
  body('coverImage').optional({ values: 'null' }).isString().isLength({ max: 950000 }),
  body('lookingFor').optional().trim().isLength({ max: 200 }),
  body('collaborators').optional().isArray({ max: 50 }),
  body('tasks').optional().isArray({ max: 100 }),
  body('tasks.*.title').optional().trim().isLength({ min: 1, max: 160 }),
  body('tasks.*.completed').optional().isBoolean(),
  body('referenceImages').optional().isArray({ max: 30 }),
  body('referenceImages.*').optional().isString().isLength({ max: 950000 }),
  body('notes').optional().trim().isLength({ max: 5000 }),
];
const editableFields = [
  'title', 'description', 'category', 'status', 'coverImage',
  'lookingFor', 'collaborators', 'tasks', 'referenceImages', 'notes',
];

function validateRequest(req, res) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return true;
  res.status(400).json({
    success: false,
    message: 'Please check the project details and try again.',
    errors: errors.array(),
  });
  return false;
}

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ creator: req.user._id })
      .populate('creator', 'name username profilePicture')
      .sort({ updatedAt: -1 });
    return res.json({ success: true, projects });
  } catch (err) {
    console.error('[List Projects Error]', err);
    return res.status(500).json({ success: false, message: 'Could not load your projects.' });
  }
});

router.post('/', projectFields, async (req, res) => {
  if (!validateRequest(req, res)) return;
  try {
    const project = await Project.create({ ...req.body, creator: req.user._id });
    await project.populate('creator', 'name username profilePicture');
    return res.status(201).json({ success: true, project });
  } catch (err) {
    console.error('[Create Project Error]', err);
    return res.status(500).json({ success: false, message: 'Could not create the project.' });
  }
});

router.get('/:projectId', async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.projectId, creator: req.user._id })
      .populate('creator', 'name username profilePicture');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    return res.json({ success: true, project });
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ success: false, message: 'Project not found.' });
    console.error('[Get Project Error]', err);
    return res.status(500).json({ success: false, message: 'Could not load this project.' });
  }
});

router.put('/:projectId', projectFields, async (req, res) => {
  if (!validateRequest(req, res)) return;
  try {
    const updates = Object.fromEntries(
      editableFields
        .filter((field) => Object.hasOwn(req.body, field))
        .map((field) => [field, req.body[field]])
    );
    const project = await Project.findOneAndUpdate(
      { _id: req.params.projectId, creator: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('creator', 'name username profilePicture');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    return res.json({ success: true, project });
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ success: false, message: 'Project not found.' });
    console.error('[Update Project Error]', err);
    return res.status(500).json({ success: false, message: 'Could not save the project.' });
  }
});

router.delete('/:projectId', async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.projectId, creator: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    return res.json({ success: true, message: 'Project deleted.' });
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ success: false, message: 'Project not found.' });
    console.error('[Delete Project Error]', err);
    return res.status(500).json({ success: false, message: 'Could not delete the project.' });
  }
});

export default router;
