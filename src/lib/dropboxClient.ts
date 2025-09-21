// File: src/lib/dropboxClient.ts

const DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN;

if (!DROPBOX_ACCESS_TOKEN) {
  throw new Error('DROPBOX_ACCESS_TOKEN is not set in environment variables.');
}

export async function uploadToDropbox(uid: string, payload: Record<string, any>) {
  const path = `/prokur/${uid}/${Date.now()}.json`;

  try {
    const res = await fetch('https://content.dropboxapi.com/2/files/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${DROPBOX_ACCESS_TOKEN}`,
        'Dropbox-API-Arg': JSON.stringify({
          path,
          mode: 'add',
          autorename: true,
          mute: false,
        }),
        'Content-Type': 'application/octet-stream',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Dropbox upload failed:', {
          status: res.status,
          error: errorText,
        });
      }
      throw new Error(`Dropbox upload failed: ${errorText}`);
    }

    const result = await res.json();

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Dropbox upload successful:', {
        path,
        size: JSON.stringify(payload).length,
      });
    }

    return result;
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Dropbox upload exception:', {
        message: error.message,
        stack: error.stack,
      });
    }
    throw error;
  }
}