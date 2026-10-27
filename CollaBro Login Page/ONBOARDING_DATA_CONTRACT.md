# CollaBro Onboarding Data Contract

This document defines the complete data contract between the frontend, API, and database for the onboarding system.

## Last Updated
2026-09-29

## Overview
All fields must match these exact specifications across the entire stack.

---

## Field Specifications

### 1. roles
- **Type**: Array of Strings
- **Required**: Yes
- **Min**: 1
- **Max**: 5
- **Allowed Values**: Any valid role ID from CREATOR_ROLES + 'other'
- **Frontend Component**: CreatorIdentityStep (RoleCard multi-select)
- **Example**: `["video-editor", "content-creator"]`

### 2. primaryRole
- **Type**: String
- **Required**: Yes
- **Validation**: Must be one of the selected roles
- **Frontend Component**: CreatorIdentityStep (primary designation)
- **Example**: `"video-editor"`

### 3. customRole
- **Type**: String or null
- **Required**: No (only if 'other' is in roles)
- **Max Length**: 100 characters
- **Frontend Component**: CreatorIdentityStep (text input)
- **Example**: `"Podcast Producer"`

### 4. experienceLevel
- **Type**: String
- **Required**: Yes
- **Allowed Values**: `['beginner', 'intermediate', 'advanced', 'expert']`
- **Frontend Component**: SkillsExperienceStep (radio cards)
- **Example**: `"intermediate"`

### 5. skills
- **Type**: Array of Strings
- **Required**: Yes
- **Min**: 1
- **Max**: 15
- **Max Length per item**: 50 characters
- **Frontend Component**: SkillsExperienceStep (tag input)
- **Example**: `["Adobe Premiere", "Final Cut Pro"]`

### 6. tools
- **Type**: Array of Strings
- **Required**: No
- **Max**: 15
- **Max Length per item**: 50 characters
- **Frontend Component**: SkillsExperienceStep (tag input)
- **Example**: `["Photoshop", "After Effects"]`

### 7. goals
- **Type**: Array of Strings
- **Required**: Yes
- **Min**: 1
- **Allowed Values**: `['find-collaborators', 'build-portfolio', 'learn-skills', 'earn-income', 'network', 'get-discovered']`
- **Frontend Component**: GoalsStep (checkbox cards)
- **Example**: `["find-collaborators", "build-portfolio"]`

### 8. collaborationPreferences.creatorRoles
- **Type**: Array of Strings
- **Required**: Yes
- **Min**: 1
- **Allowed Values**: Any valid role ID from CREATOR_ROLES
- **Frontend Component**: CollaborationStep (role chips multi-select)
- **Example**: `["graphic-designer", "animator"]`

### 9. collaborationPreferences.projectTypes
- **Type**: Array of Strings
- **Required**: Yes
- **Min**: 1
- **Max Length per item**: 50 characters
- **Allowed Values**: `['short-form-video', 'long-form-video', 'social-media-content', 'brand-collaborations', 'personal-projects', 'commercial-work', 'educational-content', 'creative-experiments']`
- **Frontend Component**: CollaborationStep (checkbox cards)
- **Example**: `["short-form-video", "brand-collaborations"]`

### 10. collaborationPreferences.duration
- **Type**: String
- **Required**: Yes
- **Allowed Values**: `['one-time', 'short-term', 'long-term', 'ongoing']`
- **Frontend Component**: CollaborationStep (radio cards)
- **Example**: `"short-term"`

### 11. collaborationPreferences.workMode
- **Type**: String
- **Required**: Yes
- **Allowed Values**: `['remote', 'in-person', 'hybrid']`
- **Frontend Component**: CollaborationStep (radio cards)
- **Example**: `"hybrid"`

### 12. workPreferences.categories
- **Type**: Array of Strings
- **Required**: No
- **Max**: 10
- **Max Length per item**: 50 characters
- **Frontend Component**: WorkPreferencesStep (tag input)
- **Example**: `["Gaming", "Tech"]`

### 13. workPreferences.industries
- **Type**: Array of Strings
- **Required**: No
- **Max**: 10
- **Max Length per item**: 50 characters
- **Frontend Component**: WorkPreferencesStep (tag input)
- **Example**: `["Entertainment", "Fashion"]`

