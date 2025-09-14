import * as admin from 'firebase-admin';

// Ensure the environment variable is present
if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  console.error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
}

// Parse the service account key from the environment variable
let serviceAccount: admin.ServiceAccount;
try {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  serviceAccount = JSON.parse(serviceAccountKey) as admin.ServiceAccount;
} catch (error) {
  console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Check your .env.local formatting.', error);
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not a valid JSON string.');
}

// Initialize Firebase Admin SDK if not already initialized
if (admin.apps.length === 0) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized.');
  } catch (error) {
    console.error('Firebase Admin SDK initialization failed:', error);
    throw new Error('Check your service account credentials and Firebase project config.');
  }
}

// ✅ Named export for token verification
export const verifyIdToken = async (token: string) => {
  return admin.auth().verifyIdToken(token);
};

// Optional exports for future use
export const auth = admin.auth();
export const firestore = admin.firestore();