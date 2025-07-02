const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const twilio = require("twilio");

// Load environment variables
dotenv.config();

// Validate environment variables
const { TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, PORT = 5000 } = process.env;
if (!TWILIO_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
  console.error("Missing required Twilio configuration.");
  process.exit(1);
}

const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);
const app = express();

app.use(cors());
app.use(express.json());

// Temporary in-memory store for verification codes
const codeStore = new Map();

// POST /send-code
app.post("/send-code", async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "Missing phone number" });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  codeStore.set(phone, code);

  try {
    const message = await client.messages.create({
      body: `Your verification code is: ${code}`,
      from: TWILIO_PHONE_NUMBER,
      to: phone,
    });

    console.log(`Verification code sent to ${phone} with SID: ${message.sid}`);
    res.status(200).json({ success: true, code }); // In prod, remove code from response
  } catch (err) {
    console.error("Twilio send error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /verify-code?phone=...&code=...
app.get("/verify-code", (req, res) => {
  const { phone, code } = req.query;

  const storedCode = codeStore.get(phone);
  if (storedCode === code) {
    codeStore.delete(phone); // one-time use
    return res.json({ success: true });
  } else {
    return res.status(400).json({ error: "Invalid or expired code" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
