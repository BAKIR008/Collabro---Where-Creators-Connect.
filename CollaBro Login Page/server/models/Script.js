/**
 * CollaBro — Script Model
 * server/models/Script.js
 *
 * Stores script-writing content for authenticated users.
 * Each script belongs to exactly one owner.
 * Scripts may optionally be linked to a ScriptProject (client assignment).
 */

import mongoose from 'mongoose';

const scriptSchema = new mongoose.Schema(
  {
    // Owner of this script
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Script metadata
    title: {
      type: String,
      required: [true, 'Script title is required.'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters.'],
      default: 'Untitled Script',
    },
    synopsis: {
      type: String,
      trim: true,
      maxlength: [2000, 'Synopsis cannot exceed 2000 characters.'],
      default: '',
    },
    genre: {
      type: String,
      trim: true,
      maxlength: [100, 'Genre cannot exceed 100 characters.'],
      default: '',
    },
    format: {
      type: String,
      enum: ['Feature', 'Pilot', 'Short Film', 'Docuseries', 'Limited Series', 'Stage Play', 'Web Series', 'Other', ''],
      default: '',
    },

    // The actual script content (plain text or structured screenplay format)
    content: {
      type: String,
      default: '',
      maxlength: [2000000, 'Script content is too long.'],
    },

    // Word count — computed and stored on each save
    wordCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Script lifecycle status
    status: {
      type: String,
      enum: ['draft', 'submitted', 'revision', 'completed'],
      default: 'draft',
    },

    // Visibility — private by default; scripts are never public unless explicitly published
    visibility: {
      type: String,
      enum: ['private', 'published'],
      default: 'private',
    },

    // Optional link to a client-assigned project
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ScriptProject',
      default: null,
      index: true,
    },

    // Version counter — incremented on each save to detect stale writes
    version: {
      type: Number,
      default: 1,
    },

    // Timestamp of the last successful server-side save
    lastSavedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Compound index for efficient per-user script listing
scriptSchema.index({ owner: 1, createdAt: -1 });
scriptSchema.index({ owner: 1, projectId: 1 });

const Script = mongoose.model('Script', scriptSchema);
export default Script;
