/**
 * CollaBro Login System — Express Backend
 * Entry Point: server/index.js
 */

import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import onboardingRoutes from './routes/onboarding.js';
import projectRoutes from './routes/projects.js';
import scriptRoutes from './routes/scripts.js';
import scriptProjectRoutes from './routes/scriptProjects.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = process.env.PORT || 5000;

/* ─── Security Middleware ─── */
app.use(mongoSanitize());                          // prevent NoSQL injection
app.set('trust proxy', 1);

/* ─── CORS ─── */
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5111',
  'http://localhost:5173',  // standalone script_writing_dashboard dev server
  'http://localhost:5174',  // in case Vite auto-increments the port
  'http://localhost:5175',  // photography-dashbaord dev server
  'http://localhost:4173',  // photography-dashbaord vite preview
];
app.use(cors({
  origin: (origin, cb) => {
    // allow server-to-server calls (no origin) or listed origins
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

/* ─── Body Parsing ─── */
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));

/* ─── Global Rate Limiter ─── */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,                       // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', globalLimiter);

/* ─── Routes ─── */
app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/scripts', scriptRoutes);
app.use('/api/script-projects', scriptProjectRoutes);

/* ─── Static: Uploaded files (avatars, etc.) ─── */
// Served at /uploads/<filename> — e.g. /uploads/avatars/1234567890-abc.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ─── Health Check ─── */
app.get('/api/health', (_req, res) => {
  res.json({ success: true, status: 'OK', timestamp: new Date().toISOString() });
});

/* ─── 404 Handler ─── */
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

/* ─── Global Error Handler ─── */
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error.'
      : err.message || 'Internal server error.',
  });
});

/* ─── MongoDB + Start ─── */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected to LoginSystem database');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

export default app;
