// backend/routes/send-code.js
const express = require("express");
const router = express.Router();
const twilio = require("twilio");

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_VERIFY;

// Avoid logging sensitive values directly
console.log("[DEBUG] TWILIO_SID loaded");
console.log("[DEBUG] TWILIO_AUTH_TOKEN loaded");

const client = twilio(accountSid, authToken);

router.post("/", async (req, res) => {
  let { phone } = req.body;
  // Mask phone number when logging
  console.log("[/api/send-code] Received phone");

  // Normalize to E.164 format if needed
  if (!phone.startsWith("+1")) {
    phone = "+1" + phone.replace(/\D/g, "");
  }

  try {
    const verification = await client.verify
      .v2.services(serviceSid)
      .verifications.create({ to: phone, channel: "sms" });

    console.log("[/api/send-code] Verification SID:", verification.sid);
    res.json({ success: true, phone, codeSent: true });
  } catch (err) {
    console.error("[/api/send-code] Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
