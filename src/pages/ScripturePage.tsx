import React from "react";
import Scriptures from "../components/Scriptures";
import PageLayoutWrapper from "../components/PageLayoutWrapper";
import { logger } from "../lib/logger";

export default function ScripturePage() {
  React.useEffect(() => {
    logger.info("Rendering ScripturePage");
  }, []);
  return (
    <PageLayoutWrapper>
      <Scriptures />
    </PageLayoutWrapper>
  );
}
