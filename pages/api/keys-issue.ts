import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
function rand(){ return 'K-' + Math.random().toString(36).slice(2,10).toUpperCase(); }
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method!=='POST') return res.status(405).end();
  const { productCode='LIC', variantCode='1D', keyName=null, panelId } = req.body;
  const prod = await db('SELECT id FROM products WHERE code=$1',[productCode]);
  if(!prod[0]) return res.status(400).json({error:'PRODUCT_NOT_FOUND'});
  const vari = await db('SELECT id FROM product_variants WHERE product_id=$1 AND code=$2',[prod[0].id, variantCode]);
  if(!vari[0]) return res.status(400).json({error:'VARIANT_NOT_FOUND'});
  const k = rand();
  const rows = await db(`INSERT INTO license_keys(id, panel_id, product_id, variant_id, key, key_name)
                         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
                         RETURNING id, key`, [panelId, prod[0].id, vari[0].id, k, keyName]);
  res.json({ ok:true, key: rows[0].key });
}
