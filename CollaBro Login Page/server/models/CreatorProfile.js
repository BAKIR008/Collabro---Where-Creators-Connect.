/**
 * CollaBro — Creator Profile Model
 * server/models/CreatorProfile.js
 * 
 * Stores creator-specific information from onboarding survey.
 * One profile per user (1:1 relationship with User model).
 */

import mongoose from 'mongoose';

const creatorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    primaryRole: {
      type: String,
      required: true,
      index: true,
    },
    roles: [{
      type: String,
      required: true,
    }],
    customRole: {
      type: String,
      default: null,
      maxlength: [100, 'Custom role cannot exceed 100 characters'],
    },
    skills: [{
      type: String,
      maxlength: [50, 'Skill name cannot exceed 50 characters'],
    }],
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      required: true,
    },
    tools: [{
      type: String,
      maxlength: [50, 'Tool name cannot exceed 50 characters'],
    }],
    goals: [{
      type: String,
      enum: [
        'find-collaborators',
        'build-portfolio',
        'learn-skills',
        'earn-income',
        'network',
        'get-discovered',
      ],
    }],
    collaborationPreferences: {
      creatorRoles: [{
        type: String,
      }],
      projectTypes: [{
        type: String,
        maxlength: [50, 'Project type cannot exceed 50 characters'],
      }],
      duration: {
        type: String,
        enum: ['one-time', 'short-term', 'long-term', 'ongoing'],
      },
      workMode: {
        type: String,
        enum: ['remote', 'in-person', 'hybrid'],
      },
    },
    workPreferences: {
      categories: [{
        type: String,
        maxlength: [50, 'Category cannot exceed 50 characters'],
      }],
      industries: [{
        type: String,
        maxlength: [50, 'Industry cannot exceed 50 characters'],
      }],
      style: [{
        type: String,
        maxlength: [50, 'Style cannot exceed 50 characters'],
      }],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
creatorProfileSchema.index({ primaryRole: 1, createdAt: -1 });
creatorProfileSchema.index({ roles: 1 });
creatorProfileSchema.index({ 'collaborationPreferences.creatorRoles': 1 });

const CreatorProfile = mongoose.model('CreatorProfile', creatorProfileSchema);
export default CreatorProfile;
