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
    accountType: {
      type: String,
      enum: ['client', 'freelancer'],
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    profileTitle: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    education: {
      type: String,
      maxlength: 200,
    },
    github: {
      type: String,
      match: [/^https:\/\/github\.com\/.+/, 'Invalid GitHub URL'],
    },
    linkedin: {
      type: String,
      match: [/^https:\/\/(www\.)?linkedin\.com\/.+/, 'Invalid LinkedIn URL'],
    },
    resume: {
      originalName: String,
      mimeType: String,
      size: Number,
      url: String,
      uploadedAt: Date,
    },
    company: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    clientNeeds: [{
      type: String,
      enum: ['find-freelancers','build-team','hire-for-project','find-skills','explore-creators']
    }],
    primaryRole: {
      type: String,
      enum: ['video-editor', 'content-creator', 'thumbnail-maker', 'script-writer', 'photographer'],
      index: true,
    },
    roles: [{
      type: String,
      enum: ['video-editor', 'content-creator', 'thumbnail-maker', 'script-writer', 'photographer'],
    }],
    skills: [{
      type: String,
      maxlength: [50, 'Skill name cannot exceed 50 characters'],
    }],
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert', 'professional'],
    },
    goals: [{
      type: String,
      enum: [
        'find-collaborators',
        'find-projects',
        'find-clients',
        'build-portfolio',
        'showcase-work',
        'get-discovered',
        'grow-network',
        'find-teams',
        'learn-skills',
        'earn-income',
      ],
    }],
    workMode: {
      type: String,
      enum: ['remote', 'hybrid', 'on-site'],
    },
    workStyle: {
      type: String,
      enum: ['flexible', 'structured', 'fast-paced', 'long-term', 'short-term'],
    },
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
        enum: ['one-time', 'short-term', 'long-term', 'ongoing', 'flexible'],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
creatorProfileSchema.index({ primaryRole: 1, createdAt: -1 });
creatorProfileSchema.index({ roles: 1 });

const CreatorProfile = mongoose.model('CreatorProfile', creatorProfileSchema);
export default CreatorProfile;
