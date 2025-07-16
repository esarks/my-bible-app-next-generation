export type Verse = {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  /** Raw HTML string with formatting like italics or red lettering. */
  html?: string;
  red?: boolean;
  italic?: boolean;
  paragraph?: boolean;
  strongs?: string[];
  notes?: string[];
};

import { logger } from "../lib/logger";

/**
 * Loads scripture verses from local JSON files or API.
 */
export async function getScripture(
  version: string,
  book: string,
  chapter: number
): Promise<Verse[]> {
  // Handle NIV via external API
  if (version === "niv_api") {
    return getPassageVerses(book, chapter);
  }

  try {
    // Dynamically load the appropriate Bible JSON file (e.g., net.json)
    const module = await import(`../data/${version}.json`);
    const data = module.default || module;

    const chapterData = data?.[book]?.[chapter];
    if (!Array.isArray(chapterData)) {
      logger.warn(`[api] No array found for ${version} ${book} ${chapter}`);
      return [];
    }

    return chapterData.map((v: any, idx: number): Verse => ({
      book,
      chapter,
      verse: v.verse ?? idx + 1,
      text: v.text ?? "",
      html: v.html ?? undefined,
      red: v.red ?? false,
      italic: v.italic ?? false,
      paragraph: v.paragraph ?? false,
      strongs: Array.isArray(v.strongs) ? v.strongs : [],
      notes: Array.isArray(v.notes) ? v.notes : [],
    }));
  } catch (error) {
    logger.error(`[api] Failed to load version=${version}`, error);
    return [];
  }
}

/**
 * Gets raw HTML content for a Bible passage (used by NIV API).
 */
export async function getPassageHtml(
  book: string,
  chapter: number,
  verse?: number,
  bibleId = "de4e12af7f28f599-01"
): Promise<string> {
  const params = new URLSearchParams({ book, chapter: String(chapter) });
  if (verse !== undefined) params.append("verse", String(verse));
  const url = `/api/api-bible/${bibleId}?${params.toString()}`;
  logger.info("[api] fetch", url);
  const res = await fetch(url);

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch passage");
  }
  return data.data?.content || "";
}

/**
 * Parses raw HTML content into individual verses (NIV only).
 */
export async function getPassageVerses(
  book: string,
  chapter: number,
  bibleId = "de4e12af7f28f599-01"
): Promise<Verse[]> {
  const html = await getPassageHtml(book, chapter, undefined, bibleId);
  const verses: Verse[] = [];

  if (typeof window !== "undefined") {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    doc.querySelectorAll('span[data-type="verse"]').forEach((el) => {
      const num = parseInt(el.getAttribute("data-number") || "", 10);
      const text = el.textContent || "";
      if (!isNaN(num)) {
        verses.push({ book, chapter, verse: num, text });
      }
    });
  }

  return verses;
}
