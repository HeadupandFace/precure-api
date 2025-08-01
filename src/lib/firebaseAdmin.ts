import * as admin from 'firebase-admin';

// Ensure the environment variable is present
if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
}

// Parse the service account key from the environment variable
let serviceAccount;
try {
  // The environment variable stores the JSON as a string, so we need to parse it back into an object.
  // Ensure the JSON string is correctly formatted (all on one line, double-quoted, then wrapped in outer single quotes in .env.local)
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
} catch (error) {
  console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Check your .env.local file formatting.', error);
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not a valid JSON string. Please ensure it\'s correctly formatted as a single-line string in .env.local.');
}

// Initialize Firebase Admin SDK if it hasn't been initialized already
// This check is important for Next.js API routes which can be "warm" between requests.
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Export the Firebase Admin instance for use in API routes
export const auth = admin.auth();
export const firestore = admin.firestore(); // Example: if you plan to use Firestore later
// You can export other services like admin.storage(), admin.messaging() etc. as needed
