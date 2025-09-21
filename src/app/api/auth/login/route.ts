// src/app/api/auth/login/route.ts

import { auth } from '@/lib/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    if (!idToken || typeof idToken !== 'string') {
      return NextResponse.json(
        { error: true, message: 'Authorization token is required.' },
        { status: 401 }
      );
    }

    try {
      const decodedToken = await auth.verifyIdToken(idToken);

      return NextResponse.json(
        {
          success: true,
          message: 'User authenticated successfully.',
          uid: decodedToken.uid,
        },
        { status: 200 }
      );
    } catch (err: unknown) {
      const firebaseError = err as Error & { code?: string };

      console.error('❌ Token verification error:', {
        message: firebaseError.message,
        code: firebaseError.code,
        stack: firebaseError.stack,
      });

      switch (firebaseError.code) {
        case 'auth/id-token-expired':
          return NextResponse.json(
            { error: true, message: 'Token expired.' },
            { status: 401 }
          );
        case 'auth/invalid-id-token':
          return NextResponse.json(
            { error: true, message: 'Invalid token.' },
            { status: 401 }
          );
        default:
          return NextResponse.json(
            { error: true, message: 'Token verification failed.' },
            { status: 500 }
          );
      }
    }
  } catch (err: unknown) {
    const error = err as Error;

    console.error('❌ Request parsing error:', {
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      { error: true, message: 'Invalid request body.' },
      { status: 400 }
    );
  }
}