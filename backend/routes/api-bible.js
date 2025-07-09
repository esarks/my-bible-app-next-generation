const express = require("express");
const router = express.Router();
const logger = require("../utils/logger");

const BIBLE_API_KEY = process.env.BIBLE_API_KEY;
const DEFAULT_BIBLE_ID = "de4e12af7f28f599-01";

router.get("/:bibleId?", async (req, res) => {
  if (!BIBLE_API_KEY) {
    return res.status(500).json({ error: "BIBLE_API_KEY not configured" });
  }
  const { book, chapter, verse } = req.query;
  if (!book || !chapter) {
    return res.status(400).json({ error: "book and chapter required" });
  }
  const bibleId = req.params.bibleId || DEFAULT_BIBLE_ID;
  const reference = verse ? `${book} ${chapter}:${verse}` : `${book} ${chapter}`;
  const url = `https://api.scripture.api.bible/v1/bibles/${bibleId}/passages?content-type=html&reference=${encodeURIComponent(reference)}`;

  try {
    const response = await fetch(url, {
      headers: {
        "api-key": BIBLE_API_KEY,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    res.json(data);
  } catch (err) {
    logger.error("[api-bible] fetch failed", err);
    res.status(500).json({ error: "failed to fetch" });
  }
});

module.exports = router;
