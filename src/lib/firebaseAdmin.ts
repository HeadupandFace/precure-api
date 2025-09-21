import * as admin from 'firebase-admin';

const rawKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!rawKey) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not set.');
}

let serviceAccount;

try {
  const parsed = JSON.parse(rawKey);

  if (!parsed.private_key || typeof parsed.private_key !== 'string') {
    throw new Error('Missing or invalid private_key in service account.');
  }

  const sanitizedKey = {
    ...parsed,
    private_key: parsed.private_key.replace(/\\n/g, '\n'),
  };

  serviceAccount = sanitizedKey;
} catch (error) {
  console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', {
    message: (error as Error).message,
    stack: (error as Error).stack,
  });
  throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_KEY format.');
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Firebase Admin initialized');
  }
}

export const auth = admin.auth();

export const verifyIdToken = async (token: string) => {
  if (!token || typeof token !== 'string') {
    throw new Error('Invalid token provided to verifyIdToken.');
  }

  return auth.verifyIdToken(token);
};