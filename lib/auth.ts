// lib/auth.ts
import { getApps, initializeApp, cert, AppOptions } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Vercel env me ye JSON string hoti hai
const sa = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string)
  : null;

if (!getApps().length) {
  initializeApp({
    credential: cert(sa),
  } as AppOptions);
}

/** Verify Firebase ID Token coming from client */
export async function verifyIdToken(idToken: string) {
  const adminAuth = getAuth();
  const decoded = await adminAuth.verifyIdToken(idToken);
  return decoded;
}
