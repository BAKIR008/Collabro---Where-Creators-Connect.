/**
 * CollaBro — File Upload Utility
 * server/utils/upload.js
 *
 * Reusable multer configuration for profile picture uploads.
 * Files are stored locally at server/uploads/avatars/.
 * Max size: 5 MB. Allowed MIME types: JPEG, PNG, WebP, GIF.
 */

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ─── Upload directory ─── */
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads', 'avatars');

// Ensure directory exists at module load time
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/* ─── Allowed MIME types ─── */
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

/* ─── Storage engine ─── */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    // timestamp + 6 random hex chars → collision-proof filename
    const unique = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}${ext}`;
    cb(null, unique);
  },
});

/* ─── MIME type filter ─── */
function fileFilter(_req, file, cb) {
  if (ALLOWED_MIME.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed.'), false);
  }
}

/* ─── Avatar upload (single file, 5 MB max) ─── */
export const avatarUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

/* ─── Utility: build public URL from stored filename ─── */
export function avatarPublicUrl(filename) {
  return `/uploads/avatars/${filename}`;
}
