// File: src/app/api/dispatch/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/firebaseAdmin';
import { uploadToDropbox } from '@/lib/dropboxClient';

export async function POST(req: NextRequest) {
  try {
    const { idToken, payload } = await req.json();

    if (!idToken || !payload || typeof payload !== 'object') {
      return NextResponse.json(
        { error: true, message: 'Missing or invalid idToken or payload.' },
        { status: 400 }
      );
    }

    const decoded = await verifyIdToken(idToken);
    const uid = decoded?.uid;

    if (!uid || typeof uid !== 'string') {
      return NextResponse.json(
        { error: true, message: 'Invalid token: UID missing.' },
        { status: 401 }
      );
    }

    const result = await uploadToDropbox(uid, payload as Record<string, any>);

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (err: unknown) {
    const error = err as Error & { code?: string };

    console.error('❌ Dispatch error:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });

    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json({ error: true, message: 'Token expired.' }, { status: 401 });
    }
    if (error.code === 'auth/invalid-id-token') {
      return NextResponse.json({ error: true, message: 'Invalid token.' }, { status: 401 });
    }

    return NextResponse.json(
      { error: true, message: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json(
    { error: true, message: 'GET method not supported on this route.' },
    { status: 405 }
  );
  }