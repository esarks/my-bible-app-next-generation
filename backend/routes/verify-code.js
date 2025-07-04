// backend/routes/verify-code.js
const express = require("express");
const router = express.Router();
const twilio = require("twilio");

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_VERIFY;

const client = twilio(accountSid, authToken);

router.post("/", async (req, res) => {
  let { phone, code } = req.body;

  // Normalize to E.164 format if needed (consistent with send-code.js)
  if (!phone.startsWith("+1")) {
    phone = "+1" + phone.replace(/\D/g, "");
  }

  if (!phone || !code) {
    return res.status(400).json({ error: "Missing phone or code" });
  }

  // Verify all required Twilio environment variables are present
  if (!accountSid || !authToken || !serviceSid) {
    const missing = [];
    if (!accountSid) missing.push("TWILIO_SID");
    if (!authToken) missing.push("TWILIO_AUTH_TOKEN");
    if (!serviceSid) missing.push("TWILIO_VERIFY");
    console.error(
      "[/api/verify-code] Missing environment variables:",
      missing.join(", ")
    );
    return res
      .status(500)
      .json({ error: "Twilio configuration missing" });
  }

  try {
    const verificationCheck = await client.verify
      .v2.services(serviceSid)
      .verificationChecks.create({ to: phone, code });

    if (verificationCheck.status === "approved") {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ error: "Invalid verification code" });
    }
  } catch (err) {
    console.error("[/api/verify-code] Error:", err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;

