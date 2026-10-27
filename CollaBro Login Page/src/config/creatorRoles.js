/**
 * Creator Roles Configuration
 * Source of truth for all creator roles in the system
 */

export const CREATOR_ROLES = [
  { id: 'video-editor', label: 'Video Editor', icon: '🎬', description: 'Edit videos, reels, and content' },
  { id: 'content-creator', label: 'Content Creator', icon: '📱', description: 'Create engaging digital content' },
  { id: 'thumbnail-maker', label: 'Thumbnail Maker', icon: '🖼️', description: 'Design eye-catching thumbnails' },
  { id: 'script-writer', label: 'Script Writer', icon: '✍️', description: 'Write compelling scripts and copy' },
  { id: 'photographer', label: 'Photographer', icon: '📷', description: 'Capture and edit professional photos' },
];
export const ROLE_IDS = CREATOR_ROLES.map(r => r.id);
export const getRoleById = (id) => CREATOR_ROLES.find(r => r.id === id);
export const ROLE_SKILLS = {
  'video-editor': ['Adobe Premiere Pro','DaVinci Resolve','After Effects','CapCut','Final Cut Pro','Color Grading','Motion Editing','Video Effects','Sound Editing'],
  'content-creator': ['YouTube','Instagram','Reels','YouTube Shorts','Short-form Content','Long-form Content','Content Strategy','Social Content','Audience Engagement'],
  'thumbnail-maker': ['Photoshop','Canva','Thumbnail Design','YouTube Thumbnails','Typography','Visual Composition','Color Theory','Image Editing'],
  'script-writer': ['YouTube Scripts','Short-form Scripts','Storytelling','Copywriting','Script Structure','Research','Narrative Writing','Hook Writing'],
  'photographer': ['Portrait Photography','Product Photography','Event Photography','Lightroom','Photoshop','Composition','Lighting','Photo Editing'],
};

