/**
 * CollaBro — Portfolio Photo Upload Utility
 * server/utils/portfolioUpload.js
 *
 * Multer configuration for portfolio images and project deliverables.
 * Files stored locally at server/uploads/portfolio/ and server/uploads/deliverables/.
 * Max size: 20 MB per file. Allowed: JPEG, PNG, WebP.
 * Multiple files supported (up to 20 per request).
 */

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ─── Upload directories ─── */
const PORTFOLIO_DIR = path.join(__dirname, '..', 'uploads', 'portfolio');
const DELIVERABLES_DIR = path.join(__dirname, '..', 'uploads', 'deliverables');

for (const dir of [PORTFOLIO_DIR, DELIVERABLES_DIR]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/* ─── Allowed MIME types ─── */
const ALLOWED_MIME = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
const MAX_FILE_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB || '20', 10);

/* ─── Safe filename generator ─── */
function safeFilename(file) {
  const ext = path.extname(file.originalname).toLowerCase().replace(/[^.a-z0-9]/g, '') || '.jpg';
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}${ext}`;
}

/* ─── MIME type filter ─── */
function imageFilter(_req, file, cb) {
  if (ALLOWED_MIME.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed.'), false);
  }
}

/* ─── Portfolio storage engine ─── */
const portfolioStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, PORTFOLIO_DIR),
  filename: (_req, file, cb) => cb(null, safeFilename(file)),
});

/* ─── Deliverables storage engine ─── */
const deliverablesStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, DELIVERABLES_DIR),
  filename: (_req, file, cb) => cb(null, safeFilename(file)),
});

/* ─── Portfolio upload (up to 20 files, 20 MB each) ─── */
export const portfolioUpload = multer({
  storage: portfolioStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    files: 20,
  },
});

/* ─── Deliverables upload (up to 50 files, 20 MB each) ─── */
export const deliverablesUpload = multer({
  storage: deliverablesStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    files: 50,
  },
});

/* ─── URL helpers ─── */
export function portfolioImageUrl(filename) {
  return `/uploads/portfolio/${filename}`;
}

export function deliverableFileUrl(filename) {
  return `/uploads/deliverables/${filename}`;
}

/**
 * Safely delete a local upload file by its public URL path.
 * Does not throw if the file is missing.
 */
export function deleteUploadByUrl(publicUrl) {
  if (!publicUrl) return;
  try {
    const relative = publicUrl.replace(/^\/uploads\//, '');
    const absPath = path.join(__dirname, '..', 'uploads', relative);
    if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
  } catch (err) {
    console.warn('[deleteUploadByUrl] Could not delete file:', publicUrl, err.message);
  }
}
