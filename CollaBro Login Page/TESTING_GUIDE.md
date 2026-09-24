# CollaBro Authentication System - Testing Guide

Complete testing guide for the dual authentication system.

---

## 🧪 Pre-Testing Setup

### 1. Start MongoDB
Ensure MongoDB is running locally or have a MongoDB Atlas connection string.

### 2. Configure Environment Variables

Create/update `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/collabro
JWT_SECRET=test-secret-key-change-in-production
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
CLIENT_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
COOKIE_SECRET=cookie-secret-key
```

Create/update `.env.local`:
```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 3. Migrate Existing Database (if applicable)

```bash
node server/scripts/migrateProviders.js
```

### 4. Start Development Server

```bash
npm run dev
```

Access the app at: `http://localhost:5173`

---

## ✅ Test Cases

### Test 1: Email + Password Sign Up

**Steps:**
1. Navigate to `http://localhost:5173/signup`
2. Fill in the form:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `TestPass123!`
   - Confirm Password: `TestPass123!`
   - Check "I agree to the Terms & Conditions"
3. Click "Create Account"

**Expected Result:**
- ✅ Success toast: "Account Created! 🎉"
- ✅ Auto-login and redirect to `/dashboard`
- ✅ Check MongoDB: User document created with `providers: ['local']`

**Database Verification:**
```javascript
{
  name: "Test User",
  email: "test@example.com",
  hashedPassword: "$2a$12$...", // bcrypt hash
  providers: ["local"],
  role: "user",
  isEmailVerified: false,
  createdAt: Date,
  updatedAt: Date
}
```

---

### Test 2: Email + Password Login

**Steps:**
1. Log out from dashboard
2. Navigate to `http://localhost:5173/login`
3. Enter credentials:
   - Email: `test@example.com`
   - Password: `TestPass123!`
4. Click "Sign In"

**Expected Result:**
- ✅ Success toast: "Welcome back! 👋"
- ✅ Redirect to `/dashboard`
- ✅ JWT cookie set in browser

---

### Test 3: Email + Password Validation

**Steps:**
1. Navigate to `/signup`
2. Try various invalid inputs:

**Test 3.1: Short Password**
- Password: `Short1!`
- Expected: ❌ "Password must be at least 8 characters."

**Test 3.2: Missing Uppercase**
- Password: `testpass123!`
- Expected: ❌ "Password must contain at least one uppercase letter."

**Test 3.3: Missing Special Character**
- Password: `TestPass123`
- Expected: ❌ "Password must contain at least one special character."

**Test 3.4: Passwords Don't Match**
- Password: `TestPass123!`
- Confirm: `TestPass123@`
- Expected: ❌ "Passwords do not match."

**Test 3.5: Invalid Email**
- Email: `invalid-email`
- Expected: ❌ "Please enter a valid email address."

**Test 3.6: Short Name**
- Name: `AB`
- Expected: ❌ "Name must be at least 3 characters."

---

### Test 4: Duplicate Email Prevention

**Steps:**
1. Try to sign up again with `test@example.com`
2. Click "Create Account"

**Expected Result:**
- ❌ Error: "This email is already registered. Please log in instead."
- ✅ No duplicate user created in database

---

### Test 5: Google OAuth Sign Up

**Prerequisites:** Google OAuth configured

**Steps:**
1. Navigate to `/signup`
2. Click "Continue with Google"
3. Select a Google account that hasn't been used before
4. Authorize the app

**Expected Result:**
- ✅ Success toast: "Google sign-up successful! 🎉"
- ✅ Auto-login and redirect to `/dashboard`
- ✅ Check MongoDB: User created with `providers: ['google']`

**Database Verification:**
```javascript
{
  name: "Google User",
  email: "googleuser@gmail.com",
  hashedPassword: null, // No password for Google-only accounts
  providers: ["google"],
  googleId: "1234567890",
  profilePicture: "https://lh3.googleusercontent.com/...",
  role: "user",
  isEmailVerified: true,
  createdAt: Date,
  updatedAt: Date
}
```

---

### Test 6: Google OAuth Login (Existing User)

**Steps:**
1. Log out
2. Navigate to `/login`
3. Click "Continue with Google"
4. Select the same Google account

**Expected Result:**
- ✅ Success toast: "Google sign-in successful! 🎉"
- ✅ Redirect to `/dashboard`
- ✅ No duplicate user created

---

### Test 7: Account Linking (Email → Google)

