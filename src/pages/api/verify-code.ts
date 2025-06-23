// pages/api/verify-code.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { codeStore } from "./send-code"; // Import the shared in-memory store

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ error: "Missing phone or code" });
  }

  const storedCode = codeStore.get(phone);

  if (!storedCode) {
    return res.status(400).json({ success: false, error: "No code found for this number" });
  }

  const success = storedCode === code;

  return res.status(200).json({ success });
}
