// backend/routes/verify-code.js
const express = require("express");
const router = express.Router();
const twilio = require("twilio");
const { normalizePhone } = require("../utils/phone");
const logger = require("../utils/logger");

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_VERIFY;

const client = twilio(accountSid, authToken);

router.post("/", async (req, res) => {
  logger.info("[/api/verify-code] Incoming request");
  let { phone, code } = req.body;
  logger.debug("[/api/verify-code] Raw payload", { phone, code });

  // Normalize phone using shared utility
  try {
    phone = normalizePhone(phone);
    logger.debug(`[/api/verify-code] Normalized phone: ${phone}`);
  } catch (err) {
    return res.status(400).json({ error: "Invalid phone number" });
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
    logger.error(
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

    logger.debug("[/api/verify-code] Twilio response", verificationCheck);

    if (verificationCheck.status === "approved") {
      logger.info("[/api/verify-code] Code approved");
      return res.status(200).json({ success: true });
    } else {
      logger.info(
        "[/api/verify-code] Invalid code status",
        verificationCheck.status
      );
      return res.status(401).json({ error: "Invalid verification code" });
    }
  } catch (err) {
    logger.error("[/api/verify-code] Error:", err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;

