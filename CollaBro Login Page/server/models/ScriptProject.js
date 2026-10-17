/**
 * CollaBro — ScriptProject Model
 * server/models/ScriptProject.js
 *
 * Represents a client-assigned script writing project.
 * A client creates a project and assigns it to a freelancer (script-writer).
 * The freelancer writes a script linked to this project.
 * Submissions are tracked here.
 */

import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    // Snapshot of script content at submission time (immutable record)
    contentSnapshot: {
      type: String,
      default: '',
    },
    wordCount: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: { type: String, trim: true, maxlength: [1000, 'Note too long.'], default: '' },
    // Client response to this submission
    clientResponse: {
      status: {
        type: String,
        enum: ['pending', 'accepted', 'revision_requested'],
        default: 'pending',
      },
      feedback: { type: String, trim: true, maxlength: [3000, 'Feedback too long.'], default: '' },
      respondedAt: { type: Date, default: null },
    },
  },
  { _id: true }
);

const scriptProjectSchema = new mongoose.Schema(
  {
    // The client who created this project
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // The freelancer assigned to this project (set by client)
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },

    // Project details
    title: {
      type: String,
      required: [true, 'Project title is required.'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters.'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters.'],
      default: '',
    },
    brief: {
      type: String,
      trim: true,
      maxlength: [10000, 'Brief cannot exceed 10000 characters.'],
      default: '',
    },
    instructions: {
      type: String,
      trim: true,
      maxlength: [5000, 'Instructions cannot exceed 5000 characters.'],
      default: '',
    },

    // Format/genre guidance for the freelancer
    format: {
      type: String,
      enum: ['Feature', 'Pilot', 'Short Film', 'Docuseries', 'Limited Series', 'Stage Play', 'Web Series', 'Other', ''],
      default: '',
    },
    genre: {
      type: String,
      trim: true,
      maxlength: [100, 'Genre cannot exceed 100 characters.'],
      default: '',
    },

    // Optional target word count
    targetWordCount: {
      type: Number,
      default: null,
      min: 0,
    },

    // Deadline
    deadline: {
      type: Date,
      default: null,
    },

    // Project lifecycle
    status: {
      type: String,
      enum: [
        'open',           // Project created, waiting for freelancer to accept/start
        'in_progress',    // Freelancer is writing
        'submitted',      // Freelancer submitted, waiting for client review
        'under_review',   // Client is reviewing
        'revision_requested', // Client requested changes
        'completed',      // Accepted and done
      ],
      default: 'open',
    },

    // The script produced for this project (linked after freelancer creates it)
    linkedScript: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Script',
      default: null,
    },

    // Submission history
    submissions: [submissionSchema],

    // Latest client feedback (for quick access)
    latestFeedback: {
      type: String,
      trim: true,
      maxlength: [3000, 'Feedback cannot exceed 3000 characters.'],
      default: '',
    },

    // Activity log (simplified)
    activityLog: [
      {
        event: { type: String, enum: ['created', 'assigned', 'started', 'submitted', 'revision_requested', 'resubmitted', 'accepted', 'completed'] },
        by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        at: { type: Date, default: Date.now },
        note: { type: String, maxlength: [500], default: '' },
      }
    ],
  },
  {
    timestamps: true,
  }
);

scriptProjectSchema.index({ client: 1, createdAt: -1 });
scriptProjectSchema.index({ freelancer: 1, createdAt: -1 });
scriptProjectSchema.index({ status: 1 });

const ScriptProject = mongoose.model('ScriptProject', scriptProjectSchema);
export default ScriptProject;
