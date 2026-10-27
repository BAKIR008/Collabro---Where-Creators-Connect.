/**
 * CollaBro — Project Submission Model
 * server/models/ProjectSubmission.js
 *
 * Tracks versioned deliverable submissions for client photography projects.
 * Each revision creates a new submission document — previous ones are preserved.
 */

import mongoose from 'mongoose';

const deliverableFileSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },        // stored filename on disk
    url: { type: String, required: true },             // public URL
    originalName: { type: String, trim: true, maxlength: 200, default: '' },
    mimeType: { type: String, maxlength: 30, default: 'image/jpeg' },
    sizeBytes: { type: Number, default: 0 },
  },
  { _id: true }
);

const submissionSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PhotographyProject',
      required: true,
      index: true,
    },
    photographer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Sequential version number per project (1, 2, 3 …)
    version: {
      type: Number,
      required: true,
      min: 1,
    },
    deliverables: {
      type: [deliverableFileSchema],
      validate: {
        validator: (arr) => arr.length > 0 && arr.length <= 50,
        message: 'A submission must include 1–50 deliverable files.',
      },
    },
    // Photographer's delivery note to the client
    note: {
      type: String,
      trim: true,
      maxlength: [3000, 'Delivery note cannot exceed 3000 characters.'],
      default: '',
    },
    // Review status set by client
    reviewStatus: {
      type: String,
      enum: ['pending', 'approved', 'revision_requested'],
      default: 'pending',
    },
    // Client feedback on this specific submission
    clientFeedback: {
      type: String,
      trim: true,
      maxlength: [3000, 'Client feedback cannot exceed 3000 characters.'],
      default: '',
    },
    feedbackAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Compound index: project + version uniqueness
submissionSchema.index({ project: 1, version: 1 }, { unique: true });
submissionSchema.index({ photographer: 1, createdAt: -1 });

const ProjectSubmission = mongoose.model('ProjectSubmission', submissionSchema);
export default ProjectSubmission;
