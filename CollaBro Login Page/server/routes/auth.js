/**
 * CollaBro — Auth Routes
 * server/routes/auth.js
 *
 * POST /api/auth/register     — Email + Password registration
 * POST /api/auth/login        — Email + Password login
 * POST /api/auth/google       — Google OAuth login/register with account linking
 * POST /api/auth/logout       — Logout (clear cookie)
 * GET  /api/auth/me           — Get current user (protected)
 * POST /api/auth/forgot-password     — Request password reset
 * POST /api/auth/reset-password      — Reset password with token
 */

import express from 'express';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import User from '../models/User.js';
import { signToken, setTokenCookie, clearTokenCookie } from '../utils/jwt.js';
import { protect } from '../middleware/auth.js';
import { sendPasswordResetEmail } from '../utils/email.js';

const router = express.Router();

/* ─── Strict rate limiter for auth attempts ─── */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,                     // 15 minutes
  max: 10,                                        // max 10 attempts
  message: {
    success: false,
    message: 'Too many attempts. Please try again in 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/* ─── Stricter rate limiter for forgot password ─── */
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,                     // 15 minutes
  max: 5,                                         // max 5 requests per 15 minutes
  message: {
    success: false,
    message: 'Too many password reset requests. Please try again in 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

/* ─── Google OAuth2 Client ─── */
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ─────────────────────────────────────────────────
   Helper: Send auth response
───────────────────────────────────────────────── */
function sendAuthResponse(res, user, statusCode = 200) {
  const token = signToken({ id: user._id, role: user.role });
  setTokenCookie(res, token);

  return res.status(statusCode).json({
    success: true,
    token,                                        // also returned for non-cookie clients
    user: user.toPublic(),
  });
}

/* ─────────────────────────────────────────────────
   Helper: Password validation regex
───────────────────────────────────────────────── */
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/;

/* ─────────────────────────────────────────────────
   POST /api/auth/register
   Email + Password registration
───────────────────────────────────────────────── */
router.post(
  '/register',
  authLimiter,
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Full name is required.')
      .isLength({ min: 3, max: 50 })
      .withMessage('Name must be between 3 and 50 characters.'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email address.')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required.')
      .isLength({ min: 8, max: 64 })
      .withMessage('Password must be between 8 and 64 characters.')
      .matches(passwordRegex)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'),
    body('confirmPassword')
      .notEmpty()
      .withMessage('Please confirm your password.')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match.');
        }
        return true;
      }),
  ],
  async (req, res) => {
    // 1) Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;

    try {
      // 2) Check if email already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'This email is already registered. Please log in instead.',
        });
      }

      // 3) Create new user with local provider
      const user = await User.create({
        name: name.trim(),
        email: email.toLowerCase(),
        hashedPassword: password,
        providers: ['local'],
        role: 'user',
        isEmailVerified: false,
      });

      // 4) Generate email verification token (optional - implement later)
      // const verificationToken = crypto.randomBytes(32).toString('hex');
      // user.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
      // user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      // await user.save();

      // TODO: Send verification email
      // await sendVerificationEmail(user.email, verificationToken);

      // 5) Auto-login after signup
      return sendAuthResponse(res, user, 201);
    } catch (err) {
      console.error('[Register Error]', err);
      return res.status(500).json({
        success: false,
        message: 'Server error. Please try again.',
      });
    }
  }
);

/* ─────────────────────────────────────────────────
   POST /api/auth/login
   Email + Password authentication
───────────────────────────────────────────────── */
router.post(
  '/login',
  authLimiter,
  [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email address.')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required.')
      .isLength({ min: 8, max: 64 })
      .withMessage('Password must be between 8 and 64 characters.'),
  ],
  async (req, res) => {
    // 1) Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    try {
      // 2) Find user — explicitly select hashedPassword (it's excluded by default)
      const user = await User.findOne({ email: email.toLowerCase() }).select('+hashedPassword');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Incorrect email or password.',
        });
      }

      // 3) Check if user has local provider
      if (!user.hasProvider('local')) {
        // User registered with Google only
        return res.status(400).json({
          success: false,
          message: 'This account was created using Google Sign-In. Please continue with Google.',
        });
      }

      // 4) Compare password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Incorrect email or password.',
        });
      }

      // 5) Send response
      return sendAuthResponse(res, user);
    } catch (err) {
      console.error('[Login Error]', err);
      return res.status(500).json({
        success: false,
        message: 'Server error. Please try again.',
      });
    }
  }
);

/* ─────────────────────────────────────────────────
   POST /api/auth/google
   Google OAuth2 login / auto-registration / account linking
───────────────────────────────────────────────── */
router.post('/google', authLimiter, async (req, res) => {
  const { credential } = req.body;                 // Google ID token

  if (!credential) {
    return res.status(400).json({
      success: false,
      message: 'Google credential token is required.',
    });
  }

  try {
    // 1) Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture, email_verified } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Could not retrieve email from Google account.',
      });
    }

    // 2) Find existing user by email OR googleId
    let user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { googleId }],
    });

    if (user) {
      // 3a) Existing user — link Google account if not already linked
      let wasLinked = false;

      if (!user.hasProvider('google')) {
        user.addProvider('google');
        wasLinked = true;
      }

      if (!user.googleId) user.googleId = googleId;
      if (!user.profilePicture && picture) user.profilePicture = picture;
      if (!user.isEmailVerified && email_verified) user.isEmailVerified = email_verified;
      
      await user.save();

      // Return success with account linking message if applicable
      const response = sendAuthResponse(res, user);
      if (wasLinked) {
        return res.status(200).json({
          ...response,
          linkedAccount: true,
          message: 'Google account linked successfully!',
        });
      }
      return response;
    } else {
      // 3b) New user — create account with Google provider
      user = await User.create({
        name,
        email: email.toLowerCase(),
        providers: ['google'],
        googleId,
        profilePicture: picture || null,
        isEmailVerified: email_verified || false,
        role: 'user',
      });

      return sendAuthResponse(res, user, 201);
    }
  } catch (err) {
    console.error('[Google Auth Error]', err);

    if (err.message?.includes('Token used too late')) {
      return res.status(401).json({
        success: false,
        message: 'Google session expired. Please try again.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Google authentication failed. Please try again.',
    });
  }
});

