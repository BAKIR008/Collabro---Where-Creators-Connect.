# Onboarding System Quick Reference

## Valid Enum Values

### experienceLevel
```javascript
['beginner', 'intermediate', 'advanced', 'expert']
```

### goals
```javascript
['find-collaborators', 'build-portfolio', 'learn-skills', 'earn-income', 'network', 'get-discovered']
```

### collaborationPreferences.duration
```javascript
['one-time', 'short-term', 'long-term', 'ongoing']
```

### collaborationPreferences.workMode
```javascript
['remote', 'in-person', 'hybrid']
```

## Data Types

### Strings (single value)
- primaryRole
- customRole
- experienceLevel
- collaborationPreferences.duration
- collaborationPreferences.workMode

### Arrays (multiple values)
- roles (1-5 items)
- skills (1-15 items)
- tools (0-15 items)
- goals (1+ items)
- collaborationPreferences.creatorRoles (1+ items)
- collaborationPreferences.projectTypes (1+ items)
- workPreferences.categories (0-10 items)
- workPreferences.industries (0-10 items)
- workPreferences.style (0-8 items)

## Common Mistakes to Avoid

❌ DON'T use 'professional' → ✅ USE 'expert'
❌ DON'T use 'either' → ✅ USE 'hybrid'
❌ DON'T use 'local' → ✅ USE 'in-person'
❌ DON'T send duration as array → ✅ SEND as string
❌ DON'T send style as string → ✅ SEND as array

## Test Your Changes

```bash
node test-onboarding-contract.js
```

Should output:
```
✅ Test 1 PASSED: Valid data accepted
✅ Test 2 PASSED: Invalid experienceLevel rejected
✅ Test 3 PASSED: Invalid goal rejected
✅ Test 4 PASSED: Invalid workMode rejected
✅ Test 5 PASSED: String duration accepted
✅ Test 6 PASSED: Array style accepted
🎉 All tests passed!
```

## API Endpoints

### GET /api/onboarding/status
Returns: `{ success, onboarding: { status, completed, ... } }`

### GET /api/onboarding/responses
Returns: `{ success, profile: { roles, primaryRole, ... } }`

### PATCH /api/onboarding/responses
Body: Partial profile data + currentStepId
Returns: `{ success, message }`

### POST /api/onboarding/complete
Body: Complete profile data (all required fields)
Returns: `{ success, message, user, dashboardRoute }`

## Full Documentation

See `ONBOARDING_DATA_CONTRACT.md` for complete specifications.
