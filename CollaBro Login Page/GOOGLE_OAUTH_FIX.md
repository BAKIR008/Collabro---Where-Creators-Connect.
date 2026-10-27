# Google OAuth `origin_mismatch` Error - Complete Fix Guide

## Date: 2026-09-29

---

## ROOT CAUSE ANALYSIS

### Confirmed Issues

1. **Origin Not Authorized in Google Cloud Console**
   - **Current Frontend Origin**: `http://localhost:5111` (from vite.config.js)
   - **Status**: This origin is NOT authorized in Google Cloud Console
   - **Evidence**: `Error 400: origin_mismatch` from Google

2. **Client ID Loading Issues**
   - **Console Errors**: "Missing required parameter: client_id"
   - **Console Errors**: "The given client ID is not found"
   - **Possible Cause**: Environment variable not loaded or Vite dev server needs restart

3. **Configuration Summary**
   - ✅ Google Client ID matches in frontend and backend
   - ✅ CORS correctly configured for `http://localhost:5111`
   - ✅ Authentication flow correctly implements Google Identity Services
   - ❌ JavaScript origin not authorized in Google Cloud Console
   - ⚠️ Environment variable may not be loaded in browser

---

## STEP-BY-STEP FIX

### Step 1: Verify Environment Variable (DO THIS FIRST)

1. **Check if `.env.local` exists in project root**:
   ```
   CollaBro Login Page/.env.local
   ```

2. **Verify it contains**:
   ```env
   VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
   ```

3. **RESTART Vite Dev Server** (CRITICAL):
   ```bash
   # Stop the current dev server (Ctrl+C)
   # Then restart:
   npm run dev
   ```
   
   **Why**: Vite only loads environment variables at startup. Changes to `.env.local` require a restart.

4. **Verify the variable loads in browser**:
   - Open browser console: `http://localhost:5111`
   - Type: `import.meta.env.VITE_GOOGLE_CLIENT_ID`
   - Should show: `"YOUR_GOOGLE_CLIENT_ID"`
   - If it shows `undefined`, the variable is NOT loading

---

### Step 2: Configure Google Cloud Console (REQUIRED MANUAL ACTION)

You must manually configure the following in Google Cloud Console:

#### A. Navigate to Google Cloud Console

1. Go to: https://console.cloud.google.com/
2. Select your project
3. Navigate to: **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID: `1027442365042-3j4ktdjbfgojqvru4gkjlfpbi179i6qi`

#### B. Add Authorized JavaScript Origins

1. Click on your OAuth 2.0 Client ID
2. Scroll to **Authorized JavaScript origins**
3. Click **ADD URI**
4. Add **EXACTLY**:
   ```
   http://localhost:5111
   ```

   **IMPORTANT**:
   - Use `http://` (not `https://` for localhost)
   - Include the port number `:5111`
   - Do NOT add a path (no `/login` or `/api/auth`)
   - Must match EXACTLY what's in vite.config.js

5. Click **SAVE**

**Note**: Changes may take 5-10 minutes to propagate. You may need to wait before testing.

#### C. Authorized Redirect URIs (Current Implementation Does NOT Need This)

Your implementation uses **Google Identity Services** with a credential callback, NOT a redirect flow.

**DO NOT ADD** redirect URIs unless you're using a different OAuth flow (like Passport.js with redirect).

Current implementation is correct - it uses:
- Frontend: `google.accounts.id.initialize()` with callback
- Backend: Receives ID token, verifies with `OAuth2Client.verifyIdToken()`

This flow does NOT use redirect URIs.

---

### Step 3: Security Check - Ensure Secrets Are Safe

#### What's Safe
✅ Google Client ID in `.env.local` (prefixed with `VITE_`) - This is PUBLIC and safe to expose to browser
✅ Google Client ID in code - This is normal for browser-based OAuth

#### What MUST Stay Private
🔒 **GOOGLE_CLIENT_SECRET** in `server/.env` - NEVER add `VITE_` prefix
🔒 **JWT_SECRET** - Backend only
🔒 **COOKIE_SECRET** - Backend only
🔒 **RESEND_API_KEY** - Backend only

**CRITICAL**: Your `.env` file contains actual secrets. Ensure it's in `.gitignore`:

```bash
# Check .gitignore contains:
.env
.env.local
.env.*.local
```

---

### Step 4: Test the Fix

After completing Steps 1-2, test as follows:

1. **Restart Vite dev server** (if not already done):
   ```bash
   npm run dev
   ```

2. **Navigate to login page**:
   ```
   http://localhost:5111/login
   ```

3. **Open browser console** (F12)

4. **Verify no errors**:
   - Should NOT see "Missing required parameter: client_id"
   - Should NOT see "origin_mismatch"

5. **Click "Continue with Google" button**

6. **Expected behavior**:
   - Google account picker appears
   - Select account
   - Authenticates successfully
   - Redirects to `/dashboard`

---

### Step 5: Verify Backend Verification

The backend correctly verifies Google tokens:

