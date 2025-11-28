import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

function randPass(){ return 'HostGrow' + Math.floor(1000+Math.random()*9000) + '!'; }

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method!=='POST') return res.status(405).end();
  try{
    const slug = process.env.MAIN_PANEL_SLUG||'main';
    const rows = await db(`INSERT INTO panels(id, slug, name) VALUES (gen_random_uuid(), $1, 'Main Panel')
                           ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name
                           RETURNING id`, [slug]);
    const mainId = rows[0].id;
    const temp = randPass();
    // Firebase user not created here; create app user row only (link later when mainadmin logs in)
    await db(`INSERT INTO users(id, panel_id, name, username, role)
              VALUES (gen_random_uuid(), $1, 'Main Admin', 'mainadmin', 'Main')
              ON CONFLICT (username) DO NOTHING`, [mainId]);
    res.json({ panelId: mainId, username: 'mainadmin', tempPassword: temp });
  }catch(e:any){
    res.status(400).json({error:'SEED_ERR', detail:String(e)});
  }
}
