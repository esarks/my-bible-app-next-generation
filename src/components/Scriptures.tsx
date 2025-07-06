import * as React from "react";
import {
  PlasmicScriptures,
  DefaultScripturesProps
} from "../plasmic/my_bible_app_next_generation/PlasmicScriptures";
import { HTMLElementRefOf } from "@plasmicapp/react-web";
import { bibleBooks } from "../lib/bibleData";
import { bibleVersions } from "../lib/bibleVersions";
import { logger } from "../lib/logger";
import { flushSync } from "react-dom";
import ScriptureNotesGrid from "./ScriptureNotesGrid";

interface Verse {
  verse: number;
  text: string;
}

export interface ScripturesProps extends DefaultScripturesProps {}

function Scriptures_(props: ScripturesProps, ref: HTMLElementRefOf<"div">) {
  const [book, setBook] = React.useState<string | undefined>();
  const [chapter, setChapter] = React.useState<number | undefined>();
  const [version, setVersion] = React.useState<string | undefined>();
  const [verses, setVerses] = React.useState<Verse[]>([]);

  const versions = React.useMemo(
    () => bibleVersions.map((v) => ({ value: v.module, label: v.shortname || v.name })),
    []
  );

  const bookOptions = React.useMemo(
    () => bibleBooks.map((b) => ({ value: b.name, label: b.name })),
    []
  );

  const chapterOptions = React.useMemo(() => {
    const selected = bibleBooks.find((b) => b.name === book);
    return selected
      ? Array.from({ length: selected.chapters }, (_, i) => ({
          value: i + 1,
          label: String(i + 1),
        }))
      : [];
  }, [book]);

  React.useEffect(() => {
    if (!version) {
      setVersion(bibleVersions[0]?.module);
      setBook(bibleBooks[0]?.name);
      setChapter(1);
    }
  }, []);

  // When the version changes and no book is selected, reset to defaults
  React.useEffect(() => {
    if (version && book === undefined) {
      setBook(bibleBooks[0]?.name);
      setChapter(1);
    }
  }, [version, book]);

  React.useEffect(() => {
    if (version && book && chapter) {
      logger.debug(
        `Fetching verses for ${book} chapter ${chapter} from version ${version}`
      );
      fetch(
        `/api/bibles/${version}?book=${encodeURIComponent(book)}&chapter=${chapter}`
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP ${res.status} ${res.statusText}`);
          }
          return res.json();
        })
        .then((data: Verse[]) => {
          if (!data.length) {
            logger.warn(
              `No verses returned for ${book} chapter ${chapter} from version ${version}`
            );
            setVerses([]);
            return;
          }
          flushSync(() => {
            setVerses(data);
          });
          data.forEach((v, idx) => {
            logger.info(
              `Displaying verse ${idx + 1}/${data.length}: ${v.text}`
            );
          });
        })
        .catch((err) => {
          logger.error("Failed to load verses", err);
          setVerses([]);
        });
    } else {
      setVerses([]);
    }
  }, [version, book, chapter]);

  return (
    <PlasmicScriptures
      root={{ ref }}
      versionSelect={{
        options: versions,
        value: version,
        onChange: (v) => {
          setVersion(v as string);
          setBook(undefined);
          setChapter(undefined);
        },
      }}
      bookSelect={{
        options: bookOptions,
        value: book,
        onChange: (b) => {
          setBook(b as string);
          setChapter(1);
        },
      }}
      chapterSelect={{
        options: chapterOptions,
        value: chapter,
        onChange: (c) => setChapter(c as number),
      }}
      // Inject verse display into ScriptureNotesGrid slot
      ScriptureNotesGrid={{
        children: [
          book && chapter ? (
            <h2 key="heading" style={{ marginTop: "1rem" }}>
              {book} {chapter}
            </h2>
          ) : null,
          ...verses.map((v) => (
            <ScriptureNotesGrid
              key={v.verse}
              book={book!}
              chapter={chapter!}
              verse={v.verse}
              text={v.text}
            />
          )),
        ],
      }}
      {...props}
    />
  );
}

const Scriptures = React.forwardRef(Scriptures_);
export default Scriptures;
