// Fully manual Scriptures.tsx with user info and full notes support
import * as React from "react";
import PageLayoutWrapper from "./PageLayoutWrapper";
import ScriptureNotesGrid from "./ScriptureNotesGrid";
import BookChapterNote from "./BookChapterNote";
import { HTMLElementRefOf } from "@plasmicapp/react-web";
import { bibleBooks } from "../lib/bibleData";
import { bibleVersions } from "../lib/bibleVersions";
import { logger } from "../lib/logger";
import { flushSync } from "react-dom";
import { getScripture } from "../services/api";
import { useAuth } from "../AuthContext";
import { supabase } from "../lib/supabaseClient";

interface Verse {
  verse: number;
  text: string;
  /** Optional HTML string for formatted text */
  html?: string;
  red?: boolean;
  italic?: boolean;
  paragraph?: boolean;
  strongs?: string[];
  notes?: string[];
}

interface Note {
  id: string;
  loginId: string;
  book: string;
  chapter?: number;
  verse?: number;
  content: string;
}

function Scriptures_(props: {}, ref: HTMLElementRefOf<"div">) {
  const { profile } = useAuth();
  const loginId =
    profile?.id ||
    (typeof window !== "undefined" ? localStorage.getItem("loginId") || undefined : undefined);
  const userName = profile?.name ?? "";

  const [book, setBook] = React.useState<string | undefined>(undefined);
  const [chapter, setChapter] = React.useState<number | undefined>(undefined);
  const [version, setVersion] = React.useState<string | undefined>(undefined);
  const [verses, setVerses] = React.useState<Verse[]>([]);
  const [notes, setNotes] = React.useState<Note[]>([]);

  React.useEffect(() => {
    if (!version) {
      setVersion(bibleVersions[0]?.module);
      setBook(bibleBooks[0]?.name);
      setChapter(1);
    }
  }, []);

  React.useEffect(() => {
    if (version && book && chapter) {
      logger.debug(`Fetching verses for ${book} chapter ${chapter}`);
      getScripture(version, book, chapter)
        .then((data) => {
          flushSync(() => {
            setVerses(data);
          });
        })
        .catch((err) => {
          logger.error("Error fetching verses", err);
          logger.error("Error message", err instanceof Error ? err.message : err);
          setVerses([]);
        });
    }
  }, [version, book, chapter]);

  const fetchNotes = React.useCallback(async () => {
    if (!supabase || !loginId || !book || chapter === undefined) {
      logger.warn("[Scriptures] Cannot load notes - missing supabase or loginId");
      setNotes([]);
      return;
    }

      logger.debug(
        `[Scriptures] Loading notes for ${book} chapter ${chapter} (loginId=${loginId})`
      );

      try {
        const [bookNoteRes, chapterNoteRes, verseNotesRes] = await Promise.all([
          supabase
            .from("Note")
            .select("*")
            .eq("loginId", loginId)
            .eq("book", book)
            .is("chapter", null)
            .is("verse", null)
            .order("updatedAt", { ascending: false })
            .limit(1)
            .maybeSingle(),

          supabase
            .from("Note")
            .select("*")
            .eq("loginId", loginId)
            .eq("book", book)
            .eq("chapter", chapter)
            .is("verse", null)
            .order("updatedAt", { ascending: false })
            .limit(1)
            .maybeSingle(),

          supabase
            .from("Note")
            .select("*")
            .eq("loginId", loginId)
            .eq("book", book)
            .eq("chapter", chapter)
            .not("verse", "is", null)
            .order("updatedAt", { ascending: false }),
        ]);

        const notesArray: Note[] = [];
        if (bookNoteRes.data) notesArray.push(bookNoteRes.data);
        if (chapterNoteRes.data) notesArray.push(chapterNoteRes.data);
        if (verseNotesRes.data) {
          const unique = new Map<number, Note>();
          for (const vn of verseNotesRes.data) {
            const key = vn.verse!;
            if (!unique.has(key)) {
              unique.set(key, vn);
            }
          }
          notesArray.push(...unique.values());
        }

        logger.debug(
          `[Scriptures] Loaded ${notesArray.length} notes (book=${
            bookNoteRes.data ? 1 : 0
          }, chapter=${chapterNoteRes.data ? 1 : 0}, verses=${
            verseNotesRes.data ? verseNotesRes.data.length : 0
          })`
        );

      setNotes(notesArray);
    } catch (error) {
      logger.error("Error loading notes", error);
    }
  }, [loginId, book, chapter]);

  React.useEffect(() => {
    fetchNotes();
  }, [fetchNotes, version]);

  const versions = bibleVersions.map((v) => ({ value: v.module, label: v.shortname || v.name }));
  const bookOptions = bibleBooks.map((b) => ({ value: b.name, label: b.name }));
  const chapterOptions = React.useMemo(() => {
    const b = bibleBooks.find((x) => x.name === book);
    return b ? Array.from({ length: b.chapters }, (_, i) => ({ value: i + 1, label: String(i + 1) })) : [];
  }, [book]);

  return (
    <PageLayoutWrapper>
      <div ref={ref} style={{ padding: "1rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <strong>User:</strong> {userName || "(no name)"} | <strong>ID:</strong> {loginId}
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label>Version:</label>
            <select
              value={version}
              onChange={(e) => {
                setVersion(e.target.value);
              }}
            >
              {versions.map((v) => (
                <option key={v.value} value={v.value}>{v.label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label>Book:</label>
            <select
              value={book}
              onChange={(e) => {
                setBook(e.target.value);
                setChapter(1);
              }}
            >
              {bookOptions.map((b) => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label>Chapter:</label>
            <select
              value={chapter}
              onChange={(e) => setChapter(parseInt(e.target.value))}
            >
              {chapterOptions.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        {book && chapter && (
          <h2 style={{ marginTop: "1rem" }}>{book} {chapter}</h2>
        )}

        {book && (
          <div style={{ marginTop: "1rem" }}>
            <strong>Book Notes [{book}]:</strong>
            <BookChapterNote
              book={book}
              label={`Notes for ${book}`}
              onSaved={fetchNotes}
            />
          </div>
        )}

        {book && chapter && (
          <div style={{ marginTop: "1rem" }}>
            <strong>Chapter Notes [{chapter}]:</strong>
            <BookChapterNote
              book={book}
              chapter={chapter}
              label={`Notes for ${book} ${chapter}`}
              onSaved={fetchNotes}
            />
          </div>
        )}

        <div style={{ paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {verses.map((v) => {
            const note = notes.find(
              (n) =>
                n.book === book &&
                n.chapter === chapter &&
                n.verse != null &&
                n.verse === v.verse
            );
            logger.debug(
              `[Scriptures] Displaying verse ${v.verse} ` +
                `(metaNotes=${v.notes ? v.notes.length : 0}, ` +
                `red=${v.red ? 1 : 0}, ` +
                `note length=${note?.content?.length ?? 0})`
            );
            const verseContent = v.html ? (
              <span
                className={v.red ? "text-red-600" : undefined}
                dangerouslySetInnerHTML={{ __html: v.html }}
              />
            ) : (
              <span className={v.red ? "text-red-600" : undefined}>
                {v.italic ? <em>{v.text}</em> : v.text}
              </span>
            );
            const formatted = (
              <>
                {v.paragraph && <span>¶ </span>}
                {verseContent}
              </>
            );
            return (
              <ScriptureNotesGrid
                key={v.verse}
                book={book!}
                chapter={chapter!}
                verse={v.verse}
                text={v.text}
                formattedText={formatted}
                strongs={v.strongs}
                metaNotes={v.notes}
                noteContent={note?.content || ""}
                onSave={() => fetchNotes()}
              />
            );
          })}
        </div>
      </div>
    </PageLayoutWrapper>
  );
}

const Scriptures = React.forwardRef(Scriptures_);
export default Scriptures;
