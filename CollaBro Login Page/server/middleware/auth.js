/**
 * CollaBro — Auth Middleware
 * server/middleware/auth.js
 */

import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

export async function protect(req, res, next) {
  try {
    let token;

    // 1) Check HttpOnly cookie first
    if (req.cookies?.collabro_token) {
      token = req.cookies.collabro_token;
    }
    // 2) Fallback: Bearer token in Authorization header
    else if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    // 3) Verify token
    const decoded = verifyToken(token);

    // 4) Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.',
        code: 'TOKEN_EXPIRED',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token.',
    });
  }
}
