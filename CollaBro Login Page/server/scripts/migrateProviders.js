/**
 * CollaBro — Database Migration Script
 * Migrates existing users from 'provider' (string) to 'providers' (array)
 * 
 * Run with: node server/scripts/migrateProviders.js
 */

import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

async function migrateProviders() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Find all users with old 'provider' field
    const oldUsers = await usersCollection.find({ provider: { $exists: true } }).toArray();

    if (oldUsers.length === 0) {
      console.log('✅ No users found with old schema. Migration not needed.');
      await mongoose.disconnect();
      return;
    }

    console.log(`📊 Found ${oldUsers.length} users to migrate:\n`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const user of oldUsers) {
      const oldProvider = user.provider;
      
      // Skip if already has providers array
      if (user.providers && Array.isArray(user.providers)) {
        console.log(`⏭️  Skipped: ${user.email} (already has providers array)`);
        skippedCount++;
        continue;
      }

      // Convert string to array
      const newProviders = [oldProvider];

      // Update the user
      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: { providers: newProviders },
          $unset: { provider: '' } // Remove old field
        }
      );

      console.log(`✅ Migrated: ${user.email} | ${oldProvider} → [${newProviders.join(', ')}]`);
      migratedCount++;
    }

    console.log(`\n📈 Migration Summary:`);
    console.log(`   ✅ Migrated: ${migratedCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   📊 Total: ${oldUsers.length}\n`);

    console.log('✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

migrateProviders();
