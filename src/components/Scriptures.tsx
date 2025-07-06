import * as React from "react";
import { PlasmicScriptures } from "../plasmic/my_bible_app_next_generation/PlasmicScriptures";
import VerseList from "../components/VerseList"; // Adjust path if needed
import { getScripture } from "../services/api"; // Replace with your actual fetch logic

function ScripturesPage() {
  const [version, setVersion] = React.useState("ASV");
  const [book, setBook] = React.useState("Genesis");
  const [chapter, setChapter] = React.useState(1);
  const [verses, setVerses] = React.useState([]);

  React.useEffect(() => {
    async function fetchScripture() {
      try {
        const data = await getScripture(version, book, chapter);
        setVerses(data.verses || []);
        console.log(`Fetched ${data.verses?.length ?? 0} verses.`);
      } catch (error) {
        console.error("Error fetching scripture:", error);
      }
    }
    fetchScripture();
  }, [version, book, chapter]);

  return (
    <PlasmicScriptures
      // These match the names of the AntdSelects in your Plasmic design
      versionSelect={{
        value: version,
        onChange: (value: string) => setVersion(value),
        options: [
          { value: "ASV", label: "ASV" },
          { value: "KJV", label: "KJV" },
          { value: "NIV", label: "NIV" },
        ],
      }}
      bookSelect={{
        value: book,
        onChange: (value: string) => setBook(value),
        options: [
          { value: "Genesis", label: "Genesis" },
          { value: "Exodus", label: "Exodus" },
          { value: "Matthew", label: "Matthew" },
        ],
      }}
      chapterSelect={{
        value: chapter,
        onChange: (value: number) => setChapter(Number(value)),
        options: Array.from({ length: 50 }, (_, i) => ({
          value: i + 1,
          label: `${i + 1}`,
        })),
      }}
      scriptureNotesGrid={
        <VerseList verses={verses} />
      }
    />
  );
}

export default ScripturesPage;
