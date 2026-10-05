/**
 * Test script to verify onboarding data contract
 * Run with: node test-onboarding-contract.js
 */

import mongoose from 'mongoose';
import CreatorProfile from './server/models/CreatorProfile.js';

// Test data matching the expected contract
const validTestData = {
  user: new mongoose.Types.ObjectId(),
  primaryRole: 'video-editor',
  roles: ['video-editor', 'content-creator'],
  customRole: null,
  experienceLevel: 'expert', // Changed from 'professional'
  skills: ['Adobe Premiere', 'Final Cut Pro'],
  tools: ['Photoshop'],
  goals: ['find-collaborators', 'earn-income', 'network'], // New values
  collaborationPreferences: {
    creatorRoles: ['graphic-designer'],
    projectTypes: ['short-form-video'],
    duration: 'short-term', // String, not array
    workMode: 'hybrid', // Changed from 'either'
  },
  workPreferences: {
    categories: ['Gaming'],
    industries: ['Entertainment'],
    style: ['Cinematic', 'Bold'], // Array of strings, not enum
  },
};

console.log('Testing onboarding data contract...\n');

// Test 1: Valid data should pass
try {
  const profile = new CreatorProfile(validTestData);
  const validationError = profile.validateSync();
  
  if (validationError) {
    console.log('❌ Test 1 FAILED: Valid data was rejected');
    console.log('Errors:', validationError.errors);
    process.exit(1);
  } else {
    console.log('✅ Test 1 PASSED: Valid data accepted');
  }
} catch (err) {
  console.log('❌ Test 1 FAILED with exception:', err.message);
  process.exit(1);
}

// Test 2: Invalid experienceLevel should fail
try {
  const invalidProfile = new CreatorProfile({
    ...validTestData,
    user: new mongoose.Types.ObjectId(),
    experienceLevel: 'professional', // OLD value
  });
  
  const validationError = invalidProfile.validateSync();
  
  if (validationError && validationError.errors.experienceLevel) {
    console.log('✅ Test 2 PASSED: Invalid experienceLevel rejected');
  } else {
    console.log('❌ Test 2 FAILED: Invalid experienceLevel was accepted');
    process.exit(1);
  }
} catch (err) {
  console.log('❌ Test 2 FAILED with exception:', err.message);
  process.exit(1);
}

// Test 3: Invalid goal should fail
try {
  const invalidProfile = new CreatorProfile({
    ...validTestData,
    user: new mongoose.Types.ObjectId(),
    goals: ['find-jobs'], // OLD value
  });
  
  const validationError = invalidProfile.validateSync();
  
  if (validationError && validationError.errors['goals.0']) {
    console.log('✅ Test 3 PASSED: Invalid goal rejected');
  } else {
    console.log('❌ Test 3 FAILED: Invalid goal was accepted');
    process.exit(1);
  }
} catch (err) {
  console.log('❌ Test 3 FAILED with exception:', err.message);
  process.exit(1);
}

// Test 4: Invalid workMode should fail
try {
  const invalidProfile = new CreatorProfile({
    ...validTestData,
    user: new mongoose.Types.ObjectId(),
    collaborationPreferences: {
      ...validTestData.collaborationPreferences,
      workMode: 'either', // OLD value
    },
  });
  
  const validationError = invalidProfile.validateSync();
  
  if (validationError && validationError.errors['collaborationPreferences.workMode']) {
    console.log('✅ Test 4 PASSED: Invalid workMode rejected');
  } else {
    console.log('❌ Test 4 FAILED: Invalid workMode was accepted');
    process.exit(1);
  }
} catch (err) {
  console.log('❌ Test 4 FAILED with exception:', err.message);
  process.exit(1);
}

// Test 5: Duration as string (not array) should pass
try {
  const profile = new CreatorProfile({
    ...validTestData,
    user: new mongoose.Types.ObjectId(),
    collaborationPreferences: {
      ...validTestData.collaborationPreferences,
      duration: 'long-term', // String
    },
  });
  
  const validationError = profile.validateSync();
  
  if (validationError) {
    console.log('❌ Test 5 FAILED: String duration was rejected');
    console.log('Errors:', validationError.errors);
    process.exit(1);
  } else {
    console.log('✅ Test 5 PASSED: String duration accepted');
  }
} catch (err) {
  console.log('❌ Test 5 FAILED with exception:', err.message);
  process.exit(1);
}

// Test 6: style as array should pass
try {
  const profile = new CreatorProfile({
    ...validTestData,
    user: new mongoose.Types.ObjectId(),
    workPreferences: {
      ...validTestData.workPreferences,
      style: ['Minimalist', 'Clean'], // Array
    },
  });
  
  const validationError = profile.validateSync();
  
  if (validationError) {
    console.log('❌ Test 6 FAILED: Array style was rejected');
    console.log('Errors:', validationError.errors);
    process.exit(1);
  } else {
    console.log('✅ Test 6 PASSED: Array style accepted');
  }
} catch (err) {
  console.log('❌ Test 6 FAILED with exception:', err.message);
  process.exit(1);
}

console.log('\n🎉 All tests passed! Data contract is correct.\n');
process.exit(0);
