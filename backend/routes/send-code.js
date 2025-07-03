// backend/routes/send-code.js
const express = require("express");
const router = express.Router();
const twilio = require("twilio");

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;

console.log("[DEBUG] TWILIO_SID:", process.env.TWILIO_SID);
console.log("[DEBUG] TWILIO_AUTH_TOKEN:", process.env.TWILIO_AUTH_TOKEN);
console.log("[DEBUG] TWILIO_SERVICE_SID:", process.env.TWILIO_SERVICE_SID);

const client = twilio(accountSid, authToken);

router.post("/", async (req, res) => {
  const { phone } = req.body;
  console.log("[/api/send-code] Received phone:", phone);

  try {
    const verification = await client.verify
      .v2.services(serviceSid)
      .verifications.create({ to: phone, channel: "sms" });

    res.json({ success: true, code: "(not returned from Twilio)" });
  } catch (err) {
    console.error("[/api/send-code] Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
