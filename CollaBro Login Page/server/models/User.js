/**
 * CollaBro — User Model
 * server/models/User.js
 * 
 * Supports BOTH local email+password AND Google OAuth authentication.
 * A single user can authenticate using multiple methods (account linking).
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    hashedPassword: {
      type: String,
      select: false,                             // never returned in queries by default
    },
    providers: {
      type: [String],
      enum: ['local', 'google'],
      default: [],
      required: true,
    },
    googleId: {
      type: String,
      default: null,
      sparse: true,                              // allow multiple null values
    },
    profilePicture: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['user', 'creator', 'admin'],
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,                            // adds createdAt & updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* ─── Hash password before saving ─── */
userSchema.pre('save', async function (next) {
  // only run this if password was modified
  if (!this.isModified('hashedPassword')) return next();
  if (!this.hashedPassword) return next();

  this.hashedPassword = await bcrypt.hash(this.hashedPassword, 12);
  next();
});

/* ─── Instance method: compare password ─── */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.hashedPassword);
};

/* ─── Instance method: safe public data ─── */
userSchema.methods.toPublic = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    profilePicture: this.profilePicture,
    role: this.role,
    providers: this.providers,
    isEmailVerified: this.isEmailVerified,
    createdAt: this.createdAt,
  };
};

/* ─── Instance method: check if user has specific provider ─── */
userSchema.methods.hasProvider = function (provider) {
  return this.providers.includes(provider);
};

/* ─── Instance method: add provider if not exists ─── */
userSchema.methods.addProvider = function (provider) {
  if (!this.hasProvider(provider)) {
    this.providers.push(provider);
  }
};

const User = mongoose.model('User', userSchema);
export default User;
