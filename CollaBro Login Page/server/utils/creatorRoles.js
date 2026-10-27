/**
 * CollaBro — Creator Roles Catalogue
 * server/utils/creatorRoles.js
 *
 * Single source of truth for the 5 supported freelancer roles.
 * Stable IDs ensure DB consistency across label changes.
 */

export const CREATOR_ROLES = [
  {
    id: 'video-editor',
    label: 'Video Editor',
    icon: '🎬',
    description: 'Edit videos, reels, shorts, and long-form content',
  },
  {
    id: 'content-creator',
    label: 'Content Creator',
    icon: '✨',
    description: 'Produce content across digital platforms',
  },
  {
    id: 'thumbnail-maker',
    label: 'Thumbnail Maker',
    icon: '🖼️',
    description: 'Design eye-catching thumbnails that drive clicks',
  },
  {
    id: 'script-writer',
    label: 'Script Writer',
    icon: '✍️',
    description: 'Write compelling scripts for videos and content',
  },
  {
    id: 'photographer',
    label: 'Photographer',
    icon: '📷',
    description: 'Capture and edit professional photographs',
  },
];

// The valid set of primary role IDs
export const VALID_ROLE_IDS = CREATOR_ROLES.map(r => r.id);

// Validation helper
export function isValidRole(roleId) {
  return VALID_ROLE_IDS.includes(roleId);
}

// Get role by ID
export function getRoleById(roleId) {
  return CREATOR_ROLES.find(role => role.id === roleId);
}

// Get all role IDs
export function getAllRoleIds() {
  return VALID_ROLE_IDS;
}
