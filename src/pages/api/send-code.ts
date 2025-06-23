import type { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";

// Setup client with credentials
const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!);
const FROM_NUMBER = process.env.TWILIO_PHONE_NUMBER!;

// TEMPORARY IN-MEMORY CODE STORE
const codeStore = new Map<string, string>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "Missing phone number" });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  codeStore.set(phone, code); // store code for later verification

  try {
    await client.messages.create({
      body: `Your verification code is: ${code}`,
      from: FROM_NUMBER,
      to: phone,
    });

    return res.status(200).json({ success: true, code }); // send code back for dev
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export { codeStore };
