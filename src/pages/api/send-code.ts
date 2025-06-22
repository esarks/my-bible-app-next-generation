// pages/api/send-code.ts
import type { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { phone } = req.body;

  try {
    const result = await client.verify
      .services(process.env.TWILIO_VERIFY_SID!)
      .verifications.create({ to: phone, channel: "sms" });

    res.status(200).json({ success: true, result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
