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
