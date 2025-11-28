import type { NextApiRequest, NextApiResponse } from "next";
import { verifyIdToken } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const token = (req.headers.authorization || "")
      .replace("Bearer ", "")
      .trim();

    if (!token)
      return res.status(401).json({ error: "NO_TOKEN" });

    const userData = await verifyIdToken(token);

    const rows = await db(
      `SELECT u.id, u.username, u.role, u.panel_id, p.slug 
       FROM users u 
       JOIN panels p ON p.id = u.panel_id 
       WHERE u.firebase_uid = $1`,
      [userData.uid]
    );

    return res.json({
      firebase: userData,
      user: rows[0] || null,
    });
  } catch (err: any) {
    return res.status(401).json({
      error: "BAD_TOKEN",
      detail: String(err),
    });
  }
}
