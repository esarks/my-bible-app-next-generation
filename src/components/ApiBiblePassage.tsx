import * as React from "react";
import { logger } from "../lib/logger";

interface ApiBiblePassageProps {
  book: string;
  chapter: number;
  verse?: number;
}

export default function ApiBiblePassage({ book, chapter, verse }: ApiBiblePassageProps) {
  const [html, setHtml] = React.useState<string>("");

  React.useEffect(() => {
    const params = new URLSearchParams({ book, chapter: String(chapter) });
    if (verse !== undefined) params.append("verse", String(verse));
    fetch(`/api/api-bible/de4e12af7f28f599-01?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        logger.debug("[ApiBiblePassage] fetched", data);
        setHtml(data.data?.content || "");
      })
      .catch((err) => {
        logger.error("[ApiBiblePassage] fetch error", err);
      });
  }, [book, chapter, verse]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
