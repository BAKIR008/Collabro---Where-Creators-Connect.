# CollaBro Authentication System

Complete dual authentication system supporting **Email + Password** and **Google OAuth** with automatic account linking.

---

## 🎯 Features

### ✅ Dual Authentication Methods
- **Email + Password** registration and login
- **Google OAuth** sign-in/sign-up
- Both methods work seamlessly together

### ✅ Account Linking
- Users can authenticate using multiple methods
- No duplicate accounts for the same email
- Automatic provider linking when user signs in with different methods

### ✅ Password Management
- Forgot password flow
- Reset password with token
- Secure bcrypt hashing

### ✅ Email Verification
- Email verification token generation (ready to implement)
- Google-verified emails automatically marked as verified

### ✅ Security
- JWT tokens with HTTP-only cookies
- Rate limiting on all auth endpoints
- Input validation and sanitization
- MongoDB injection protection
- CORS configured
- Secure password requirements

---

## 📁 File Structure

```
CollaBro Login Page/
├── server/
│   ├── models/
│   │   └── User.js                  # User schema with providers array
│   ├── routes/
│   │   └── auth.js                  # All authentication routes
│   ├── middleware/
│   │   └── auth.js                  # JWT verification middleware
│   ├── utils/
│   │   └── jwt.js                   # JWT sign/verify/cookie helpers
│   ├── scripts/
│   │   └── migrateProviders.js      # Database migration script
│   └── index.js                     # Express server entry
├── src/
│   ├── pages/
│   │   ├── LoginPage.jsx            # Login page
│   │   ├── SignUpPage.jsx           # Registration page
│   │   ├── ForgotPasswordPage.jsx   # Request password reset
│   │   └── ResetPasswordPage.jsx    # Reset password with token
│   ├── components/
│   │   ├── CustomCursor.jsx         # Custom cursor component
│   │   └── ToastSystem.jsx          # Toast notifications
│   ├── App.jsx                      # React Router setup
│   └── index.css                    # Complete styling
└── AUTH_SYSTEM.md                   # This file
```

---

## 🗄️ Database Schema

### User Model

```javascript
{
  name: String,                    // Required, 3-50 characters
  email: String,                   // Required, unique, lowercase
  hashedPassword: String,          // Optional (not set for Google-only)
  providers: [String],             // ['local', 'google']
  googleId: String,                // Google account ID
  profilePicture: String,          // URL from Google
  role: String,                    // 'user', 'creator', 'admin'
  isEmailVerified: Boolean,        // Email verification status
  emailVerificationToken: String,  // For email verification
  emailVerificationExpires: Date,
  passwordResetToken: String,      // For password reset
  passwordResetExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Key Points

- **`providers`** is an array that can contain: `['local']`, `['google']`, or `['local', 'google']`
- **No duplicate emails** — enforced by unique index
- **Account linking** — same email can have multiple authentication methods

---

## 🔐 Authentication Flows

### 1. Email + Password Sign Up

```
User fills out form:
  ├─ Full Name (3-50 chars)
  ├─ Email (valid format)
  ├─ Password (8-64 chars, uppercase, lowercase, number, special char)
  ├─ Confirm Password (must match)
  └─ Agree to Terms & Conditions

Backend validation:
  ├─ Check if email already exists → Error if exists
  ├─ Hash password with bcrypt
  └─ Create user with providers: ['local']

Response:
  ├─ Generate JWT token
  ├─ Set HTTP-only cookie
  └─ Auto-login and redirect to dashboard
```

### 2. Email + Password Login

```
User enters:
  ├─ Email
  └─ Password

Backend checks:
  ├─ Find user by email
  ├─ Check if 'local' is in providers array
  │   └─ If not → Error: "Use Google Sign-In"
  ├─ Compare password with bcrypt
  └─ Issue JWT if valid

Response:
  ├─ Set HTTP-only cookie
  └─ Redirect to dashboard
```

### 3. Google OAuth Sign Up/Login

```
User clicks "Continue with Google":
  └─ Google account selector opens

Google returns credential token

Backend verifies token:
  ├─ Extract: googleId, email, name, picture
  └─ Search for existing user by email or googleId

Case A: User exists
  ├─ Check if 'google' in providers
  │   └─ If not → Add 'google' to providers array (account linking)
  ├─ Update googleId and profilePicture
  └─ Issue JWT

Case B: New user
  ├─ Create user with providers: ['google']
  └─ Issue JWT

Response:
  ├─ Set HTTP-only cookie
  └─ Redirect to dashboard
```

### 4. Account Linking Example

```
Scenario:
  User registered with email: bakir@gmail.com + password
  providers: ['local']

Later, user clicks "Continue with Google" using bakir@gmail.com

Backend:
  ├─ Find existing user by email
  ├─ Add 'google' to providers array
  │   providers: ['local', 'google']
  ├─ Save googleId and profilePicture
  └─ Issue JWT

Result:
  User can now log in using BOTH methods!
```

### 5. Forgot Password

```
User enters email

Backend:
  ├─ Find user by email
  ├─ Check if 'local' in providers
  │   └─ If not → Error: "This account uses Google Sign-In"
  ├─ Generate crypto token
  ├─ Hash and save token with 1-hour expiry
  └─ Send reset email (TODO: implement email service)

