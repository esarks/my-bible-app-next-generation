// pages/api/send-code.ts
import type { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!);
const FROM_NUMBER = process.env.TWILIO_PHONE_NUMBER!;

// TEMPORARY IN-MEMORY CODE STORE (dev only)
const codeStore = new Map<string, string>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { phone } = req.body;

  if (!phone) {
    console.error("Missing phone number in request body.");
    return res.status(400).json({ error: "Missing phone number" });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  codeStore.set(phone, code);
  console.log(`Generated verification code ${code} for phone ${phone}`);

  try {
    const result = await client.messages.create({
      body: `Your verification code is: ${code}`,
      from: FROM_NUMBER,
      to: phone,
    });

    console.log(`Sent code via Twilio: SID=${result.sid}`);
    return res.status(200).json({ success: true, code });
  } catch (error: any) {
    console.error("Twilio error:", error);
    return res.status(500).json({ error: error.message });
  }
}

export { codeStore };
