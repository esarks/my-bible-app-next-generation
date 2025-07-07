// Fully manual Scriptures.tsx with full control and no Plasmic dependency

import * as React from "react";
import PageLayoutWrapper from "./PageLayoutWrapper";
import ScriptureNotesGrid from "./ScriptureNotesGrid";
import BookChapterNote from "./BookChapterNote";
import { HTMLElementRefOf } from "@plasmicapp/react-web";
import { bibleBooks } from "../lib/bibleData";
import { bibleVersions } from "../lib/bibleVersions";
import { logger } from "../lib/logger";
import { flushSync } from "react-dom";
import { useAuth } from "../AuthContext";

interface Verse {
  verse: number;
  text: string;
}

export interface ScripturesProps {}

function Scriptures_(props: ScripturesProps, ref: HTMLElementRefOf<"div">) {
  const { profile } = useAuth();
  const [book, setBook] = React.useState<string | undefined>(undefined);
  const [chapter, setChapter] = React.useState<number | undefined>(undefined);
  const [version, setVersion] = React.useState<string | undefined>(undefined);
  const [verses, setVerses] = React.useState<Verse[]>([]);

  const versions = React.useMemo(
    () => bibleVersions.map((v) => ({ value: v.module, label: v.shortname || v.name })),
    []
  );

  React.useEffect(() => {
    if (!version) {
      setVersion(bibleVersions[0]?.module);
      setBook(bibleBooks[0]?.name);
      setChapter(1);
    }
  }, []);

  React.useEffect(() => {
    if (version && book && chapter) {
      logger.debug(`Fetching verses for ${book} chapter ${chapter} from version ${version}`);
      fetch(`/api/bibles/${version}?book=${encodeURIComponent(book)}&chapter=${chapter}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP ${res.status} ${res.statusText}`);
          }
          return res.json();
        })
        .then((data: Verse[]) => {
          const found = bibleBooks.find((b) => b.name === book);
          if (!data.length) {
            logger.warn(`No verses returned for ${book} chapter ${chapter} from version ${version}`);
            alert(`No verses found for ${book} chapter ${chapter}`);
            setVerses([]);
            return;
          }
          flushSync(() => {
            setVerses(data);
          });
          if (found) {
            logger.debug(`Loaded ${found.name} chapter ${chapter} successfully`);
          } else {
            logger.debug(`Book not in list: ${book}`);
            alert(`Book "${book}" was not found.`);
          }
        })
        .catch((err) => {
          logger.error("Failed to load verses", err);
          alert(`Failed to load ${book} chapter ${chapter}: ${err.message}`);
          setVerses([]);
        });
    } else {
      setVerses([]);
    }
  }, [version, book, chapter]);

  const bookOptions = React.useMemo(
    () => bibleBooks.map((b) => ({ value: b.name, label: b.name })),
    []
  );

  const chapterOptions = React.useMemo(() => {
    const selected = bibleBooks.find((b) => b.name === book);
    if (!selected) {
      return [];
    }
    return Array.from({ length: selected.chapters }, (_, i) => ({
      value: i + 1,
      label: String(i + 1),
    }));
  }, [book]);

  return (
    <PageLayoutWrapper>
      <div ref={ref} style={{ padding: "1rem", position: "relative" }}>
        {profile && (
          <div style={{ position: "absolute", top: 0, left: 0 }}>
            <strong>{profile.name}</strong> {profile.phoneNumber}
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", width: "150px" }}>
            <label style={{ marginBottom: "0.25rem", fontWeight: 500 }}>Version:</label>
            <select
              value={version}
              onChange={(e) => {
                setVersion(e.target.value);
                setBook(undefined);
                setChapter(undefined);
              }}
            >
              {versions.map((v) => (
                <option key={v.value} value={v.value}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", width: "150px" }}>
            <label style={{ marginBottom: "0.25rem", fontWeight: 500 }}>Book:</label>
            <select
              value={book}
              onChange={(e) => {
                const newBook = e.target.value;
                logger.debug(`Selected book ${newBook}`);
                setBook(newBook);
                setChapter(1);
              }}
            >
              {bookOptions.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", width: "100px" }}>
            <label style={{ marginBottom: "0.25rem", fontWeight: 500 }}>Chapter:</label>
            <select
              value={chapter}
              onChange={(e) => {
                const chapNum = parseInt(e.target.value);
                logger.debug(`Selected chapter ${chapNum}`);
                setChapter(chapNum);
              }}
            >
              {chapterOptions.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {book && chapter && (
          <>
            <h2 style={{ marginTop: "1rem" }}>{book} {chapter}</h2>
            <textarea
              style={{ width: "100%", minHeight: "60px", marginTop: "1rem" }}
              placeholder={`Book notes for [${book}]`}
            />
            <textarea
              style={{ width: "100%", minHeight: "60px", marginTop: "0.5rem" }}
              placeholder={`Chapter notes for [${chapter}]`}
            />
          </>
        )}

        {book && (
          <BookChapterNote book={book} label="Book Notes" />
        )}

        {book && chapter && (
          <BookChapterNote book={book} chapter={chapter} label="Chapter Notes" />
        )}

        <div
          style={{
            paddingTop: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {verses.map((v) => (
            <ScriptureNotesGrid
              key={v.verse}
              book={book!}
              chapter={chapter!}
              verse={v.verse}
              text={v.text}
              placeholder={`Verse notes for [${v.verse}]`}
            />
          ))}
        </div>
      </div>
    </PageLayoutWrapper>
  );
}

const Scriptures = React.forwardRef(Scriptures_);
export default Scriptures;
