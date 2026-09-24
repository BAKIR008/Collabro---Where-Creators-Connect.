# Password Reset Flow - Complete Testing Guide

Test all scenarios to ensure production-ready implementation.

---

## ✅ Prerequisites

Before testing:

1. **MongoDB is running**
   ```bash
   # Check MongoDB status
   # Windows: services.msc → MongoDB
   # macOS: brew services list
   # Linux: systemctl status mongod
   ```

2. **Resend is configured**
   - API key added to `.env`
   - From email configured
   - See `RESEND_SETUP.md` for details

3. **Server is running**
   ```bash
   npm run dev
   ```

4. **Test users exist in database**
   - Local user: `local@test.com` + password
   - Google user: `google@test.com` (Google only)
   - Hybrid user: `hybrid@test.com` (both methods)

---

## 🧪 Test Scenarios

### Test 1: Local Account Password Reset (Happy Path)

**Setup:**
- User exists with `providers: ['local']`
- User has password

**Steps:**
1. Navigate to `/forgot-password`
2. Enter email: `local@test.com`
3. Click "Send Reset Link"

**Expected Results:**
- ✅ Success message: "If an account with this email exists, a password reset link has been sent."
- ✅ Success toast appears
- ✅ Email received in inbox
- ✅ Email contains "Reset Password" button
- ✅ Email shows 15-minute expiration warning
- ✅ Server console logs: "Password reset email sent to local@test.com"

**Database Verification:**
```javascript
db.users.findOne({ email: "local@test.com" })
// Should have:
// passwordResetToken: "hashed_token"
// passwordResetExpires: Date (15 min from now)
```

---

### Test 2: Complete Password Reset Flow

**Setup:**
- Completed Test 1
- Have reset link from email

**Steps:**
1. Click "Reset Password" button in email
2. Verify redirect to `/reset-password/{token}`
3. Enter new password: `NewPass123!`
4. Enter confirm password: `NewPass123!`
5. Click "Reset Password"

**Expected Results:**
- ✅ Success toast: "Password Reset Successful! 🎉"
- ✅ Auto-redirect to `/login` after 2 seconds
- ✅ Server console: "Password reset successful for local@test.com"

**Database Verification:**
```javascript
db.users.findOne({ email: "local@test.com" })
// Should have:
// hashedPassword: "new_bcrypt_hash" (changed!)
// passwordResetToken: undefined
// passwordResetExpires: undefined
```

---

### Test 3: Login with New Password

**Setup:**
- Completed Test 2

**Steps:**
1. At `/login` page
2. Enter email: `local@test.com`
3. Enter OLD password
4. Click "Sign In"

**Expected Results:**
- ❌ Error: "Incorrect email or password."

**Steps (Retry with new password):**
1. Enter email: `local@test.com`
2. Enter NEW password: `NewPass123!`
3. Click "Sign In"

**Expected Results:**
- ✅ Success: Logged in successfully
- ✅ Redirect to `/dashboard`

---

### Test 4: Google-Only Account (No Password Reset)

**Setup:**
- User exists with `providers: ['google']`
- No `hashedPassword` field

**Steps:**
1. Navigate to `/forgot-password`
2. Enter email: `google@test.com`
3. Click "Send Reset Link"

**Expected Results:**
- ❌ Error message: "This account uses Google Sign-In. Password reset is unavailable. Please continue with Google."
- ❌ No email sent
- ✅ Error toast appears

**Database Verification:**
- No reset token created

---

### Test 5: Hybrid Account (Local + Google)

**Setup:**
- User exists with `providers: ['local', 'google']`
- Has both `hashedPassword` AND `googleId`

**Steps:**
1. Request password reset for `hybrid@test.com`
2. Complete password reset with new password
3. Try logging in with new password
4. Try logging in with Google

**Expected Results:**
- ✅ Password reset works normally
- ✅ Can login with new password
- ✅ Can still login with Google
- ✅ Both authentication methods work

---

### Test 6: Non-Existent Email

**Setup:**
- Email doesn't exist in database

**Steps:**
1. Navigate to `/forgot-password`
2. Enter email: `nonexistent@test.com`
3. Click "Send Reset Link"

**Expected Results:**
- ✅ Same success message: "If an account with this email exists..."
- ✅ No email sent
- ✅ No error revealed (prevents email enumeration)

**Security Note:** User cannot tell if email exists or not.

---

### Test 7: Expired Reset Token

