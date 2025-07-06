import * as React from "react";
import { PlasmicScriptures } from "../plasmic/my_bible_app_next_generation/PlasmicScriptures";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

function ScripturesPage() {
  const [version, setVersion] = useState("ASV");
  const [book, setBook] = useState("Genesis");
  const [chapter, setChapter] = useState("1");
  const [verses, setVerses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchScriptures() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.scripture.api.bible/v1/bibles/${version}/books/${book}/chapters/${chapter}`,
          {
            headers: {
              "api-key": import.meta.env.VITE_BIBLE_API_KEY as string,
            },
          }
        );

        const data = await res.json();
        const verseList = data?.data?.content?.map((verse: any) => ({
          reference: verse.reference,
          text: verse.text,
        }));

        console.info(`[INFO] Fetched ${verseList?.length ?? 0} verses.`);
        setVerses(verseList ?? []);
      } catch (err) {
        console.error("Failed to fetch scriptures", err);
        setVerses([]);
      } finally {
        setLoading(false);
      }
    }

    fetchScriptures();
  }, [version, book, chapter]);

  return (
    <PlasmicScriptures
      version={version}
      onVersionChange={(e) => setVersion(e.target.value)}
      book={book}
      onBookChange={(e) => setBook(e.target.value)}
      chapter={chapter}
      onChapterChange={(e) => setChapter(e.target.value)}
      scriptureNotesGrid={
        loading ? (
          <div>Loading...</div>
        ) : verses.length > 0 ? (
          <div className="flex flex-col gap-2">
            {verses.map((v, idx) => (
              <div key={idx}>
                <strong>{v.reference}:</strong> {v.text}
              </div>
            ))}
          </div>
        ) : (
          <div>No verses found.</div>
        )
      }
    />
  );
}

export default ScripturesPage;
