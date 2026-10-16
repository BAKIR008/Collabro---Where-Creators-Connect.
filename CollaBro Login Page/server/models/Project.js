import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required.'],
      trim: true,
      minlength: [2, 'Project title must be at least 2 characters.'],
      maxlength: [80, 'Project title cannot exceed 80 characters.'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [3000, 'Description cannot exceed 3000 characters.'],
      default: '',
    },
    category: { type: String, trim: true, maxlength: 50, default: 'Portrait' },
    status: {
      type: String,
      enum: ['Open', 'In progress', 'Completed'],
      default: 'Open',
    },
    coverImage: { type: String, default: null, maxlength: 950000 },
    lookingFor: { type: String, trim: true, maxlength: 200, default: '' },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    collaborators: [{
      name: { type: String, trim: true, maxlength: 50 },
      role: { type: String, trim: true, maxlength: 50 },
    }],
    tasks: [{
      title: { type: String, trim: true, required: true, maxlength: 160 },
      completed: { type: Boolean, default: false },
    }],
    referenceImages: [{ type: String, maxlength: 950000 }],
    notes: { type: String, trim: true, maxlength: 5000, default: '' },
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