Response:
  └─ "If that email is registered, a reset link has been sent"
```

### 6. Reset Password

```
User clicks reset link with token

User enters:
  ├─ New Password
  └─ Confirm Password

Backend:
  ├─ Hash token and find user
  ├─ Check token expiry
  ├─ Update hashedPassword
  ├─ Clear reset token fields
  └─ Ensure 'local' is in providers

Response:
  └─ "Password reset successful. You can now log in."
```

---

## 🔗 API Endpoints

### `POST /api/auth/register`
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "providers": ["local"],
    "role": "user",
    "isEmailVerified": false
  }
}
```

---

### `POST /api/auth/login`
**Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:** Same as register

---

### `POST /api/auth/google`
**Body:**
```json
{
  "credential": "google_jwt_token"
}
```

**Response:** Same as register, with optional `linkedAccount: true`

---

### `POST /api/auth/forgot-password`
**Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "If that email is registered, a password reset link has been sent."
}
```

---

### `POST /api/auth/reset-password`
**Body:**
```json
{
  "token": "reset_token_from_email",
  "password": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful. You can now log in with your new password."
}
```

---

### `POST /api/auth/logout`
**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

---

### `GET /api/auth/me` (Protected)
**Headers:** `Authorization: Bearer <token>` or cookie

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "providers": ["local", "google"],
    "role": "user",
    "profilePicture": "https://...",
    "isEmailVerified": true
  }
}
```

---

## 🚀 Getting Started

### 1. Environment Variables

Create `.env` file:

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017/collabro

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Client
CLIENT_URL=http://localhost:5173

# Server
PORT=5000
NODE_ENV=development

# Cookie Secret
COOKIE_SECRET=your-cookie-secret-key
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **Google+ API**
4. Create **OAuth 2.0 Client ID** credentials
5. Add authorized JavaScript origins:
   - `http://localhost:5173`
6. Copy **Client ID** to `.env` as `VITE_GOOGLE_CLIENT_ID`
7. Copy **Client ID** to `.env` as `GOOGLE_CLIENT_ID` (server-side)

### 3. Install Dependencies

```bash
npm install
```

### 4. Migrate Existing Database (If Applicable)

If you have existing users with the old schema:

```bash
node server/scripts/migrateProviders.js
```

This will:
- Convert `provider` (string) → `providers` (array)
- Update all existing users safely

### 5. Run Development Server

```bash
npm run dev
```

This starts both:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

## 🛡️ Security Features

### Password Requirements
- Minimum 8 characters
- Maximum 64 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

### Rate Limiting
- **Global:** 100 requests per 15 minutes
- **Auth endpoints:** 10 attempts per 15 minutes

### Token Security
- JWT tokens stored in HTTP-only cookies
- Tokens expire after 7 days (configurable)
- HTTPS-only cookies in production

### Input Validation
- All inputs validated with express-validator
- Email normalization and sanitization
- MongoDB injection prevention

---

## 📝 TODO / Future Enhancements

- [ ] **Email Service Integration**
  - Send email verification emails
  - Send password reset emails
  - Email templates

- [ ] **Email Verification Flow**
  - Verify email after sign-up
  - Resend verification email

- [ ] **Additional OAuth Providers**
  - GitHub
  - LinkedIn
  - Twitter/X

- [ ] **Two-Factor Authentication (2FA)**

- [ ] **Session Management**
  - View active sessions
  - Revoke sessions remotely

- [ ] **Account Deletion**
  - Soft delete
  - GDPR compliance

---

## 🧪 Testing Account Linking

### Scenario 1: Email → Google Linking

```bash
1. Sign up with email: test@gmail.com + password
   → providers: ['local']

2. Log out

3. Click "Continue with Google" using test@gmail.com
   → providers: ['local', 'google']

4. Now you can log in using EITHER method!
```

### Scenario 2: Google → Email Linking

```bash
1. Sign up with Google: test@gmail.com
   → providers: ['google']

2. Try logging in with email + password
   → Error: "This account was created using Google Sign-In"

3. User must use Google to log in
   (Cannot add local auth retroactively via login page)
```

### Scenario 3: Preventing Duplicates

```bash
1. User exists: test@gmail.com with providers: ['local']

2. Someone tries to sign up again with test@gmail.com
   → Error: "This email is already registered"

3. No duplicate created ✅
```

---

## 🐛 Troubleshooting

### "Google Login Not Configured"
- Check `.env` has `VITE_GOOGLE_CLIENT_ID`
- Restart dev server after adding env variables

### "This account was created using Google"
- User signed up with Google, must use Google to log in
- Cannot add password retroactively through login page

### "Invalid or expired reset token"
- Reset tokens expire after 1 hour
- Request a new password reset

### Migration Errors
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Run migration script before starting server

---

## 📄 License

MIT License - CollaBro Authentication System

---

## 🤝 Support

For issues or questions:
1. Check this documentation
2. Review the code comments
3. Check API endpoint responses for error details

---

**Built with ❤️ for the CollaBro Creator Community**
