/**
 * CollaBro — Photography Portfolio Model
 * server/models/PhotographyPortfolio.js
 *
 * Represents a photographer's portfolio collection.
 * Each collection has a category, multiple image items,
 * publication status, and a designated cover image.
 */

import mongoose from 'mongoose';

/* ─── Embedded image item schema ─── */
const imageItemSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },          // stored filename on disk
    url: { type: String, required: true },               // public URL e.g. /uploads/portfolio/…
    caption: { type: String, trim: true, maxlength: 300, default: '' },
    originalName: { type: String, trim: true, maxlength: 200, default: '' },
    mimeType: { type: String, maxlength: 30, default: 'image/jpeg' },
    sizeBytes: { type: Number, default: 0 },
  },
  { _id: true }
);

const PHOTOGRAPHY_CATEGORIES = [
  'Portrait', 'Wedding', 'Fashion', 'Product', 'Landscape',
  'Travel', 'Events', 'Street Photography', 'Architecture',
  'Food', 'Commercial', 'Editorial', 'Nature', 'Lifestyle', 'Other',
];

const portfolioSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Portfolio title is required.'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters.'],
      maxlength: [100, 'Title cannot exceed 100 characters.'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters.'],
      default: '',
    },
    category: {
      type: String,
      enum: { values: PHOTOGRAPHY_CATEGORIES, message: 'Invalid photography category.' },
      default: 'Other',
    },
    images: {
      type: [imageItemSchema],
      validate: {
        validator: (arr) => arr.length <= 50,
        message: 'A collection can contain at most 50 images.',
      },
      default: [],
    },
    // URL of the cover image (references one of images[].url or is null)
    coverImageUrl: { type: String, default: null },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* ─── Indexes ─── */
portfolioSchema.index({ owner: 1, createdAt: -1 });
portfolioSchema.index({ owner: 1, isPublished: 1 });

export const PORTFOLIO_CATEGORIES = PHOTOGRAPHY_CATEGORIES;
const PhotographyPortfolio = mongoose.model('PhotographyPortfolio', portfolioSchema);
export default PhotographyPortfolio;
