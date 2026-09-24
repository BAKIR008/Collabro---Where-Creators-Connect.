# CollaBro Authentication System

> **Complete dual authentication system** for **COLLABRO — The Creators Hub**. Supports both Email + Password and Google OAuth with automatic account linking. Designed to perfectly match the main Landing Page's brutalist aesthetic with premium animations.

---

## ✨ Features

### 🔐 Dual Authentication Methods
- **Email + Password** registration and login with strong validation
- **Google OAuth 2.0** sign-in/sign-up with one click
- **Automatic account linking** — users can authenticate using both methods
- **No duplicate accounts** — same email intelligently linked across providers

### 🎯 Complete Authentication Flows
- ✅ **Sign Up** with email + password
- ✅ **Login** with email + password or Google
- ✅ **Forgot Password** flow with secure token reset
- ✅ **Reset Password** with time-limited tokens
- ✅ **Account Linking** — email users can add Google, and vice versa
- ✅ **Protected Routes** with JWT authentication

### 🛡️ Security & Validation
- 🔒 **bcrypt password hashing** (12 rounds)
- 🍪 **JWT in HttpOnly Secure Cookies**
- ⚡ **Rate limiting** (10 attempts per 15 minutes)
- 🛡️ **NoSQL injection protection**
- ✅ **Input validation** (frontend + backend)
- 🔑 **Strong password requirements** (uppercase, lowercase, number, special char)
- ⏱️ **Token expiration** (1 hour for password reset, 7 days for sessions)

### 🎨 UI/UX Excellence
- 🎨 **Pixel-perfect design** matching CollaBro landing page
- 📱 **Fully responsive** (desktop, tablet, mobile)
- 💫 **Premium animations** (logo bounce, card slide-ins, floating stickers)
- 🎉 **Toast notifications** for all user actions
- ✨ **Real-time validation** with visual feedback
- 🖱️ **Custom cursor** maintained throughout

---

## 🏗️ Project Structure

```
CollaBro Login Page/
├── server/                          # Express.js backend
│   ├── index.js                     # Server entry point
│   ├── models/User.js               # User model with providers array
│   ├── routes/auth.js               # Complete auth API (register, login, Google, reset)
│   ├── middleware/auth.js           # JWT protection middleware
│   ├── utils/jwt.js                 # Token signing/verification
│   └── scripts/
│       └── migrateProviders.js      # Database migration script
├── src/                             # React frontend
│   ├── pages/
│   │   ├── LoginPage.jsx            # Login page (email/password + Google)
│   │   ├── SignUpPage.jsx           # Registration page
│   │   ├── ForgotPasswordPage.jsx   # Password reset request
│   │   └── ResetPasswordPage.jsx    # Password reset with token
│   ├── components/
│   │   ├── CustomCursor.jsx         # Animated cursor
│   │   └── ToastSystem.jsx          # Toast notifications
│   ├── App.jsx                      # Router with all routes
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Complete design system
├── public/favicon.svg
├── .env                             # Backend secrets (DO NOT COMMIT)
├── .env.local                       # Frontend secrets (DO NOT COMMIT)
├── AUTH_SYSTEM.md                   # Complete system documentation
├── TESTING_GUIDE.md                 # 20 detailed test cases
├── IMPLEMENTATION_SUMMARY.md        # What was implemented
├── QUICK_START.md                   # Quick setup guide
├── README.md                        # This file
└── vite.config.js                   # Vite + API proxy config
```

---

## 🚀 Quick Start

See **`QUICK_START.md`** for detailed setup instructions.

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables

