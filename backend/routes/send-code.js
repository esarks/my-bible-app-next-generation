// backend/routes/send-code.js
const express = require("express");
const router = express.Router();
const twilio = require("twilio");

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneFrom = process.env.TWILIO_PHONE_NUMBER;

console.log("[DEBUG] TWILIO_SID:", accountSid);
console.log("[DEBUG] TWILIO_AUTH_TOKEN:", authToken);
console.log("[DEBUG] TWILIO_PHONE_NUMBER:", phoneFrom);

const client = twilio(accountSid, authToken);

// In-memory storage for codes — replace with DB or Redis in production
const verificationCodes = {}; // { "+17278040148": "123456" }

router.post("/", async (req, res) => {
  let { phone } = req.body;
  console.log("[/api/send-code] Received phone:", phone);

  // Normalize to E.164 format if needed
  if (!phone.startsWith("+1")) {
    phone = "+1" + phone.replace(/\D/g, "");
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationCodes[phone] = code;

  try {
    const message = await client.messages.create({
      body: `Your MyBibleApp login code is: ${code}`,
      from: phoneFrom,
      to: phone,
    });

    console.log("[/api/send-code] Message SID:", message.sid);
    res.json({ success: true, phone, codeSent: true });
  } catch (err) {
    console.error("[/api/send-code] Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
