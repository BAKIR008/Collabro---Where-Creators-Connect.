/**
 * CollaBro — Creator Profile Model
 * server/models/CreatorProfile.js
 *
 * Stores creator-specific information from onboarding survey.
 * One profile per user (1:1 relationship with User model).
 * primaryRole is a single string from the 5 supported roles.
 */

import mongoose from 'mongoose';
import { VALID_ROLE_IDS } from '../utils/creatorRoles.js';

const creatorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    // 'freelancer' or 'client'
    accountType: {
      type: String,
      enum: ['freelancer', 'client'],
      required: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    // Freelancer-only fields
    primaryRole: {
      type: String,
      enum: {
        values: [...VALID_ROLE_IDS, null],
        message: 'Invalid role: {VALUE}',
      },
      default: null,
    },
    skills: [{
      type: String,
      maxlength: [50, 'Skill name cannot exceed 50 characters'],
    }],
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: null,
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
      creatorRoles: [{ type: String }],
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
      categories: [{ type: String, maxlength: [50] }],
      industries: [{ type: String, maxlength: [50] }],
      style: [{ type: String, maxlength: [50] }],
    },
    // Client-only fields
    clientNeeds: [{ type: String }],
    company: { type: String, maxlength: [100], default: '' },
    profileTitle: { type: String, maxlength: [100], default: '' },
    displayName: { type: String, maxlength: [100], default: '' },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
creatorProfileSchema.index({ primaryRole: 1, createdAt: -1 });
creatorProfileSchema.index({ accountType: 1 });

const CreatorProfile = mongoose.model('CreatorProfile', creatorProfileSchema);
export default CreatorProfile;
