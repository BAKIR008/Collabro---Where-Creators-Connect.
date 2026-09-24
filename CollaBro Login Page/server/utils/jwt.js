/**
 * CollaBro — JWT Utility
 * server/utils/jwt.js
 */

import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/* ─── Sign a token ─── */
export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

/* ─── Verify a token ─── */
export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

/* ─── Set JWT as HttpOnly cookie ─── */
export function setTokenCookie(res, token) {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('collabro_token', token, {
    httpOnly: true,
    secure: isProduction,                        // HTTPS only in production
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,            // 7 days in ms
    path: '/',
  });
}

/* ─── Clear JWT cookie ─── */
export function clearTokenCookie(res) {
  res.cookie('collabro_token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
}
