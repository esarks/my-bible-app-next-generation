export type Verse = {
  book: string;
  chapter: number;
  verse: number;
  text: string;
};

export async function getScripture(
  version: string,
  book: string,
  chapter: number
): Promise<Verse[]> {
  const res = await fetch(
    `/api/bibles/${version}?book=${encodeURIComponent(book)}&chapter=${chapter}`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch scripture: ${res.statusText}`);
  }

  const data = await res.json();

  return data as Verse[];
}

export async function getPassageHtml(
  book: string,
  chapter: number,
  verse?: number,
  bibleId = "de4e12af7f28f599-01"
): Promise<string> {
  const params = new URLSearchParams({ book, chapter: String(chapter) });
  if (verse !== undefined) params.append("verse", String(verse));
  const res = await fetch(`/api/api-bible/${bibleId}?${params.toString()}`);

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch passage");
  }
  return data.data?.content || "";
}
