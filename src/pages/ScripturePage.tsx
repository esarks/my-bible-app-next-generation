import React from "react";
import PageLayoutWrapper from "../components/PageLayoutWrapper";
import Scriptures from "../components/Scriptures";
import { logger } from "../lib/logger";

export default function ScripturesPage() {
  React.useEffect(() => {
    logger.info("Rendering ScripturePage");
  }, []);
  return (
    <PageLayoutWrapper>
      <Scriptures />
    </PageLayoutWrapper>
  );
}
