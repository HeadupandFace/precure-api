import * as admin from 'firebase-admin';

if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not set.');
}

let serviceAccount: admin.ServiceAccount;
try {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const parsed = JSON.parse(raw);

  // 🔥 Fix the PEM format by replacing escaped newlines with real ones
  parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');

  serviceAccount = parsed;
} catch (error) {
  console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', error);
  throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_KEY format.');
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const verifyIdToken = async (token: string) => {
  return admin.auth().verifyIdToken(token);
};