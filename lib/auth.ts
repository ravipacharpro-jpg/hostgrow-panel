import jwt from 'jsonwebtoken';
import * as admin from 'firebase-admin';

let app: admin.app.App | null = null;
export function getAdmin(){
  if(!app){
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if(!raw) throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_JSON');
    const conf = JSON.parse(raw);
    app = admin.initializeApp({
      credential: admin.credential.cert(conf),
    });
  }
  return app;
}

export async function verifyIdToken(idToken: string){
  const adm = getAdmin();
  const decoded = await adm.auth().verifyIdToken(idToken);
  return decoded; // contains uid, etc.
}
