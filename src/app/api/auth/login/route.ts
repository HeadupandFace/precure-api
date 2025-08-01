import { auth } from '@/lib/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // The request body can only be read once.
    const { idToken } = await req.json();

    // The only thing this route needs is the idToken from the client.
    if (!idToken) {
      return NextResponse.json({ message: 'Authorization token is required' }, { status: 401 });
    }

    // Verify the token using the Firebase Admin SDK
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // If we get here, the token is valid.
    return NextResponse.json({
      message: 'User authenticated successfully!',
      uid: decodedToken.uid,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Authentication error:', error);
    // Handle specific Firebase Admin SDK errors
    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json({ message: 'Token expired' }, { status: 401 });
    }
    if (error.code === 'auth/invalid-id-token') {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    // Handle general errors (e.g., failed to parse JSON)
    return NextResponse.json({ message: 'Authentication failed.' }, { status: 500 });
  }
}