// backend/routes/send-code.js
const express = require("express");
const router = express.Router();
const twilio = require("twilio");
const { normalizePhone } = require("../utils/phone");
const logger = require("../utils/logger");

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_VERIFY;

// Avoid logging sensitive values directly
logger.debug("TWILIO_SID loaded");
logger.debug("TWILIO_AUTH_TOKEN loaded");

const client = twilio(accountSid, authToken);

router.post("/", async (req, res) => {
  let { phone } = req.body;
  // Mask phone number when logging
  logger.info("[/api/send-code] Received phone");

  // Verify all required Twilio environment variables are present
  if (!accountSid || !authToken || !serviceSid) {
    const missing = [];
    if (!accountSid) missing.push("TWILIO_SID");
    if (!authToken) missing.push("TWILIO_AUTH_TOKEN");
    if (!serviceSid) missing.push("TWILIO_VERIFY");
    logger.error(
      "[/api/send-code] Missing environment variables:",
      missing.join(", ")
    );
    return res
      .status(500)
      .json({ success: false, error: "Twilio configuration missing" });
  }

  // Normalize phone using shared utility
  try {
    phone = normalizePhone(phone);
  } catch (err) {
    logger.error("[/api/send-code] Invalid phone number:", err.message);
    return res.status(400).json({ success: false, error: "Invalid phone number" });
  }

  logger.debug(`[/api/send-code] Sanitized phone: ${phone}`);

  try {
    const verification = await client.verify
      .v2.services(serviceSid)
      .verifications.create({ to: phone, channel: "sms" });

    logger.info("[/api/send-code] Verification SID:", verification.sid);
    res.json({ success: true, phone, codeSent: true });
  } catch (err) {
    logger.error("[/api/send-code] Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
