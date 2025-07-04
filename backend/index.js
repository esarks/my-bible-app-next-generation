// backend/index.js
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Verify critical Twilio environment variables before loading routes
const requiredTwilioVars = [
  "TWILIO_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_VERIFY",
];
const missingTwilioVars = requiredTwilioVars.filter((v) => !process.env[v]);
if (missingTwilioVars.length) {
  console.error(
    `[server] Missing environment variables: ${missingTwilioVars.join(", ")}`
  );
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Route loading with error safety
try {
  const sendCodeRoute = require(path.join(__dirname, "routes", "send-code"));
  app.use("/api/send-code", sendCodeRoute);
  console.log("[server] Loaded /api/send-code");
} catch (err) {
  console.error("[server] Failed to load ./routes/send-code.js", err.message);
}

try {
  const verifyCodeRoute = require(path.join(__dirname, "routes", "verify-code"));
  app.use("/api/verify-code", verifyCodeRoute);
  console.log("[server] Loaded /api/verify-code");
} catch (err) {
  console.error("[server] Failed to load ./routes/verify-code.js", err.message);
}

// Start server
app.listen(port, () => {
  console.log(`[server] Listening on port ${port}`);
});
