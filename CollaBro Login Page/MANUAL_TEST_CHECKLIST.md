# Manual Testing Checklist - Onboarding System

Use this checklist to verify the onboarding system works end-to-end after fixes.

## Prerequisites

- [ ] MongoDB running on `localhost:27017`
- [ ] `.env` file configured
- [ ] Dependencies installed: `npm install`

## Start the System

```bash
npm run dev
```

Expected output:
- ✅ Backend: `🚀 Server running at http://localhost:5000`
- ✅ Backend: `✅ MongoDB connected to LoginSystem database`
- ✅ Frontend: `➜ Local: http://localhost:5173/`

---

## Test 1: New User Signup

- [ ] Navigate to `http://localhost:5173/`
- [ ] Click "Sign Up"
- [ ] Fill in credentials (username, email, password)
- [ ] Submit form
- [ ] ✅ Should redirect to `/onboarding`

---

## Test 2: Creator Identity Step

- [ ] Select 2-3 creator roles
- [ ] Click "Set as Primary" on one role
- [ ] If "Other" selected, fill in custom role
- [ ] Click "Next"
- [ ] ✅ Should advance to Skills & Experience step

---

## Test 3: Skills & Experience Step

- [ ] Select experience level: **"Expert"** (not "Professional")
- [ ] Add 2-3 skills via tag input
- [ ] Add 1-2 tools (optional)
- [ ] Click "Next"
- [ ] ✅ Should advance to Goals step

---

## Test 4: Goals Step

- [ ] Select **"Earn Income"** (should be accepted)
- [ ] Select **"Network"** (should be accepted)
- [ ] Select **"Get Discovered"** (should be accepted)
- [ ] Select 1-2 more goals
- [ ] Click "Next"
- [ ] ✅ Should advance to Collaboration step

---

## Test 5: Collaboration Preferences Step

- [ ] Select 2-3 collaborator roles
- [ ] Select 2-3 project types
- [ ] Select duration: any option (should be single selection)
- [ ] Select work mode: **"Hybrid"** (should be accepted)
- [ ] Click "Next"
- [ ] ✅ Should advance to Work Preferences step

---

## Test 6: Work Preferences Step (Optional)

- [ ] Add 1-2 content categories (tag input)
- [ ] Add 1-2 industries (tag input)
- [ ] Add 1-2 creative styles (e.g., "Cinematic", "Bold")
- [ ] Click "Next"
- [ ] ✅ Should advance to Review step

---

## Test 7: Review & Complete

- [ ] Verify all data displays correctly
- [ ] Check that "Earn Income", "Network", "Get Discovered" appear in goals
- [ ] Check that "Expert" appears for experience level
- [ ] Check that "Hybrid" appears for work mode
- [ ] Check that multiple styles appear (not single enum value)
- [ ] Click "Complete Onboarding ✓"
- [ ] ✅ Should show success message
- [ ] ✅ Should redirect to `/dashboard`

---

## Test 8: Verify Database

Open MongoDB and check:

```javascript
// Find the user
db.users.findOne({ email: "your-test-email@example.com" })

// Should have:
// onboarding: { status: "completed", completedAt: <date>, version: 1 }
```

```javascript
// Find the creator profile
db.creatorprofiles.findOne({ user: ObjectId("...") })

// Should have:
// - experienceLevel: "expert" (not "professional")
// - goals: array including "earn-income", "network", "get-discovered"
// - collaborationPreferences.workMode: "hybrid" (not "either")
// - collaborationPreferences.duration: "short-term" (string, not array)
// - workPreferences.style: ["Cinematic", "Bold"] (array, not string)
```

---

## Test 9: Returning User

- [ ] Log out
- [ ] Log back in with same credentials
- [ ] ✅ Should redirect directly to `/dashboard` (skip onboarding)
- [ ] ✅ Should NOT go back to onboarding

---

## Test 10: Draft Saving

- [ ] Create a new test account
- [ ] Complete Step 1 (Creator Identity)
- [ ] Complete Step 2 (Skills & Experience)
- [ ] Click "Save Draft" button
- [ ] ✅ Should show "Draft saved successfully!"
- [ ] Refresh the page
- [ ] ✅ Should resume at Step 2 with data preserved

---

## Test 11: Validation Errors

- [ ] Create a new test account
- [ ] On Step 1, click "Next" without selecting roles
- [ ] ✅ Should show validation error
- [ ] Select roles and try again
- [ ] ✅ Should proceed to next step

---

## Test 12: Backend Validation

Test with invalid data (use Postman or browser console):

```javascript
// POST http://localhost:5000/api/onboarding/complete
// (Make sure you're authenticated with cookie)

// Test invalid experienceLevel
{
  "roles": ["video-editor"],
  "primaryRole": "video-editor",
  "experienceLevel": "professional", // OLD VALUE
  "skills": ["Test"],
  "goals": ["find-collaborators"],
  "collaborationPreferences": {
    "creatorRoles": ["animator"],
    "projectTypes": ["short-form-video"],
    "duration": "short-term",
    "workMode": "remote"
  }
}
// ❌ Should return 400 error: "Valid experience level required"
```

```javascript
// Test invalid goal
{
  "roles": ["video-editor"],
  "primaryRole": "video-editor",
  "experienceLevel": "expert",
  "skills": ["Test"],
  "goals": ["find-jobs"], // OLD VALUE
  "collaborationPreferences": {
    "creatorRoles": ["animator"],
    "projectTypes": ["short-form-video"],
    "duration": "short-term",
    "workMode": "remote"
  }
}
// ❌ Should return 400 error: "Invalid goal value"
```

```javascript
// Test invalid workMode
{
  "roles": ["video-editor"],
  "primaryRole": "video-editor",
  "experienceLevel": "expert",
  "skills": ["Test"],
  "goals": ["find-collaborators"],
  "collaborationPreferences": {
    "creatorRoles": ["animator"],
    "projectTypes": ["short-form-video"],
    "duration": "short-term",
    "workMode": "either" // OLD VALUE
  }
}
// ❌ Should return 400 error: "Invalid work mode value"
```

---

## Success Criteria

All tests should pass with:
- ✅ No validation errors for valid data
- ✅ Clear error messages for invalid data
- ✅ Correct data saved to MongoDB
- ✅ Onboarding completion status persists
- ✅ Dashboard redirects work correctly
- ✅ Draft saving works as expected

---

## If Tests Fail

1. Check server logs for errors
2. Check browser console for errors
3. Verify MongoDB connection
4. Verify `.env` file is correct
5. Run automated tests: `node test-onboarding-contract.js`
6. Check `ONBOARDING_DATA_CONTRACT.md` for field specifications

---

## Automated Tests

Before manual testing, verify automated tests pass:

```bash
node test-onboarding-contract.js
```

Expected output:
```
✅ Test 1 PASSED: Valid data accepted
✅ Test 2 PASSED: Invalid experienceLevel rejected
✅ Test 3 PASSED: Invalid goal rejected
✅ Test 4 PASSED: Invalid workMode rejected
✅ Test 5 PASSED: String duration accepted
✅ Test 6 PASSED: Array style accepted
🎉 All tests passed!
```

---

## Reporting Issues

If you find issues during manual testing:

1. Note the exact step where it fails
2. Check browser console for errors
3. Check server logs for validation errors
4. Note the data being submitted
5. Compare against `ONBOARDING_DATA_CONTRACT.md`

All fixes have been implemented and automated tests pass. Manual testing should verify the complete user flow works correctly.