**Setup:**
- Have a reset token older than 15 minutes

**Option A: Wait 15 minutes**
1. Request password reset
2. Wait 16 minutes
3. Try to use reset link

**Option B: Manually expire token**
```javascript
db.users.updateOne(
  { email: "local@test.com" },
  { $set: { passwordResetExpires: new Date(Date.now() - 1000) } }
)
```

**Steps:**
1. Click expired reset link
2. Try to reset password

**Expected Results:**
- ❌ Error: "Invalid or expired reset token. Please request a new password reset."
- ❌ Password not changed
- ✅ Error toast appears

---

### Test 8: Invalid Reset Token

**Steps:**
1. Navigate to `/reset-password/invalid_token_12345`
2. Enter new password
3. Click "Reset Password"

**Expected Results:**
- ❌ Error: "Invalid or expired reset token."
- ❌ Password not changed

---

### Test 9: Reusing Reset Link

**Setup:**
- Successfully reset password using a token

**Steps:**
1. Try to use the SAME reset link again
2. Enter new password
3. Click "Reset Password"

**Expected Results:**
- ❌ Error: "Invalid or expired reset token."
- ✅ Token was deleted after first use (security)

**Database Verification:**
- `passwordResetToken` should be `undefined`

---

### Test 10: Rate Limiting (Forgot Password)

**Steps:**
1. Navigate to `/forgot-password`
2. Submit valid email 6 times quickly (within 1 minute)

**Expected Results:**
- ✅ First 5 requests succeed
- ❌ 6th request blocked with error: "Too many password reset requests. Please try again in 15 minutes."
- ✅ Rate limit toast appears

---

### Test 11: Password Validation

**Steps:**
1. Have valid reset link
2. Try various invalid passwords:

**Test 11.1: Too Short**
- Password: `Short1!`
- Expected: ❌ "Password must be at least 8 characters."

**Test 11.2: Missing Uppercase**
- Password: `testpass123!`
- Expected: ❌ "Password must contain at least one uppercase letter."

**Test 11.3: Missing Lowercase**
- Password: `TESTPASS123!`
- Expected: ❌ "Password must contain at least one lowercase letter."

**Test 11.4: Missing Number**
- Password: `TestPass!`
- Expected: ❌ "Password must contain at least one number."

**Test 11.5: Missing Special Character**
- Password: `TestPass123`
- Expected: ❌ "Password must contain at least one special character."

**Test 11.6: Passwords Don't Match**
- Password: `TestPass123!`
- Confirm: `TestPass123@`
- Expected: ❌ "Passwords do not match."

**Test 11.7: Valid Password**
- Password: `NewSecure123!`
- Confirm: `NewSecure123!`
- Expected: ✅ Success

---

### Test 12: Email Delivery Failures

**Setup:**
- Temporarily break Resend (invalid API key)

**Steps:**
1. Update `.env`: `RESEND_API_KEY=invalid_key`
2. Restart server
3. Request password reset

**Expected Results:**
- ❌ Error: "Failed to send password reset email. Please try again later."
- ✅ Reset token NOT saved in database (cleanup on failure)
- ✅ Server console shows Resend error

**Cleanup:**
- Restore correct API key
- Restart server

---

### Test 13: Network Failures (Frontend)

**Setup:**
- Server stopped

**Steps:**
1. Navigate to `/forgot-password`
2. Enter email
3. Click "Send Reset Link"

**Expected Results:**
- ❌ Error toast appears
- ✅ Frontend handles network error gracefully
- ✅ No "Unexpected end of JSON input" error

---

### Test 14: Concurrent Reset Requests

**Steps:**
1. Request password reset for same email
2. Immediately request again (before first email arrives)
3. Receive both emails with different tokens

**Expected Results:**
- ✅ Both requests succeed
- ✅ Most recent token overwrites previous token
- ✅ Only the LATEST reset link works
- ❌ First reset link becomes invalid

**Database Verification:**
- Only ONE `passwordResetToken` exists (the latest)

---

### Test 15: UI/UX Experience

**Test 15.1: Loading States**
- ✅ Button shows spinner while loading
- ✅ Button text changes to "Sending Reset Link..."
- ✅ Button disabled during submission
- ✅ Form inputs disabled during submission

**Test 15.2: Success Feedback**
- ✅ Success banner appears
- ✅ Success toast appears
- ✅ Email field cleared after success