**Backend** (`.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/collabro
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
CLIENT_URL=http://localhost:5173
NODE_ENV=development
COOKIE_SECRET=your-cookie-secret-key
```

**Frontend** (`.env.local`):
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### 3. Migrate existing database (if applicable)
```bash
node server/scripts/migrateProviders.js
```

### 4. Run in development
```bash
npm run dev
```

This starts:
- Backend at `http://localhost:5000`
- Frontend at `http://localhost:5173`

---

## 📚 Documentation

- **`QUICK_START.md`** — Get started in 5 minutes
- **`AUTH_SYSTEM.md`** — Complete system overview and API documentation
- **`TESTING_GUIDE.md`** — 20 detailed test cases with examples
- **`IMPLEMENTATION_SUMMARY.md`** — Technical implementation details
- **`README.md`** — This file

---

## 🔐 API Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `POST` | `/api/auth/register` | Register with email + password | No |
| `POST` | `/api/auth/login` | Login with email + password | No |
| `POST` | `/api/auth/google` | Google OAuth login/register/link | No |
| `POST` | `/api/auth/forgot-password` | Request password reset | No |
| `POST` | `/api/auth/reset-password` | Reset password with token | No |
| `POST` | `/api/auth/logout` | Clear session cookie | No |
| `GET` | `/api/auth/me` | Get current user | Yes |
| `GET` | `/api/health` | Health check | No |

See **`AUTH_SYSTEM.md`** for detailed API documentation with request/response examples.

---

## 🗄️ MongoDB Schema

**Database:** `collabro`  
**Collection:** `users`

### User Schema (Updated)
```js
{
  _id: ObjectId,
  name: String,
  email: String (unique, lowercase),
  hashedPassword: String (bcrypt, select: false),
  providers: Array<'local' | 'google'>,        // NEW: Array of auth methods
  googleId: String | null,
  profilePicture: String | null,
  role: 'user' | 'creator' | 'admin',
  isEmailVerified: Boolean,
  emailVerificationToken: String (select: false),     // NEW
  emailVerificationExpires: Date (select: false),     // NEW
  passwordResetToken: String (select: false),         // NEW
  passwordResetExpires: Date (select: false),         // NEW
  createdAt: Date,
  updatedAt: Date
}
```

### Key Changes from Old Schema
- ❌ Removed: `provider: String` (single value)
- ✅ Added: `providers: [String]` (multiple values)
- ✅ Added: Password reset fields
- ✅ Added: Email verification fields

### Example Documents

**Email-only user:**
```js
{
  email: "john@example.com",
  providers: ["local"],
  hashedPassword: "$2a$12$..."
}
```

**Google-only user:**
```js
{
  email: "jane@gmail.com",
  providers: ["google"],
  googleId: "1234567890",
  hashedPassword: null
}
```

**Linked account (both methods):**
```js
{
  email: "user@gmail.com",
  providers: ["local", "google"],      // Can use BOTH!
  hashedPassword: "$2a$12$...",
  googleId: "9876543210"
}
```

### Indexes
- `email_unique` — unique index on `email`
- `googleId_idx` — sparse index on `googleId`
- `createdAt_idx` — descending index on `createdAt`

---

## 🔄 Account Linking Examples

### Example 1: Email → Google Linking
```
1. User signs up with: john@gmail.com + password
   providers: ['local']

2. User logs in with Google using: john@gmail.com
   providers: ['local', 'google']  ← Automatically linked!

3. User can now login using EITHER method
```

### Example 2: Google-only Account
```
1. User signs up with Google: jane@gmail.com
   providers: ['google']

2. User tries email + password login
   ❌ Error: "This account was created using Google Sign-In"

User must use Google OAuth to login
```

### Example 3: Duplicate Prevention
```
1. User exists: test@example.com with providers: ['local']

2. Someone tries to sign up with same email
   ❌ Error: "This email is already registered"

No duplicate created ✅
```

---

## 🧪 Testing

See **`TESTING_GUIDE.md`** for 20 comprehensive test cases covering:

- ✅ Email + Password sign-up and login
- ✅ Google OAuth sign-up and login
- ✅ Account linking scenarios
- ✅ Password validation
- ✅ Forgot/reset password flows
- ✅ Rate limiting
- ✅ UI/UX validation
- ✅ Responsive design
- ✅ Security features

---

## 🔑 Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project → Enable **Google+ API**
3. Create **OAuth 2.0 Client ID** (Web application)
4. Add authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - `https://yourdomain.com` (production)
5. Copy the **Client ID** to:
   - `.env` → `GOOGLE_CLIENT_ID` (server-side)
   - `.env.local` → `VITE_GOOGLE_CLIENT_ID` (client-side)

---

## 🎨 Design System

Matches the CollaBro Landing Page exactly:

| Token | Value | Usage |
|-------|-------|-------|
| `--yellow` | `#FFD52E` | Accent, highlights |
| `--cyan` | `#45D7FF` | Links, info |
| `--magenta` | `#FF3D9A` | Errors, warnings |
| `--purple` | `#7B38FF` | Brand accent |
| `--black` | `#0B0B0B` | Primary text |
| `--white` | `#FFFDF6` | Backgrounds |
| **Font Display** | Bebas Neue | Headings, titles |
| **Font Body** | Space Grotesk | Body text, UI |
| **Font Mono** | Space Mono | Code, labels |

All pages follow the same brutal/neo-brutalist design with thick borders, bold shadows, and vibrant accents.

---

## 🔒 Security Features

### Password Requirements
- ✅ Minimum 8 characters, maximum 64
- ✅ At least one uppercase letter
- ✅ At least one lowercase letter
- ✅ At least one number
- ✅ At least one special character (@$!%*?&)

### Token Security
- ✅ JWT tokens in HttpOnly Secure cookies (prevents XSS)
- ✅ Tokens expire after 7 days (configurable)
- ✅ Password reset tokens expire after 1 hour
- ✅ All reset tokens hashed with SHA-256 before storage

### Protection Layers
- ✅ **Rate limiting** — 10 auth attempts per 15 minutes
- ✅ **NoSQL injection protection** — `express-mongo-sanitize`
- ✅ **Input validation** — `express-validator` + frontend validation
- ✅ **CORS** configured for trusted origins only
- ✅ **HTTPS-ready** — secure cookie flag in production
- ✅ **bcrypt hashing** — 12 rounds for password storage


---

## 🚀 What's New in This Version

### Dual Authentication System
- ✅ **Email + Password** authentication fully implemented
- ✅ **Google OAuth** authentication maintained and enhanced
- ✅ **Account linking** — users can use multiple auth methods
- ✅ **No duplicate accounts** — smart email-based deduplication

### New Pages
- ✅ **Sign Up Page** — Complete registration with validation
- ✅ **Forgot Password Page** — Request password reset
- ✅ **Reset Password Page** — Set new password with token

### Enhanced Security
- ✅ **Password reset flow** with time-limited tokens
- ✅ **Strong password validation** enforced
- ✅ **Email verification** infrastructure (ready to implement)
- ✅ **Improved rate limiting** across all endpoints

### Database Migration
- ✅ **Migration script** included for existing databases
- ✅ **Backward compatible** schema updates
- ✅ **Safe migration** — no data loss

### Documentation
- ✅ **Complete API documentation** in `AUTH_SYSTEM.md`
- ✅ **Testing guide** with 20 test cases
- ✅ **Quick start guide** for fast setup
- ✅ **Implementation summary** with technical details

---

## 📋 Available Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Redirect | Redirects to `/login` |
| `/login` | Login | Email + password or Google login |
| `/signup` | Sign Up | Register with email + password or Google |
| `/forgot-password` | Forgot Password | Request password reset link |
| `/reset-password/:token` | Reset Password | Set new password |
| `/dashboard` | Dashboard | Protected route (requires login) |

---

## 💡 Future Enhancements

### Planned Features
- [ ] **Email service integration** (SendGrid/Mailgun)
- [ ] **Email verification flow**
- [ ] **Social auth expansion** (GitHub, LinkedIn, Twitter)
- [ ] **Two-factor authentication (2FA)**
- [ ] **Session management UI**
- [ ] **Account settings page**
- [ ] **Profile management**

---

## 🐛 Troubleshooting

### Common Issues

**MongoDB connection error:**
```bash
# Ensure MongoDB is running
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

**Google Login not working:**
- Verify `VITE_GOOGLE_CLIENT_ID` in `.env.local`
- Restart dev server after adding env vars
- Check Google Cloud Console credentials

**Rate limit reached:**
- Wait 15 minutes or restart server (development only)

**Migration errors:**
- Ensure MongoDB is running
- Check `MONGODB_URI` connection string
- Run migration before starting server

For more troubleshooting, see **`TESTING_GUIDE.md`** section "Common Issues & Solutions".

---

## 📄 License

MIT License

---

## 🤝 Contributing

This is a complete authentication system ready for production. Feel free to:

- Add additional OAuth providers
- Integrate email services
- Enhance UI/UX
- Add more security features
- Improve documentation

---

## 🎉 Acknowledgments

Built with:
- React 19 + Vite
- Express.js
- MongoDB + Mongoose
- Google OAuth 2.0
- JWT + bcrypt
- Love ❤️ for the CollaBro community

---

**Built for COLLABRO — The Creators Hub 🤜✨🤛**

---

## 📞 Support

For detailed documentation, see:
- **System Overview:** `AUTH_SYSTEM.md`
- **Testing Guide:** `TESTING_GUIDE.md`
- **Quick Setup:** `QUICK_START.md`
- **Implementation Details:** `IMPLEMENTATION_SUMMARY.md`

Happy building! 🚀
