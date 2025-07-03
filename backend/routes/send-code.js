// backend/routes/send-code.js
const express = require("express");
const router = express.Router();
const twilio = require("twilio");

//TWILIO_VERIFY=VAdd281d2f09c45e85e9ad9466b2ef3929
//TWILIO_SID=ACba43e938d7270668a6c8758b35a362db
//TWILIO_AUTH_TOKEN=4aacb429a7d0105a48cee5ce5092a993
//TWILIO_PHONE_NUMBER=+17275917765

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_VERIFY;

console.log("[DEBUG] TWILIO_SID:", process.env.TWILIO_SID);
console.log("[DEBUG] TWILIO_AUTH_TOKEN:", process.env.TWILIO_AUTH_TOKEN);
console.log("[DEBUG] TWILIO_SERVICE_SID:", process.env.TWILIO_VERIFY);

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
