import { logger } from "../lib/logger";
import net from "../../backend/bibles/net.json"; // <-- static import required

export type Verse = {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  html?: string;
  red?: boolean;
  italic?: boolean;
  paragraph?: boolean;
  strongs?: string[];
  notes?: string[];
};

export async function getScripture(
  version: string,
  book: string,
  chapter: number
): Promise<Verse[]> {
  if (version === "net") {
    return getStaticBibleData(net, book, chapter);
  }

  if (version === "niv_api") {
    return getPassageVerses(book, chapter);
  }

  const res = await fetch(
    `/api/bibles/${version}?book=${encodeURIComponent(book)}&chapter=${chapter}`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch scripture: ${res.statusText}`);
  }

  const data = await res.json();

  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((v: any, idx: number) => ({
    book,
    chapter,
    verse: v.verse ?? idx + 1,
    text: v.text ?? "",
    html: v.html ?? undefined,
    red: v.red ?? false,
    italic: v.italic ?? false,
    paragraph: v.paragraph ?? false,
    strongs: v.strongs ?? [],
    notes: v.notes ?? [],
  }));
}

function getStaticBibleData(
  bibleData: any,
  book: string,
  chapter: number
): Verse[] {
  // Some local Bible JSON files (like net.json) store verses in a flat array
  // under a `verses` key instead of nested book/chapter objects. Detect this
  // format and filter accordingly.
  if (Array.isArray(bibleData.verses)) {
    const normalizedBook = book.replace(/\s+/g, "").toLowerCase();
    return bibleData.verses
      .filter((v: any) => {
        const name = String(v.book_name || "").replace(/\s+/g, "").toLowerCase();
        return name === normalizedBook && v.chapter === chapter;
      })
      .map((v: any) => ({
        book,
        chapter,
        verse: v.verse ?? 0,
        text: v.text ?? "",
        html: v.html ?? undefined,
        red: v.red ?? false,
        italic: v.italic ?? false,
        paragraph: v.paragraph ?? false,
        strongs: v.strongs ?? [],
        notes: v.notes ?? [],
      }));
  }

  const normalizedBook = book.replace(/\s+/g, "").toLowerCase();
  const key = Object.keys(bibleData).find(
    (k) => k.replace(/\s+/g, "").toLowerCase() === normalizedBook
  );

  if (!key) {
    logger.error(`Book not found: ${book}`);
    return [];
  }

  const chapterData = bibleData[key][chapter];
  if (!chapterData) {
    logger.error(`Chapter ${chapter} not found in ${book}`);
    return [];
  }

  return chapterData.map((v: any, idx: number) => ({
    book,
    chapter,
    verse: v.verse ?? idx + 1,
    text: v.text ?? "",
    html: v.html ?? undefined,
    red: v.red ?? false,
    italic: v.italic ?? false,
    paragraph: v.paragraph ?? false,
    strongs: v.strongs ?? [],
    notes: v.notes ?? [],
  }));
}

// No changes needed below this point
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
