/**
 * CollaBro — Creator Roles Catalogue
 * server/utils/creatorRoles.js
 * 
 * Centralized creator roles configuration.
 * Stable IDs ensure database consistency across label changes.
 */

export const CREATOR_ROLES = [
  {
    id: 'video-editor',
    label: 'Video Editor',
    icon: '🎬',
    description: 'Edit videos, reels, shorts, and long-form content',
  },
  {
    id: 'content-writer',
    label: 'Content Writer',
    icon: '✍️',
    description: 'Create articles, scripts, captions, and written content',
  },
  {
    id: 'graphic-designer',
    label: 'Graphic Designer',
    icon: '🎨',
    description: 'Create visual designs, branding, and graphics',
  },
  {
    id: 'thumbnail-designer',
    label: 'Thumbnail Designer',
    icon: '🖼️',
    description: 'Design thumbnails for videos and social platforms',
  },
  {
    id: 'ui-ux-designer',
    label: 'UI/UX Designer',
    icon: '📱',
    description: 'Design user interfaces and digital experiences',
  },
  {
    id: 'photographer',
    label: 'Photographer',
    icon: '📷',
    description: 'Capture and edit photographs',
  },
  {
    id: 'videographer',
    label: 'Videographer',
    icon: '🎥',
    description: 'Record video content and visual stories',
  },
  {
    id: 'animator',
    label: 'Animator',
    icon: '🎞️',
    description: 'Create motion graphics and animations',
  },
  {
    id: 'illustrator',
    label: 'Illustrator',
    icon: '🖌️',
    description: 'Create illustrations and digital artwork',
  },
  {
    id: 'social-media-manager',
    label: 'Social Media Manager',
    icon: '📱',
    description: 'Plan, manage, and analyze social media content',
  },
  {
    id: 'content-creator',
    label: 'Content Creator',
    icon: '✨',
    description: 'Produce content across digital platforms',
  },
  {
    id: 'developer',
    label: 'Developer',
    icon: '💻',
    description: 'Build websites, applications, and digital products',
  },
  {
    id: 'motion-graphics',
    label: 'Motion Graphics Designer',
    icon: '🎬',
    description: 'Create animated visual assets',
  },
  {
    id: 'voice-artist',
    label: 'Voice-over Artist',
    icon: '🎙️',
    description: 'Record narration and voice content',
  },
  {
    id: 'music-producer',
    label: 'Music Producer',
    icon: '🎵',
    description: 'Produce, arrange, and mix music',
  },
  {
    id: 'digital-marketer',
    label: 'Digital Marketer',
    icon: '📊',
    description: 'Work on digital campaigns, growth, and marketing',
  },
  {
    id: 'photo-editor',
    label: 'Photographer/Editor',
    icon: '📸',
    description: 'Combine photography with post-production',
  },
  {
    id: 'other',
    label: 'Other',
    icon: '🌟',
    description: 'Specify another creative profession',
  },
];

// Validation helper
export function isValidRole(roleId) {
  return CREATOR_ROLES.some(role => role.id === roleId);
}

// Get role by ID
export function getRoleById(roleId) {
  return CREATOR_ROLES.find(role => role.id === roleId);
}

// Get all role IDs
export function getAllRoleIds() {
  return CREATOR_ROLES.map(role => role.id);
}