/* ─────────────────────────────────────────────────
   POST /api/auth/logout
───────────────────────────────────────────────── */
router.post('/logout', (req, res) => {
  clearTokenCookie(res);
  return res.json({ success: true, message: 'Logged out successfully.' });
});

/* ─────────────────────────────────────────────────
   GET /api/auth/me
   Protected — returns current user info
───────────────────────────────────────────────── */
router.get('/me', protect, (req, res) => {
  return res.json({
    success: true,
    user: req.user.toPublic(),
  });
});

/* ─────────────────────────────────────────────────
   POST /api/auth/forgot-password
   Request password reset link
───────────────────────────────────────────────── */
router.post(
  '/forgot-password',
  forgotPasswordLimiter,  // Stricter rate limit: 5 requests per 15 minutes
  [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email address.')
      .normalizeEmail(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed.',
          errors: errors.array(),
        });
      }

      const { email } = req.body;

      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });

      // SECURITY: Always return the same message to prevent email enumeration
      const standardResponse = {
        success: true,
        message: 'If an account with this email exists, a password reset link has been sent.',
      };

      // If user doesn't exist, return success (but don't send email)
      if (!user) {
        return res.status(200).json(standardResponse);
      }

      // Check if account has local provider
      if (!user.hasProvider('local')) {
        // Google-only account cannot reset password
        return res.status(400).json({
          success: false,
          message: 'This account uses Google Sign-In. Password reset is unavailable. Please continue with Google.',
        });
      }

      // Generate cryptographically secure reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      
      // Hash the token before storing (security best practice)
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      
      // Store hashed token and expiration (15 minutes)
      user.passwordResetToken = hashedToken;
      user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
      await user.save();

      // Send professional password reset email via Resend
      try {
        await sendPasswordResetEmail(user.email, user.name, resetToken);
        
        console.log(`✅ Password reset email sent to ${user.email}`);
        
        // For development: Always log the reset link
        console.log(`\n🔑 Password reset link: ${process.env.CLIENT_URL}/reset-password/${resetToken}\n`);
      } catch (emailError) {
        console.error('[Email Send Error]', emailError);
        
        // In development mode, if Resend is not configured, still succeed
        // (token is already saved and logged to console)
        const isResendConfigured = process.env.RESEND_API_KEY && 
                                   process.env.RESEND_API_KEY !== 're_your_resend_api_key_here';
        
        if (!isResendConfigured) {
          // Development mode: Token already logged, let it succeed
          console.log('⚠️  Resend not configured - using development mode (check console for reset link)');
        } else {
          // Production mode: Clean up the reset token if email actually fails
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          await user.save();
          
          return res.status(500).json({
            success: false,
            message: 'Failed to send password reset email. Please try again later.',
          });
        }
      }

      return res.status(200).json(standardResponse);
    } catch (err) {
      console.error('[Forgot Password Error]', err);
      return res.status(500).json({
        success: false,
        message: 'Server error. Please try again later.',
      });
    }
  }
);

/* ─────────────────────────────────────────────────
   POST /api/auth/reset-password
   Reset password with token
───────────────────────────────────────────────── */
router.post(
  '/reset-password',
  authLimiter,
  [
    body('token')
      .notEmpty()
      .withMessage('Reset token is required.'),
    body('password')
      .notEmpty()
      .withMessage('Password is required.')
      .isLength({ min: 8, max: 64 })
      .withMessage('Password must be between 8 and 64 characters.')
      .matches(passwordRegex)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'),
    body('confirmPassword')
      .notEmpty()
      .withMessage('Please confirm your password.')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match.');
        }
        return true;
      }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed.',
          errors: errors.array(),
        });
      }

      const { token, password } = req.body;

      // Hash the token to match stored version
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      // Find user with valid reset token and check expiration
      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },  // Token must not be expired
      }).select('+passwordResetToken +passwordResetExpires +hashedPassword');

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token. Please request a new password reset.',
        });
      }

      // Update password (will be automatically hashed by pre-save hook)
      user.hashedPassword = password;
      
      // Delete reset token and expiration (token can only be used once)
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      // Ensure local provider is added (edge case for hybrid accounts)
      if (!user.hasProvider('local')) {
        user.addProvider('local');
      }

      await user.save();

      console.log(`✅ Password reset successful for ${user.email}`);

      return res.status(200).json({
        success: true,
        message: 'Password reset successful. You can now log in with your new password.',
      });
    } catch (err) {
      console.error('[Reset Password Error]', err);
      return res.status(500).json({
        success: false,
        message: 'Server error. Please try again later.',
      });
    }
  }
);

export default router;
