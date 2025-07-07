import * as React from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../AuthContext";
import { logger, logSupabaseError } from "../lib/logger";

export interface BookChapterNoteProps {
  book: string;
  chapter?: number;
  label: string;
}

export default function BookChapterNote({ book, chapter, label }: BookChapterNoteProps) {
  const { profile } = useAuth();
  const loginId = profile?.phoneNumber;
  const [noteId, setNoteId] = React.useState<string | null>(null);
  const [content, setContent] = React.useState<string>("");

  React.useEffect(() => {
    const fetchNote = async () => {
      if (!supabase || !loginId) {
        logger.warn("[BookChapterNote] Supabase or loginId missing");
        return;
      }
      let query = supabase
        .from("Note")
        .select("id,content")
        .eq("loginId", loginId)
        .eq("book", book)
        .is("verse", null);
      if (chapter === undefined) {
        query = query.is("chapter", null);
      } else {
        query = query.eq("chapter", chapter);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        logSupabaseError('BookChapterNote fetchNote', error);
      } else if (data) {
        setNoteId(data.id);
        setContent(data.content ?? "");
      } else {
        setNoteId(null);
        setContent("");
      }
    };

    fetchNote();
  }, [loginId, book, chapter]);

  const saveNote = async () => {
    if (!supabase || !loginId) {
      logger.warn("[BookChapterNote] Cannot save without Supabase or loginId");
      return;
    }

    const id = noteId ?? crypto.randomUUID();
    const prefix =
      chapter === undefined
        ? `Notes for Book ${book}`
        : `Notes for Chapter ${book} ${chapter}`;

    const { error } = await supabase
      .from("Note")
      .upsert({
        id,
        loginId,
        book,
        chapter: chapter ?? null,
        verse: null,
        content: `${prefix}: ${content}`,
        updatedAt: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      logSupabaseError('BookChapterNote saveNote', error);
    } else {
      setNoteId(id);
    }
  };

  return (
    <div style={{ width: "100%", marginBottom: "1rem" }}>
      <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>{label}</div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={saveNote}
        rows={3}
        style={{ width: "100%" }}
        placeholder={label}
      />
    </div>
  );
}
