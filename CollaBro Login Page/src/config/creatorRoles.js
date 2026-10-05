/**
 * Creator Roles Configuration
 * Source of truth for all creator roles in the system
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
    id: 'content-writer',
    label: 'Content Writer',
    icon: '✍️',
    description: 'Craft engaging written content and storytelling',
    category: 'content',
  },
  {
    id: 'graphic-designer',
    label: 'Graphic Designer',
    icon: '🎨',
    description: 'Design visual assets and brand identities',
    category: 'design',
  },
  {
    id: 'thumbnail-designer',
    label: 'Thumbnail Designer',
    icon: '🖼️',
    description: 'Create eye-catching thumbnails that drive clicks',
    category: 'design',
  },
  {
    id: 'ui-ux-designer',
    label: 'UI/UX Designer',
    icon: '📱',
    description: 'Design user interfaces and experiences',
    category: 'design',
  },
  {
    id: 'photographer',
    label: 'Photographer',
    icon: '📸',
    description: 'Capture stunning visual moments',
    category: 'visual',
  },
  {
    id: 'videographer',
    label: 'Videographer',
    icon: '🎥',
    description: 'Film and produce video content',
    category: 'video',
  },
  {
    id: 'animator',
    label: 'Animator',
    icon: '🎞️',
    description: 'Bring ideas to life through animation',
    category: 'video',
  },
  {
    id: 'illustrator',
    label: 'Illustrator',
    icon: '✏️',
    description: 'Create original illustrations and artwork',
    category: 'design',
  },
  {
    id: 'social-media-manager',
    label: 'Social Media Manager',
    icon: '📱',
    description: 'Manage and grow social media presence',
    category: 'marketing',
  },
  {
    id: 'content-creator',
    label: 'Content Creator',
    icon: '⭐',
    description: 'Create multi-format content across platforms',
    category: 'content',
  },
  {
    id: 'developer',
    label: 'Developer',
    icon: '💻',
    description: 'Build websites, apps, and digital tools',
    category: 'tech',
  },
  {
    id: 'motion-graphics',
    label: 'Motion Graphics Designer',
    icon: '🎬',
    description: 'Design animated graphics and visual effects',
    category: 'video',
  },
  {
    id: 'voice-artist',
    label: 'Voice Artist',
    icon: '🎙️',
    description: 'Provide voiceovers and vocal performances',
    category: 'audio',
  },
  {
    id: 'music-producer',
    label: 'Music Producer',
    icon: '🎵',
    description: 'Produce music and audio for content',
    category: 'audio',
  },
  {
    id: 'digital-marketer',
    label: 'Digital Marketer',
    icon: '📊',
    description: 'Drive growth through digital marketing',
    category: 'marketing',
  },
  {
    id: 'photo-editor',
    label: 'Photo Editor',
    icon: '🖌️',
    description: 'Edit and retouch photos to perfection',
    category: 'visual',
  },
  {
    id: 'other',
    label: 'Other',
    icon: '🌟',
    description: 'Specify your unique creative role',
    category: 'other',
  },
];

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
 * Get roles by category
 */
export const getRolesByCategory = (category) => {
  return CREATOR_ROLES.filter((role) => role.category === category);
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
  audio: 'Audio Production',
  marketing: 'Marketing',
  tech: 'Technology',
  other: 'Other',
};
