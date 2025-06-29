// pages/api/send-code.ts
import type { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";

// Ensure required environment variables are loaded
console.debug("[send-code] Initializing Twilio client...");
const SID = process.env.TWILIO_SID!;
const TOKEN = process.env.TWILIO_AUTH_TOKEN!;
const FROM_NUMBER = process.env.TWILIO_PHONE_NUMBER!;

if (!SID || !TOKEN || !FROM_NUMBER) {
  console.error("[send-code] Missing Twilio environment variables", {
    TWILIO_SID: !!SID,
    TWILIO_AUTH_TOKEN: !!TOKEN,
    TWILIO_PHONE_NUMBER: !!FROM_NUMBER,
  });
}

const client = twilio(SID, TOKEN);

// TEMPORARY IN-MEMORY CODE STORE (Not production safe)
const codeStore = new Map<string, string>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.debug("[send-code] API called", {
    method: req.method,
    body: req.body,
  });

  if (req.method !== "POST") {
    console.warn("[send-code] Method not allowed:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone } = req.body;

  if (!phone) {
    console.warn("[send-code] Missing phone number in request body");
    return res.status(400).json({ error: "Missing phone number" });
  }

  console.debug("[send-code] Valid phone number received:", phone);

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  codeStore.set(phone, code);

  console.debug("[send-code] Generated and stored verification code", {
    phone,
    code,
    codeStoreSize: codeStore.size,
  });

  try {
    console.debug("[send-code] Sending message via Twilio...", {
      from: FROM_NUMBER,
      to: phone,
      body: `Your verification code is: ${code}`,
    });

    const message = await client.messages.create({
      body: `Your verification code is: ${code}`,
      from: FROM_NUMBER,
      to: phone,
    });

    console.info("[send-code] Message sent successfully", {
      sid: message.sid,
      status: message.status,
      to: message.to,
    });

    // Send the code back for dev/testing visibility
    return res.status(200).json({ success: true, code });
  } catch (error: any) {
    console.error("[send-code] Twilio message failed", {
      error: error.message,
      phone,
      code,
    });
    return res.status(500).json({ error: error.message });
  }
}

export { codeStore };
