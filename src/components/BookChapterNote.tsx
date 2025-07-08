import * as React from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../AuthContext";
import { logger, logSupabaseError } from "../lib/logger";

export interface BookChapterNoteProps {
  book: string;
  chapter?: number;
  label: string;
  onSaved?: () => void;
}

export default function BookChapterNote({ book, chapter, label, onSaved }: BookChapterNoteProps) {
  const { profile } = useAuth();
  const loginId =
    profile?.id ||
    (typeof window !== "undefined" ? localStorage.getItem("loginId") || undefined : undefined);
  const [noteId, setNoteId] = React.useState<string | null>(null);
  const [content, setContent] = React.useState<string>("");
  const [savedContent, setSavedContent] = React.useState<string>("");

  React.useEffect(() => {
    const fetchNote = async () => {
      if (!supabase || !loginId) {
        logger.warn("[BookChapterNote] Supabase or loginId missing");
        return;
      }
      logger.debug(
        `[BookChapterNote] Fetching note for ${book} ${
          chapter !== undefined ? `chapter ${chapter}` : ""
        }`
      );
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

      // If multiple notes exist, grab the most recently updated one
      query = query.order("updatedAt", { ascending: false }).limit(1);

      const { data, error } = await query.maybeSingle();

      if (error) {
        logSupabaseError('BookChapterNote fetchNote', error);
      } else if (data) {
        logger.debug(
          `[BookChapterNote] Loaded note ${data.id} with content length ${
            data.content?.length ?? 0
          }`
        );
        setNoteId(data.id);
        setContent(data.content ?? "");
        setSavedContent(data.content ?? "");
      } else {
        logger.debug("[BookChapterNote] No note found");
        setNoteId(null);
        setContent("");
        setSavedContent("");
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

    const { error } = await supabase
      .from("Note")
      .upsert({
        id,
        loginId,
        book,
        chapter: chapter ?? null,
        verse: null,
        content,
        updatedAt: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      logSupabaseError('BookChapterNote saveNote', error);
    } else {
      setNoteId(id);
      setSavedContent(content);
      onSaved?.();
    }
  };

  return (
    <div style={{ width: "100%", marginBottom: "1rem" }}>
      <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>{label}</div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        style={{ width: "100%" }}
        placeholder={label}
      />
      <button
        onClick={saveNote}
        disabled={content === savedContent}
        style={{
          marginTop: "0.25rem",
          backgroundColor: content !== savedContent ? "#69c0ff" : "#f0f0f0",
          cursor: content !== savedContent ? "pointer" : "default",
        }}
      >
        Update
      </button>
    </div>
  );
}
