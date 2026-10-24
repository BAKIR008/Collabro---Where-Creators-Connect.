/**
 * CollaBro — Photography Project Model
 * server/models/PhotographyProject.js
 *
 * Client-assigned photography projects with full lifecycle tracking.
 * Distinct from the general collaboration Project model — this is for
 * professional client work assigned through CollaBro.
 *
 * Status lifecycle:
 *   new → accepted → in_progress → ready_for_review → submitted →
 *   revision_requested → completed | cancelled
 */

import mongoose from 'mongoose';

export const PROJECT_STATUSES = [
  'new',
  'accepted',
  'in_progress',
  'ready_for_review',
  'submitted',
  'revision_requested',
  'completed',
  'cancelled',
];

const STATUS_LABELS = {
  new: 'New',
  accepted: 'Accepted',
  in_progress: 'In Progress',
  ready_for_review: 'Ready for Review',
  submitted: 'Submitted',
  revision_requested: 'Revision Requested',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

/* ─── Progress step schema ─── */
const progressStepSchema = new mongoose.Schema(
  {
    stage: {
      type: String,
      enum: [
        'brief_reviewed',
        'shoot_planned',
        'photography_completed',
        'images_selected',
        'editing_in_progress',
        'final_images_prepared',
        'deliverables_submitted',
        'client_review_completed',
        'revisions_completed',
      ],
      required: true,
    },
    completed: { type: Boolean, default: false },
    note: { type: String, trim: true, maxlength: 500, default: '' },
    completedAt: { type: Date, default: null },
  },
  { _id: false }
);

/* ─── Reference image schema ─── */
const refImageSchema = new mongoose.Schema(
  { url: { type: String, maxlength: 2000 } },
  { _id: false }
);

/* ─── Activity log schema ─── */
const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['status_change', 'progress_update', 'submission', 'revision_request', 'note'],
    },
    description: { type: String, trim: true, maxlength: 500 },
    oldStatus: { type: String },
    newStatus: { type: String },
  },
  { timestamps: true }
);

const photographyProjectSchema = new mongoose.Schema(
  {
    // The photographer assigned to this project
    photographer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Optional: client user reference (may be external if not on CollaBro)
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // Denormalized client display info (for external clients or display convenience)
    clientName: { type: String, trim: true, maxlength: 100, default: '' },
    clientEmail: { type: String, trim: true, maxlength: 200, default: '' },

    title: {
      type: String,
      required: [true, 'Project title is required.'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters.'],
      maxlength: [120, 'Title cannot exceed 120 characters.'],
    },
    brief: {
      type: String,
      trim: true,
      maxlength: [5000, 'Brief cannot exceed 5000 characters.'],
      default: '',
    },
    deliverables: {
      type: String,
      trim: true,
      maxlength: [2000, 'Deliverables description cannot exceed 2000 characters.'],
      default: '',
    },
    category: {
      type: String,
      trim: true,
      maxlength: 80,
      default: 'Photography',
    },
    deadline: { type: Date, default: null },
    budget: { type: String, trim: true, maxlength: 100, default: '' },

    status: {
      type: String,
      enum: { values: PROJECT_STATUSES, message: 'Invalid project status.' },
      default: 'new',
      index: true,
    },

    // Reference images supplied by the client
    referenceImages: {
      type: [refImageSchema],
      validate: { validator: (a) => a.length <= 20, message: 'Max 20 reference images.' },
      default: [],
    },

    // Photography progress stages
    progress: {
      type: [progressStepSchema],
      default: () => [
        { stage: 'brief_reviewed', completed: false },
        { stage: 'shoot_planned', completed: false },
        { stage: 'photography_completed', completed: false },
        { stage: 'images_selected', completed: false },
        { stage: 'editing_in_progress', completed: false },
        { stage: 'final_images_prepared', completed: false },
        { stage: 'deliverables_submitted', completed: false },
        { stage: 'client_review_completed', completed: false },
        { stage: 'revisions_completed', completed: false },
      ],
    },

    // Last feedback or note from client
    latestClientFeedback: { type: String, trim: true, maxlength: 3000, default: '' },

    // Meaningful event log
    activity: { type: [activitySchema], default: [] },

    notes: { type: String, trim: true, maxlength: 5000, default: '' },
  },
  { timestamps: true }
);

photographyProjectSchema.index({ photographer: 1, status: 1, createdAt: -1 });

export const STATUS_LABEL_MAP = STATUS_LABELS;

const PhotographyProject = mongoose.model('PhotographyProject', photographyProjectSchema);
export default PhotographyProject;