**Setup:** User exists with email `test@gmail.com` registered via Email + Password

**Steps:**
1. Log out
2. Navigate to `/login`
3. Click "Continue with Google"
4. Select Google account: `test@gmail.com`

**Expected Result:**
- ✅ Success toast mentions account linking
- ✅ User logged in successfully
- ✅ Check MongoDB: `providers: ['local', 'google']`
- ✅ `googleId` and `profilePicture` fields now populated

**Database Verification:**
```javascript
{
  name: "Test User",
  email: "test@gmail.com",
  hashedPassword: "$2a$12$...", // Still exists
  providers: ["local", "google"], // Both methods linked!
  googleId: "1234567890",
  profilePicture: "https://lh3.googleusercontent.com/...",
  role: "user",
  isEmailVerified: true,
  createdAt: Date,
  updatedAt: Date
}
```

**Now test both login methods:**
- ✅ Can login with email + password
- ✅ Can login with Google OAuth

---

### Test 8: Google-Only Account Cannot Use Password Login

**Setup:** User registered with Google OAuth only

**Steps:**
1. Navigate to `/login`
2. Enter:
   - Email: `googleuser@gmail.com`
   - Password: `AnyPassword123!`
3. Click "Sign In"

**Expected Result:**
- ❌ Error: "This account was created using Google Sign-In. Please continue with Google."
- ✅ Login rejected

---

### Test 9: Forgot Password Flow

**Steps:**
1. Navigate to `/forgot-password`
2. Enter email: `test@example.com` (local account)
3. Click "Send Reset Link"

**Expected Result:**
- ✅ Success message: "If that email is registered, a password reset link has been sent."
- ✅ Check server console for reset token (development mode)
- ✅ Check MongoDB: `passwordResetToken` and `passwordResetExpires` fields set

**Database Verification:**
```javascript
{
  email: "test@example.com",
  passwordResetToken: "hashed_token_here",
  passwordResetExpires: Date (1 hour from now),
  ...
}
```

---

### Test 10: Forgot Password - Google-Only Account

**Steps:**
1. Navigate to `/forgot-password`
2. Enter email: `googleuser@gmail.com` (Google-only account)
3. Click "Send Reset Link"

**Expected Result:**
- ❌ Error: "This account uses Google Sign-In. Password reset is unavailable. Please continue with Google."

---

### Test 11: Reset Password

**Setup:** Complete Test 9 first to get reset token

**Steps:**
1. Copy reset token from server console
2. Navigate to `/reset-password/{token}`
3. Enter:
   - New Password: `NewSecure123!`
   - Confirm Password: `NewSecure123!`
4. Click "Reset Password"

**Expected Result:**
- ✅ Success toast: "Password Reset Successful! 🎉"
- ✅ Redirect to `/login`
- ✅ Check MongoDB: `passwordResetToken` and `passwordResetExpires` cleared
- ✅ `hashedPassword` updated

**Verification:**
- ✅ Can log in with new password
- ❌ Cannot log in with old password

---

### Test 12: Expired Reset Token

**Steps:**
1. Use a reset token that's older than 1 hour (or manually modify database)
2. Navigate to `/reset-password/{expired_token}`
3. Try to reset password

**Expected Result:**
- ❌ Error: "Invalid or expired reset token."

---

### Test 13: Invalid Reset Token

**Steps:**
1. Navigate to `/reset-password/invalid-token-123`
2. Try to reset password

**Expected Result:**
- ❌ Error: "Invalid or expired reset token."

---

### Test 14: Remember Me Functionality

**Steps:**
1. Navigate to `/login`
2. Enter credentials
3. Check "Remember me"
4. Click "Sign In"
5. Log out
6. Navigate to `/login` again

**Expected Result:**
- ✅ Email field pre-filled with remembered email
- ✅ "Remember me" checkbox checked

---

### Test 15: Rate Limiting

**Steps:**
1. Navigate to `/login`
2. Make 11 failed login attempts quickly

**Expected Result:**
- ❌ Error after 10th attempt: "Too many attempts. Please try again in 15 minutes."
- ✅ All subsequent requests blocked for 15 minutes

---

### Test 16: Protected Route (GET /api/auth/me)

**Setup:** User logged in

**Steps:**
1. Open browser DevTools → Console
2. Run:
```javascript
fetch('/api/auth/me', { credentials: 'include' })
  .then(r => r.json())
  .then(console.log)
```

