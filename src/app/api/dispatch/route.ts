// File: src/app/api/dispatch/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/firebaseAdmin';
import { uploadToDropbox } from '@/lib/dropboxClient';

export async function POST(req: NextRequest) {
  try {
    const { idToken, payload } = await req.json();

    // Optional: verify Firebase token
    const decoded = await verifyIdToken(idToken);
    const uid = decoded.uid;

    // Upload to Dropbox
    const result = await uploadToDropbox(uid, payload);

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Dispatch error:', error);
    return NextResponse.json({ error: true, message: error.message }, { status: 500 });
  }
}