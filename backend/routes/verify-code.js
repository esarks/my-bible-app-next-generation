// backend/routes/verify-code.js
const express = require("express");
const router = express.Router();

// Reuse the same in-memory store from send-code.js
// For production, move this to a shared module or a database
const codeStore = require("../store/code-store");

router.post("/", (req, res) => {
  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ error: "Missing phone or code" });
  }

  const expectedCode = codeStore.get(phone);

  if (!expectedCode) {
    return res.status(404).json({ error: "Code not found or expired" });
  }

  if (code === expectedCode) {
    codeStore.delete(phone); // Optional: remove code after successful verification
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ error: "Invalid verification code" });
  }
});

module.exports = router;