**Expected Result:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "providers": ["local"],
    "role": "user",
    "isEmailVerified": false,
    "createdAt": "..."
  }
}
```

---

### Test 17: Logout

**Steps:**
1. While logged in, click "Log Out" on dashboard
2. Try to access `/dashboard` directly

**Expected Result:**
- ✅ JWT cookie cleared
- ✅ Redirected to `/login`

---

### Test 18: UI/UX - Toast Notifications

**Test various scenarios:**
- ✅ Success toasts appear with green accent
- ✅ Error toasts appear with magenta accent
- ✅ Toasts auto-dismiss after timeout
- ✅ Toasts stack properly when multiple appear
- ✅ Toasts slide in from right with animation

---

### Test 19: UI/UX - Form Validation Display

**Steps:**
1. Navigate to `/signup`
2. Fill out form with errors
3. Click submit

**Expected Result:**
- ✅ Each field shows specific validation error
- ✅ Error text appears in red
- ✅ Input border turns red for errors
- ✅ Input border turns green for valid fields
- ✅ Global error banner appears if form submission fails

---

### Test 20: UI/UX - Responsive Design

**Steps:**
1. Open browser DevTools
2. Toggle device toolbar
3. Test various screen sizes:
   - Desktop (1920px)
   - Tablet (768px)
   - Mobile (375px)

**Expected Result:**
- ✅ Left panel hidden on mobile
- ✅ Form remains usable on all screen sizes
- ✅ Buttons and inputs scale appropriately
- ✅ Toast notifications adapt to screen width

---

## 🔍 Database Inspection Commands

### View All Users (MongoDB Shell)
```javascript
use collabro
db.users.find().pretty()
```

### Check User Providers
```javascript
db.users.find({ email: "test@example.com" }, { email: 1, providers: 1, googleId: 1 })
```

### Find Users with Multiple Providers
```javascript
db.users.find({ "providers.1": { $exists: true } })
```

### Clear All Reset Tokens
```javascript
db.users.updateMany(
  { passwordResetToken: { $exists: true } },
  { $unset: { passwordResetToken: "", passwordResetExpires: "" } }
)
```

---

## 🐛 Common Issues & Solutions

### Issue: "Google Login Not Configured"
**Solution:** Add `VITE_GOOGLE_CLIENT_ID` to `.env.local` and restart dev server

### Issue: MongoDB Connection Error
**Solution:** Ensure MongoDB is running and `MONGODB_URI` is correct

### Issue: "Invalid or expired reset token"
**Solution:** Tokens expire after 1 hour. Request a new password reset.

### Issue: Account linking not working
**Solution:** Ensure emails match exactly (case-insensitive comparison is implemented)

### Issue: JWT token not persisting
**Solution:** Check browser cookie settings. Cookies must be enabled.

---

## ✅ Success Criteria

All tests should pass with the following outcomes:

- ✅ Users can sign up with email + password
- ✅ Users can sign up with Google OAuth
- ✅ Users can log in with either method
- ✅ No duplicate accounts for same email
- ✅ Account linking works seamlessly
- ✅ Google-only accounts cannot use password login
- ✅ Forgot/reset password flow works for local accounts
- ✅ Password validation enforces security requirements
- ✅ Rate limiting prevents brute force attacks
- ✅ JWT tokens work correctly
- ✅ UI displays validation errors appropriately
- ✅ Toast notifications work
- ✅ Responsive design works on all screen sizes

---

## 📊 Testing Checklist

Print this checklist and mark off each test:

- [ ] Test 1: Email + Password Sign Up
- [ ] Test 2: Email + Password Login
- [ ] Test 3: Email + Password Validation
- [ ] Test 4: Duplicate Email Prevention
- [ ] Test 5: Google OAuth Sign Up
- [ ] Test 6: Google OAuth Login
- [ ] Test 7: Account Linking (Email → Google)
- [ ] Test 8: Google-Only Cannot Use Password Login
- [ ] Test 9: Forgot Password Flow
- [ ] Test 10: Forgot Password - Google-Only Account
- [ ] Test 11: Reset Password
- [ ] Test 12: Expired Reset Token
- [ ] Test 13: Invalid Reset Token
- [ ] Test 14: Remember Me Functionality
- [ ] Test 15: Rate Limiting
- [ ] Test 16: Protected Route
- [ ] Test 17: Logout
- [ ] Test 18: Toast Notifications
- [ ] Test 19: Form Validation Display
- [ ] Test 20: Responsive Design

---

**Happy Testing! 🧪**
