import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method!=='POST') return res.status(405).end();
  const { keyId, seconds=86400 } = req.body;
  await db(`UPDATE license_keys
            SET expires_at = COALESCE(
              CASE WHEN expires_at > now() THEN expires_at ELSE now() END + make_interval(secs=>$1),
              now() + make_interval(secs=>$1)
            )
            WHERE id=$2`, [seconds, keyId]);
  res.json({ ok:true });
}
