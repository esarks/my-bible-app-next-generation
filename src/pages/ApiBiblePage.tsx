import * as React from "react";
import PageLayoutWrapper from "../components/PageLayoutWrapper";
import ApiBiblePassage from "../components/ApiBiblePassage";

export default function ApiBiblePage() {
  return (
    <PageLayoutWrapper>
      <h2>Genesis 1:1 from API.Bible (NIV)</h2>
      <ApiBiblePassage book="Genesis" chapter={1} verse={1} />
    </PageLayoutWrapper>
  );
}
