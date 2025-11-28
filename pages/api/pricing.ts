import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method==='GET'){
    const prods = await db(`SELECT p.*, (
      SELECT json_agg(json_build_object('id',v.id,'code',v.code,'name',v.name,'duration_seconds',v.duration_seconds,'base_price_cents',v.base_price_cents,'active',v.active))
      FROM product_variants v WHERE v.product_id=p.id
    ) AS variants FROM products p WHERE p.active=true ORDER BY p.created_at DESC`);
    return res.json(prods);
  }
  if(req.method==='POST'){
    // Expecting role check on client (demo). For production, add token + role verification here.
    const { productCode, basePriceCents, taxRateBps, variants } = req.body;
    const prod = await db('UPDATE products SET base_price_cents=$2, tax_rate_bps=$3 WHERE code=$1 RETURNING id', [productCode, basePriceCents, taxRateBps]);
    if(!prod[0]) return res.status(404).json({error:'PRODUCT_NOT_FOUND'});
    if(Array.isArray(variants)){
      for(const v of variants){
        await db('UPDATE product_variants SET base_price_cents=$2, active=COALESCE($3,true) WHERE product_id=$1 AND code=$4', [prod[0].id, v.base_price_cents||0, v.active, v.code]);
      }
    }
    return res.json({ ok:true });
  }
  res.status(405).end();
}
