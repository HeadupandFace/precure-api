import { auth } from '@/lib/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    try {
      // Create user in Firebase Authentication
      const userRecord = await auth.createUser({
        email: email,
        password: password,
      });

      return NextResponse.json({ uid: userRecord.uid, message: 'User created successfully!' }, { status: 201 });
    } catch (firebaseError: any) {
      console.error('Firebase signup error:', firebaseError);

      if (firebaseError.code === 'auth/email-already-exists') {
        return NextResponse.json({ message: 'The email address is already in use by an existing user.' }, { status: 409 });
      } else if (firebaseError.code === 'auth/invalid-email') {
        return NextResponse.json({ message: 'The email address is not valid.' }, { status: 400 });
      } else if (firebaseError.code === 'auth/weak-password') {
        return NextResponse.json({ message: 'Password should be at least 6 characters.' }, { status: 400 });
      } else {
        return NextResponse.json({ message: 'An unexpected error occurred during signup.' }, { status: 500 });
      }
    }

  } catch (error: any) {
    console.error('Request parsing error:', error);
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }
}