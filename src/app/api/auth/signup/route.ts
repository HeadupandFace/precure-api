// src/app/api/auth/signup/route.ts

import { auth } from '@/lib/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: true, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    try {
      const userRecord = await auth.createUser({ email, password });

      return NextResponse.json(
        {
          success: true,
          uid: userRecord.uid,
          message: 'User created successfully.',
        },
        { status: 201 }
      );
    } catch (err: unknown) {
      const firebaseError = err as Error & { code?: string };

      console.error('❌ Firebase signup error:', {
        message: firebaseError.message,
        code: firebaseError.code,
        stack: firebaseError.stack,
      });

      switch (firebaseError.code) {
        case 'auth/email-already-exists':
          return NextResponse.json(
            { error: true, message: 'The email address is already in use.' },
            { status: 409 }
          );
        case 'auth/invalid-email':
          return NextResponse.json(
            { error: true, message: 'The email address is not valid.' },
            { status: 400 }
          );
        case 'auth/weak-password':
          return NextResponse.json(
            { error: true, message: 'Password should be at least 6 characters.' },
            { status: 400 }
          );
        default:
          return NextResponse.json(
            { error: true, message: 'Unexpected error during signup.' },
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