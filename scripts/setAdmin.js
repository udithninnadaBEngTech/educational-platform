/**
 * Usage: node scripts/setAdmin.js user@example.com
 *
 * This script uses the Firebase Admin SDK to set custom claims (admin:true)
 * on the specified user. You'll need to download a service account JSON
 * from the Firebase Console and place it at `scripts/serviceAccountKey.json`.
 */
const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
} catch (err) {
  console.error('Failed to load serviceAccountKey.json. See README in Firebase console.');
  process.exit(1);
}

const email = process.argv[2];
if (!email) {
  console.error('Usage: node scripts/setAdmin.js email@example.com');
  process.exit(1);
}

(async () => {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`Set admin=true for ${email}`);
    process.exit(0);
  } catch (err) {
    console.error('Error setting admin claim:', err);
    process.exit(1);
  }
})();
