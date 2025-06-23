// pages/api/verify-code.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { codeStore } from "./send-code";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ success: false, error: "Missing phone or code." });
  }

  const storedCode = codeStore.get(phone);

  if (!storedCode) {
    return res.status(404).json({ success: false, error: "No code found for this phone number." });
  }

  if (storedCode === code) {
    codeStore.delete(phone); // Optional: clean up after verification
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ success: false, error: "Invalid verification code." });
  }
}
