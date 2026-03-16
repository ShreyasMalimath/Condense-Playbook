#!/usr/bin/env node
/**
 * set-admin.js — Firebase Admin Custom Claims Script
 *
 * Run this ONCE to grant admin privileges to a Firebase user.
 * The admin user can then access the /admin route and view all user performance data.
 *
 * PREREQUISITES:
 * 1. Install admin SDK: npm install firebase-admin
 * 2. Download a service account key from Firebase Console:
 *    Firebase Console → Project Settings → Service Accounts → Generate New Private Key
 *    Save the file as `serviceAccountKey.json` in this scripts/ folder
 * 3. Run: node scripts/set-admin.js <USER_UID>
 *
 * To find a user's UID:
 *    Firebase Console → Authentication → Users → click on the user → copy UID
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
    console.error('\n❌ ERROR: serviceAccountKey.json not found in scripts/ folder.');
    console.error('   Download it from: Firebase Console → Project Settings → Service Accounts\n');
    process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const uid = process.argv[2];

if (!uid) {
    console.error('\n❌ ERROR: Please provide a user UID.');
    console.error('   Usage: node scripts/set-admin.js <USER_UID>\n');
    process.exit(1);
}

admin.auth().setCustomUserClaims(uid, { admin: true })
    .then(() => {
        console.log(`\n✅ SUCCESS: User ${uid} has been granted admin privileges.`);
        console.log('   The user must sign out and sign back in for the change to take effect.\n');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ ERROR:', error.message, '\n');
        process.exit(1);
    });
