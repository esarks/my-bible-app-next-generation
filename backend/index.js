// backend/index.js
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const logger = require("./utils/logger");

const app = express();
const port = process.env.PORT || 5000;

// Warn if Twilio environment variables are missing, but continue to start.
// Individual routes already check for required variables and return
// appropriate errors so the server can still function for non-Twilio
// features like Bible retrieval even when these are absent.
const requiredTwilioVars = [
  "TWILIO_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_VERIFY",
];
const missingTwilioVars = requiredTwilioVars.filter((v) => !process.env[v]);
if (missingTwilioVars.length) {
  logger.warn(
    `[server] Missing Twilio environment variables: ${missingTwilioVars.join(", ")}`
  );
}

// Middleware
app.use(cors());
app.use(express.json());

// Route loading with error safety
try {
  const sendCodeRoute = require(path.join(__dirname, "routes", "send-code"));
  app.use("/api/send-code", sendCodeRoute);
  logger.info("Loaded /api/send-code");
} catch (err) {
  logger.error("Failed to load ./routes/send-code.js", err.message);
}

try {
  const verifyCodeRoute = require(path.join(__dirname, "routes", "verify-code"));
  app.use("/api/verify-code", verifyCodeRoute);
  logger.info("Loaded /api/verify-code");
} catch (err) {
  logger.error("Failed to load ./routes/verify-code.js", err.message);
}

try {
  const biblesRoute = require(path.join(__dirname, "routes", "bibles"));
  app.use("/api/bibles", biblesRoute);
  logger.info("Loaded /api/bibles");
} catch (err) {
  logger.error("Failed to load ./routes/bibles.js", err.message);
}

try {
  const apiBibleRoute = require(path.join(__dirname, "routes", "api-bible"));
  app.use("/api/api-bible", apiBibleRoute);
  logger.info("Loaded /api/api-bible");
} catch (err) {
  logger.error("Failed to load ./routes/api-bible.js", err.message);
}

// Start server
app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});
