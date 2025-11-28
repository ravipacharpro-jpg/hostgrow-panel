import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method!=='POST') return res.status(405).end();
  const { panelId } = req.query;
  const { key, enabled } = req.body;
  // TODO: verify Main role via token
  await db(`INSERT INTO panel_features(panel_id, key, enabled)
            VALUES($1,$2,$3)
            ON CONFLICT(panel_id,key) DO UPDATE SET enabled=EXCLUDED.enabled`, [panelId, key, !!enabled]);
  res.json({ ok:true });
}
