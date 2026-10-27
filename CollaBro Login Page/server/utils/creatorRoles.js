/**
 * CollaBro — Creator Roles Catalogue
 * server/utils/creatorRoles.js
 * 
 * Centralized creator roles configuration.
 * Stable IDs ensure database consistency across label changes.
 */

export const CREATOR_ROLES = [
  { id: 'video-editor', label: 'Video Editor', icon: '🎬', description: 'Edit videos, reels, and content' },
  { id: 'content-creator', label: 'Content Creator', icon: '📱', description: 'Create engaging digital content' },
  { id: 'thumbnail-maker', label: 'Thumbnail Maker', icon: '🖼️', description: 'Design eye-catching thumbnails' },
  { id: 'script-writer', label: 'Script Writer', icon: '✍️', description: 'Write compelling scripts and copy' },
  { id: 'photographer', label: 'Photographer', icon: '📷', description: 'Capture and edit professional photos' },
];

export const ROLE_IDS = CREATOR_ROLES.map(r => r.id);

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
  return ROLE_IDS;
}