### 14. workPreferences.style
- **Type**: Array of Strings
- **Required**: No
- **Max**: 8
- **Max Length per item**: 50 characters
- **Frontend Component**: WorkPreferencesStep (tag input)
- **Example**: `["Cinematic", "Bold"]`

---

## Changes Made (2026-09-29)

### 1. experienceLevel
- **Before**: `['beginner', 'intermediate', 'advanced', 'professional']`
- **After**: `['beginner', 'intermediate', 'advanced', 'expert']`
- **Reason**: Frontend used 'expert' but schema had 'professional'

### 2. goals
- **Before**: `['find-collaborators', 'find-projects', 'find-jobs', 'build-portfolio', 'showcase-work', 'meet-creators', 'learn-skills', 'find-clients', 'build-team', 'share-resources']`
- **After**: `['find-collaborators', 'build-portfolio', 'learn-skills', 'earn-income', 'network', 'get-discovered']`
- **Reason**: Match frontend GoalsStep options exactly

### 3. collaborationPreferences.duration
- **Before**: Array `[{type: String, enum: ['short-term', 'long-term', 'both']}]`
- **After**: String `{type: String, enum: ['one-time', 'short-term', 'long-term', 'ongoing']}`
- **Reason**: Frontend submits single string, not array

### 4. collaborationPreferences.workMode
- **Before**: `['remote', 'local', 'either']`
- **After**: `['remote', 'in-person', 'hybrid']`
- **Reason**: Match frontend CollaborationStep options

### 5. workPreferences.style
- **Before**: String `{type: String, enum: ['solo', 'team', 'both']}`
- **After**: Array `[{type: String, maxlength: 50}]`
- **Reason**: Frontend uses tag input allowing multiple free-text style descriptions

---

## API Response Structure

### GET /api/onboarding/status
```json
{
  "success": true,
  "onboarding": {
    "status": "in_progress",
    "completed": false,
    "surveyVersion": 1,
    "currentStepId": "skills-experience",
    "completedAt": null
  }
}
```

### GET /api/onboarding/responses
```json
{
  "success": true,
  "profile": {
    "roles": ["video-editor"],
    "primaryRole": "video-editor",
    "customRole": null,
    "skills": ["Adobe Premiere"],
    "experienceLevel": "intermediate",
    "tools": [],
    "goals": ["find-collaborators"],
    "collaborationPreferences": {
      "creatorRoles": ["graphic-designer"],
      "projectTypes": ["short-form-video"],
      "duration": "short-term",
      "workMode": "remote"
    },
    "workPreferences": {
      "categories": ["Gaming"],
      "industries": [],
      "style": ["Cinematic"]
    }
  }
}
```

### POST /api/onboarding/complete
**Request Body**: All fields from profile above

**Success Response**:
```json
{
  "success": true,
  "message": "Onboarding completed successfully!",
  "user": {
    "onboarding": {
      "status": "completed",
      "completedAt": "2026-09-29T12:00:00.000Z"
    }
  },
  "dashboardRoute": "/dashboard"
}
```

**Validation Error Response**:
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "field": "goals",
      "message": "Invalid goal value."
    }
  ]
}
```

---

## Testing Checklist

- [ ] All goal values are accepted: find-collaborators, build-portfolio, learn-skills, earn-income, network, get-discovered
- [ ] experienceLevel 'expert' is accepted (not 'professional')
- [ ] workMode 'hybrid' is accepted (not 'either')
- [ ] duration is submitted as string, not array
- [ ] workPreferences.style is submitted as array of strings
- [ ] Empty optional arrays are handled correctly
- [ ] Draft saving works with partial data
- [ ] Complete endpoint validates all required fields
- [ ] Validation errors return field-level messages

---

## Migration Notes

No database migration is required. Existing profiles with old enum values will:
- Continue to work for read operations
- Be validated against new rules on update
- Need manual review if old values don't map to new values

For production deployment, run a migration script to map:
- 'professional' → 'expert' (if any exist)
- 'either' → 'hybrid' (if any exist)
- 'local' → 'in-person' (if any exist)
