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

interface Verse {
  verse: number;
  text: string;
  html?: string;
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

  React.useEffect(() => {
    if (version && book && chapter) {
      fetch(`/api/bibles/${version}?book=${encodeURIComponent(book)}&chapter=${chapter}`)
        .then((res) => res.json())
        .then((data: Verse[]) => flushSync(() => setVerses(data)))
        .catch((err) => {
          logger.error("Failed to load verses", err);
          setVerses([]);
        });
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
    ScriptureNotesGrid={{
      children: verses.map((v) => (
        <div key={v.verse}>
          <strong>{v.verse}</strong>: {v.text}
        </div>
      )),
    }}
    {...props}
  />
);
}

const Scriptures = React.forwardRef(Scriptures_);
export default Scriptures;
