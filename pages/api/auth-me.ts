import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyIdToken } from '@/lib/auth';
import { db } from '@/lib/db';

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  try{
    const idToken = (req.headers.authorization||'').replace('Bearer ','').trim();
    if(!idToken) return res.status(401).json({error:'NO_TOKEN'});
    const d = await verifyIdToken(idToken);
    // load app user
    const rows = await db(`SELECT u.id, u.username, u.role, u.panel_id, p.slug FROM users u JOIN panels p ON p.id=u.panel_id WHERE u.firebase_uid=$1`, [d.uid]);
    const user = rows[0]||null;
    return res.json({ firebase: d, user });
  }catch(e:any){
    return res.status(401).json({error:'BAD_TOKEN', detail: String(e)});
  }
}
