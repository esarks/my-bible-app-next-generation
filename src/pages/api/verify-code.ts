// pages/api/verify-code.ts
import type { NextApiRequest, NextApiResponse } from "next";
import codeStore from "../../lib/code-store";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ error: "Missing phone or code" });
  }

  const expectedCode = codeStore.get(phone);
  if (expectedCode === code) {
    codeStore.delete(phone); // Optional: one-time use
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ success: false, error: "Incorrect code" });
  }
}