**Test 15.3: Error Feedback**
- ✅ Global error banner appears
- ✅ Error toast appears with details
- ✅ Form remains filled for retry

**Test 15.4: Back Button**
- ✅ "Back to Login" button navigates to `/login`
- ✅ Button disabled during form submission

---

### Test 16: Email Content Quality

**Checklist:**
- ✅ Subject line clear: "Reset Your CollaBro Password"
- ✅ Sender name: "CollaBro" (not just email address)
- ✅ User name personalized: "Hello {Name}"
- ✅ Reset button prominent and clickable
- ✅ Alternative text link provided
- ✅ Expiration warning clear: "15 minutes"
- ✅ Security notice: "If you didn't request this..."
- ✅ CollaBro branding present
- ✅ Email renders correctly in Gmail
- ✅ Email renders correctly in Outlook
- ✅ Email renders correctly on mobile
- ✅ No broken images
- ✅ All links work

---

### Test 17: Mobile Responsiveness

**Test on mobile device or DevTools:**
1. Forgot Password page
2. Reset Password page
3. Email rendering

**Expected Results:**
- ✅ Forms fully usable on small screens
- ✅ Buttons touch-friendly
- ✅ Text readable without zooming
- ✅ Email displays correctly
- ✅ No horizontal scroll

---

### Test 18: Browser Compatibility

**Test in:**
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

**Expected Results:**
- ✅ All functionality works
- ✅ UI displays correctly
- ✅ Animations smooth

---

### Test 19: Security Audit

**Manual Checks:**

**Check 1: Token Storage**
```javascript
db.users.findOne({ email: "local@test.com" })
// passwordResetToken should be HASHED (not plain text)
// Example: "a1b2c3d4e5f6..." (SHA-256 hash)
```

**Check 2: Password Storage**
```javascript
db.users.findOne({ email: "local@test.com" })
// hashedPassword should be bcrypt hash
// Example: "$2a$12$..." (bcrypt format)
```

**Check 3: Email Enumeration**
- Try existing email → generic message
- Try non-existing email → same generic message
- ✅ Cannot determine if email exists

**Check 4: Rate Limiting**
- Try 6 forgot password requests
- ✅ 6th request blocked

---

### Test 20: Production Readiness

**Final Checklist:**

- [ ] All 19 tests passed
- [ ] Real Resend API key configured
- [ ] Custom domain verified in Resend
- [ ] From email uses real domain
- [ ] `CLIENT_URL` points to production URL
- [ ] `NODE_ENV=production` set
- [ ] Development console.logs removed
- [ ] Error handling robust
- [ ] Email delivery rate > 95% (check Resend dashboard)
- [ ] No sensitive data in logs
- [ ] Rate limits appropriate for traffic
- [ ] Database backups enabled
- [ ] Monitoring/alerting configured

---

## 📊 Success Criteria

All tests must pass:

| Test # | Scenario | Status |
|--------|----------|--------|
| 1 | Local account reset request | ✅ |
| 2 | Complete reset flow | ✅ |
| 3 | Login with new password | ✅ |
| 4 | Google-only account blocked | ✅ |
| 5 | Hybrid account | ✅ |
| 6 | Non-existent email | ✅ |
| 7 | Expired token | ✅ |
| 8 | Invalid token | ✅ |
| 9 | Reused token | ✅ |
| 10 | Rate limiting | ✅ |
| 11 | Password validation | ✅ |
| 12 | Email delivery failure | ✅ |
| 13 | Network failure | ✅ |
| 14 | Concurrent requests | ✅ |
| 15 | UI/UX experience | ✅ |
| 16 | Email quality | ✅ |
| 17 | Mobile responsiveness | ✅ |
| 18 | Browser compatibility | ✅ |
| 19 | Security audit | ✅ |
| 20 | Production readiness | ✅ |

---

## 🐛 Common Issues & Solutions

### Issue: No email received
**Solution:** Check spam folder, verify Resend API key, check domain verification

### Issue: "Invalid or expired reset token"
**Solution:** Token expired (15 min), request new reset

### Issue: Rate limit reached
**Solution:** Wait 15 minutes or adjust rate limits

### Issue: "Failed to send password reset email"
**Solution:** Check Resend API key, check server logs, verify domain

### Issue: Old password still works
**Solution:** Database not updated, check bcrypt hashing, verify save()

---

**Testing complete! 🎉**

Your password reset system is production-ready when all tests pass.
