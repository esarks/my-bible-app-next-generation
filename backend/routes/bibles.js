const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger");

const biblesDir = path.join(__dirname, "..", "bibles");

// The list of available bible versions is small, so we load the metadata on
// each request instead of caching it. This allows changes to the underlying
// JSON files (like net.json) to be picked up without restarting the server.

function loadVersions() {
  try {
    const files = fs
      .readdirSync(biblesDir)
      .filter((f) => f.endsWith(".json"));
    const versions = files.map((file) => {
      const data = JSON.parse(
        fs.readFileSync(path.join(biblesDir, file), "utf8")
      );
      const { name, shortname, module } = data.metadata || {};
      return { name, shortname, module };
    });
    return versions;
  } catch (err) {
    logger.error("[bibles] Failed to read versions", err);
    throw err;
  }
}

router.get("/", (req, res) => {
  try {
    const versions = loadVersions();
    res.json(versions);
  } catch {
    res.status(500).json({ error: "Failed to load versions" });
  }
});

router.get("/:version", (req, res) => {
  const { version } = req.params;
  const { book, chapter } = req.query;
  if (!book || !chapter) {
    return res.status(400).json({ error: "book and chapter required" });
  }
  const filePath = path.join(biblesDir, `${version}.json`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "version not found" });
  }
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const chapNum = parseInt(chapter, 10);
    const verses = (data.verses || []).filter(
      (v) => v.book_name === book && v.chapter === chapNum
    );
    if (process.env.NODE_ENV !== "test") {
      const sample = verses[0];
      logger.debug(
        `[bibles] Loaded ${verses.length} verses from ${version}.json ` +
          `(red_letter=${data.metadata?.red_letter}, italics=${data.metadata?.italics}, ` +
          `notes field in sample=${sample?.notes ? "present" : "none"})`
      );
      if (sample) {
        logger.debug("[bibles] Sample verse", sample);
      }
    }
    res.json(verses);
  } catch (err) {
    logger.error("[bibles] Error reading", err);
    res.status(500).json({ error: "failed to read bible" });
  }
});

module.exports = router;