✅ Uses `OAuth2Client` from `google-auth-library`
✅ Verifies token signature and claims
✅ Checks audience matches `GOOGLE_CLIENT_ID`
✅ Checks email verification status
✅ Creates or links user account
✅ Issues JWT session

No changes needed to backend - it's already secure and correct.

---

## COMPLETE CONFIGURATION SUMMARY

### Frontend
- **Origin**: `http://localhost:5111`
- **Port**: 5111 (from vite.config.js)
- **Client ID Source**: `import.meta.env.VITE_GOOGLE_CLIENT_ID`
- **Client ID File**: `.env.local`
- **OAuth Library**: Google Identity Services (GSI)
- **Flow Type**: ID Token with callback (no redirect)

### Backend
- **Port**: 5000
- **CORS Origin**: `http://localhost:5111` (from CLIENT_URL)
- **Client ID**: Same as frontend
- **Client Secret**: In `.env` (never exposed to browser)
- **Verification**: `OAuth2Client.verifyIdToken()`

### Google Cloud Console Required Settings
- **OAuth 2.0 Client ID**: `1027442365042-3j4ktdjbfgojqvru4gkjlfpbi179i6qi`
- **Application Type**: Web application
- **Authorized JavaScript origins**: `http://localhost:5111`
- **Authorized redirect URIs**: NONE (not used by current implementation)

---

## PRODUCTION DEPLOYMENT NOTES

When deploying to production (e.g., `https://collabro.com`):

1. **Add production origin to Google Cloud Console**:
   ```
   https://collabro.com
   ```

2. **Update frontend `.env.production`**:
   ```env
   VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
   ```

3. **Update backend environment**:
   ```env
   CLIENT_URL=https://collabro.com
   ```

4. **Use HTTPS** (required by Google for production)

5. **Consider separate OAuth clients** for dev and production

---

## TROUBLESHOOTING

### Error: "origin_mismatch"
- ✅ **Fix**: Add `http://localhost:5111` to Authorized JavaScript origins
- ⏱️ **Wait**: 5-10 minutes for Google changes to propagate
- 🔄 **Clear**: Browser cache and cookies

### Error: "Missing required parameter: client_id"
- ✅ **Fix**: Verify `.env.local` exists
- ✅ **Fix**: Restart Vite dev server
- ✅ **Check**: Browser console `import.meta.env.VITE_GOOGLE_CLIENT_ID`

### Error: "The given client ID is not found"
- ✅ **Fix**: Client ID doesn't exist or is from wrong project
- ✅ **Check**: Copy exact Client ID from Google Cloud Console

### Google button doesn't appear
- ✅ **Fix**: Check `https://accounts.google.com/gsi/client` loads
- ✅ **Fix**: Check browser console for errors
- ✅ **Fix**: Verify `window.google.accounts` exists

### Authentication succeeds but user not created
- ✅ **Check**: Backend logs for errors
- ✅ **Check**: MongoDB connection
- ✅ **Check**: Token verification passes

---

## SECURITY RECOMMENDATIONS

1. ✅ **Secrets Management**: Already using environment variables correctly
2. ✅ **Token Verification**: Already verifying tokens server-side
3. ✅ **HTTPS**: Use HTTPS in production (required by Google)
4. ⚠️ **Secret Rotation**: Current secrets exposed in this session should be rotated
5. ✅ **CORS**: Already properly configured
6. ✅ **Rate Limiting**: Already implemented

### Secrets Requiring Rotation:
- `GOOGLE_CLIENT_SECRET`: `YOUR_GOOGLE_CLIENT_SECRET`
- `JWT_SECRET`: `YOUR_JWT_SECRET`
- `COOKIE_SECRET`: `YOUR_COOKIE_SECRET`
- `RESEND_API_KEY`: `YOUR_RESEND_API_KEY`

**Action Required**: Regenerate these secrets before production deployment.

---

## TESTING CHECKLIST

After applying fixes:

- [ ] Restart Vite dev server
- [ ] Navigate to `http://localhost:5111/login`
- [ ] Open browser console (no client_id errors)
- [ ] Click "Continue with Google"
- [ ] Google account picker appears
- [ ] Select Google account
- [ ] Authenticates successfully
- [ ] Redirects to dashboard
- [ ] User saved in MongoDB
- [ ] JWT cookie set
- [ ] Logout works
- [ ] Email/password login still works

---

## ADDITIONAL NOTES

### Why This Happened

1. **New Project**: Google Cloud Console wasn't configured for local development
2. **Environment Variables**: May not have been loaded (requires Vite restart)
3. **Origin Authorization**: Localhost with specific port must be explicitly authorized

### What Was Already Correct

✅ Frontend implementation (Google Identity Services)
✅ Backend verification (secure token validation)
✅ Account linking logic (handles existing users)
✅ CORS configuration
✅ Environment variable naming
✅ Client ID consistency

### What Required Fixing

❌ Google Cloud Console - Authorized JavaScript origins
⚠️ Environment variable loading - Vite server restart
