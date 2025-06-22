// pages/api/verify-code.ts
import type { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { phone, code } = req.body;

  try {
    const result = await client.verify
      .services(process.env.TWILIO_VERIFY_SID!)
      .verificationChecks.create({ to: phone, code });

    res.status(200).json({ success: result.status === "approved" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
