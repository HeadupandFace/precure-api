import { auth } from '@/lib/firebaseAdmin'; // Adjust path if you placed firebaseAdmin.ts elsewhere
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Create user in Firebase Authentication
    const userRecord = await auth.createUser({
      email: email,
      password: password,
    });

    // For now, simply return the UID
    return NextResponse.json({ uid: userRecord.uid, message: 'User created successfully!' }, { status: 201 });

  } catch (error: any) {
    console.error('Signup error:', error);

    // Firebase Auth error codes: https://firebase.google.com/docs/auth/admin/errors
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json({ message: 'The email address is already in use by an existing user.' }, { status: 409 });
    }
    if (error.code === 'auth/invalid-email') {
      return NextResponse.json({ message: 'The email address is not valid.' }, { status: 400 });
    }
    if (error.code === 'auth/weak-password') {
      return NextResponse.json({ message: 'Password should be at least 6 characters.' }, { status: 400 });
    }

    return NextResponse.json({ message: 'An unexpected error occurred during signup.' }, { status: 500 });
  }
}