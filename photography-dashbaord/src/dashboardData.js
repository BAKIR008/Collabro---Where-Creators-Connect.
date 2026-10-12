export const projectsSeed = [
  {
    id: 'featured-golden-hour',
    title: 'Golden hour, unfiltered',
    type: 'Portrait',
    status: 'Open',
    image: 'photo-1534528741775-53994a69daeb',
    collaborators: ['Maya Chen', 'Leo Park'],
    need: 'Stylist + MUA',
    description: 'A warm, candid portrait session built around soft golden-hour light.',
  },
  {
    id: 'featured-city',
    title: 'Somewhere in the city',
    type: 'Editorial',
    status: 'In progress',
    image: 'photo-1515886657613-9f3515b0c78f',
    collaborators: ['Noah Williams'],
    need: 'Art director',
    description: 'A fashion editorial that finds color and character in the city.',
  },
  {
    id: 'featured-wild',
    title: 'A little more wild',
    type: 'Nature',
    status: 'Open',
    image: 'photo-1470252649378-9c29740c9fa8',
    collaborators: ['Ava Patel', 'Kai Morgan'],
    need: 'Videographer',
    description: 'An outdoor story celebrating natural textures and unplanned moments.',
  },
  {
    id: 'featured-film',
    title: 'Sunday on film',
    type: 'Lifestyle',
    status: 'Open',
    image: 'photo-1529156069898-49953e39b3ac',
    collaborators: ['Ella Brooks'],
    need: 'Model + stylist',
    description: 'A relaxed lifestyle shoot with a nostalgic film-inspired look.',
  },
]

export const creators = [
  { name: 'Maya Chen', role: 'Fashion stylist', tags: ['Editorial', 'Fashion'], projects: 12, rating: '4.9', image: 'photo-1531123897727-8f129e1688ce' },
  { name: 'Leo Park', role: 'Videographer', tags: ['Film', 'Travel'], projects: 8, rating: '4.8', image: 'photo-1500648767791-00dcc994a43e' },
  { name: 'Ava Patel', role: 'Makeup artist', tags: ['Beauty', 'Portrait'], projects: 15, rating: '5.0', image: 'photo-1534528741775-53994a69daeb' },
  { name: 'Kai Morgan', role: 'Creative director', tags: ['Campaign', 'Art'], projects: 10, rating: '4.9', image: 'photo-1506794778202-cad84cf45f1d' },
]

export const moodboardReferences = [
  { label: 'Golden hour', image: 'photo-1470252649378-9c29740c9fa8' },
  { label: 'Portrait light', image: 'photo-1524504388940-b1c1722653e1' },
  { label: 'Film inspiration', image: 'photo-1492691527719-9d1e07e534b4' },
]

export const photoUrl = (id, width = 640) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`
