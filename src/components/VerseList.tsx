import React from "react";

type Verse = {
  book: string;
  chapter: number;
  verse: number;
  text: string;
};

type VerseListProps = {
  verses: Verse[];
};

const VerseList: React.FC<VerseListProps> = ({ verses }) => {
  if (!verses?.length) return <div>No verses found.</div>;

  return (
    <div style={{ padding: "1rem" }}>
      {verses.map((v, i) => (
        <div key={i} style={{ marginBottom: "0.5rem" }}>
          <strong>
            {v.book} {v.chapter}:{v.verse}
          </strong>{" "}
          <span>{v.text}</span>
        </div>
      ))}
    </div>
  );
};

export default VerseList;
