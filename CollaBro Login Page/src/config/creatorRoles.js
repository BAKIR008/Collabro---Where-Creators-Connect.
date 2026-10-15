/**
 * Creator Roles Configuration — Frontend
 * src/config/creatorRoles.js
 *
 * Single source of truth for the 5 supported freelancer roles.
 * Must stay in sync with server/utils/creatorRoles.js.
 */

export const CREATOR_ROLES = [
  {
    id: 'video-editor',
    label: 'Video Editor',
    icon: '🎬',
    description: 'Transform raw footage into compelling narratives',
    category: 'video',
  },
  {
    id: 'content-creator',
    label: 'Content Creator',
    icon: '✨',
    description: 'Create multi-format content across platforms',
    category: 'content',
  },
  {
    id: 'thumbnail-maker',
    label: 'Thumbnail Maker',
    icon: '🖼️',
    description: 'Design eye-catching thumbnails that drive clicks',
    category: 'design',
  },
  {
    id: 'script-writer',
    label: 'Script Writer',
    icon: '✍️',
    description: 'Write compelling scripts for videos and content',
    category: 'content',
  },
  {
    id: 'photographer',
    label: 'Photographer',
    icon: '📷',
    description: 'Capture stunning visual moments',
    category: 'visual',
  },
];

/**
 * Skills pool mapped to each role.
 * Used by ExpertiseStep to show relevant skills after role selection.
 */
export const ROLE_SKILLS = {
  'video-editor': [
    'Adobe Premiere Pro', 'DaVinci Resolve', 'Final Cut Pro', 'After Effects',
    'Color Grading', 'Sound Design', 'Motion Graphics', 'CapCut',
    'Storytelling', 'Pacing & Cutting', 'VFX', 'Subtitles & Captions',
  ],
  'content-creator': [
    'YouTube', 'Instagram Reels', 'TikTok', 'Content Strategy',
    'Audience Growth', 'Scripting', 'Thumbnail Design', 'Analytics',
    'Brand Deals', 'Community Management', 'Viral Content', 'SEO',
  ],
  'thumbnail-maker': [
    'Photoshop', 'Canva', 'Figma', 'Midjourney',
    'Typography', 'Color Theory', 'Composition', 'A/B Testing',
    'Click-Through Rate Optimization', 'Image Retouching', 'Digital Illustration', 'Brand Identity',
  ],
  'script-writer': [
    'YouTube Scripts', 'Short-Form Scripts', 'Podcast Scripts', 'Narrative Storytelling',
    'Copywriting', 'SEO Writing', 'Hook Writing', 'Call-to-Action',
    'Research', 'Dialogue Writing', 'Voiceover Scripts', 'Video Essays',
  ],
  'photographer': [
    'Adobe Lightroom', 'Adobe Photoshop', 'Portrait Photography', 'Product Photography',
    'Event Photography', 'Photo Editing', 'Studio Lighting', 'Composition',
    'Street Photography', 'Real Estate Photography', 'Brand Photography', 'Drone Photography',
  ],
};

/**
 * Get role by ID
 */
export const getRoleById = (roleId) => {
  return CREATOR_ROLES.find((role) => role.id === roleId);
};

/**
 * Get all role IDs
 */
export const getAllRoleIds = () => {
  return CREATOR_ROLES.map((role) => role.id);
};

/**
 * Check if role ID is valid
 */
export const isValidRole = (roleId) => {
  return CREATOR_ROLES.some((role) => role.id === roleId);
};

/**
 * Role categories
 */
export const ROLE_CATEGORIES = {
  video: 'Video Production',
  content: 'Content Creation',
  design: 'Design',
  visual: 'Visual Arts',
};
